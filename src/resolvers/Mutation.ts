import { Collection, Db, MongoClient } from "mongodb";
import { connectDB } from "../mongo";
import { v4 as uuid } from "uuid";
import { AuthorFind, IngredientFind, RecipieFind } from "../types";
import e from "express";

const crypto = require("crypto")



const hash = async (password:string) => {
    return new Promise((resolve, reject) => {
        const salt:string = crypto.randomBytes(8).toString("hex")
  
        crypto.scrypt(password, salt, 64, (err:any, derivedKey:any) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString("hex"))
        });
    }).catch(e =>{console.error("error");}
    )
  }
  
  const verify = async (password:string, hash:string) => {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":")
        crypto.scrypt(password, salt, 64, (err:any, derivedKey:any) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString("hex"))
        });
    }).catch(e =>{console.error(e);}
    )
  }
  

//   type User{
//     id: ID!
//     email: String!
//     pwd: String!
//     token: String
//     recipes: [Recipe!]!
//   }
  

export const Mutation ={

    SignIn: async (parent:any, args:any, {email,password,res}:{email:string, password:string,res:any}) => {
        const db = await connectDB();
        const collection = db.collection("usuarios"); 
        // console.log("\nHOLA");
        // console.log(email);
        if(email == null || password == null){
          console.log("faltan email o contrasena")
          res.status(401)
          return "faltan email o contraseña"
        }
  
        const existe = await collection.findOne({ email });
        if (existe) { 
            return res.status(409).send("Ya existe un usuario con este email.");
        }
        const password1 = await hash(password);


      
          const token = uuid();
      
          
          // const crypto = require("crypto")
      
       
          await collection.insertOne({ email, password:password1, token });
        console.log(`Bienvenido usuario, tu token de sesion es: ${token}`);
        res.status(200);
        return `Bienvenido usuario, tu token de sesion es: ${token}`;
    },


  
    LogIn: async (parent:any, args:any, {email,password,res}:{email:string, password:string,res:any}) => {
      const db = await connectDB();
      const collection = db.collection("usuarios");



      const usu = await collection.findOne({ email });
      if(usu !=null){
        //console.log("usuario EXISTE");
        const logged= usu!.token;
        //console.log(logged);
        if (logged != null) {
          console.log("usuario ya logeado");
          res.status(401)
          return "usuario ya logeado";
        } 

        else{
          const passwordDB:string = usu!.password;
          const verificado = await verify(password, passwordDB);

          if (verificado != null) { 
            const token = uuid();
            try{
              await collection.updateOne({ email }, {$set: { token: token } });
            } catch(e) {
              console.log(e);
            }
            console.log(`Bienvenido usuario, tu token de sesion es: ${token}`);
           return res.status(200).send({ token });
          } 

          else{
            return res.status(409).send("Contraseña incorrecta")
          }
        }
      
      
      } //fin usuario existe

      res.status(409).send("No existe ningun usuario con este email");
  },

  LogOut: async (parent:any, args:any, {token, res}:{token:string, res:any}) => {
   
    if(token == null){
      console.log("token invalido")
      res.status(401)
      return "token invalido"
    }
   
    const db = await connectDB();
    const collection = db.collection("usuarios"); 
    
    try{
      await collection.updateOne({token}, {$set: { token: undefined } }) 
    
    } catch(e) {
      console.log(e);
    }
      
    
    
    
    //fin usuario existe

    res.status(200);
    return "Sesion cerrada";
},

    addIngredient: async (parent:any, {name}:{ name:string},  {token, collectionIng, collectionUsu, res}:{token:string, collectionIng:Collection, collectionUsu:Collection,  res:any}) => { //buscar primero si ya existe ese ingredient

      if (token == "Falta token de sesion" ){
        return token; //res ya establecido
      }

      const author = await collectionUsu.findOne({token});
      if (author == null){
        
         console.log(`error`)
        const token = "Token de sesion invalido";
        res.status(404)//quitar?
        return{token, res}
      }else{
        res.status(200);
        console.log(`author email: ${author!.email}`)
      }
        
      const correo = author!.email;
        // const recetas = recipes.filter(r => r.ingredients.some((i: string) => i === name));

     

        try{
          await collectionIng.insertOne({name, autor:correo });
        
        } catch(e) {
        console.log(e); 
      }
      //res.status(200);
        return  "Añadido ingrediente";
    },
    

    addRecipie: async (parent:any, {name, description, ingredientes}:{ name:string, description:string, ingredientes:string[]},
       {token, collectionIng, collectionRec, collectionUsu, res}:{token:string, collectionIng:Collection, collectionRec:Collection, collectionUsu:Collection,  res:any}) => {
 

      if (token == "Falta token de sesion" ){
        return token; //res ya establecido
      }

      const author = await collectionUsu.findOne({token});
      if (author == null){
        
         console.log(`error`)
        const token = "Token de sesion invalido";
        res.status(404)//quitar?
        return{token, res}
      }else{
        res.status(200);
        console.log(`author email: ${author!.email}`) //para test
      }
        
      const correo = author!.email;


      try{
      const receta = await collectionRec.insertOne({name, description, ingredientes, autor:correo }); //añadimos la receta //falta author
      

      if (receta){
        console.log("receta añadida");

         collectionUsu.updateOne({email:correo }, {$push: { recetas:name  } })

        ingredientes.forEach( i => {
          collectionIng.updateOne({name: i}, {$push: { recetas:name  } });

          })
      }

      } catch(e) {
      console.log(e);

      }

      return "Añadida receta";

  },


  deleteIngredient: async (parent:any, { ingredient }:{  ingredient:string },
    {token, collectionIng, collectionRec, collectionUsu, res}:{token:string, collectionIng:Collection, collectionRec:Collection, collectionUsu:Collection,  res:any}) => {

    const usu = await collectionUsu.findOne({ token });
      if (usu == null){
            
      console.log(`error`)
      const token = "Token de sesion invalido";
      res.status(404);
      return token;
    }
    else{
      const email = usu!.email;
      const ingrediente:IngredientFind = collectionIng.findOne({name:ingredient}) as unknown as IngredientFind;
      const author = ingrediente!.autor;
      if (email != author){
        res.status(500);
        return "No puedes borrar un ingrediente que no te pertenece"

      }else{

        const recetas:string[] = ingrediente.recetas;
        recetas.forEach( async (rec:string) => {
          await collectionRec.findOneAndDelete({rec});
          await collectionUsu.updateOne({email}, {$pop:{recetas:rec}} )
        } );
        //await collection.updateOne({ email }, {$set: { token: token } });
        


        await collectionRec.findOneAndDelete({ name:ingredient });
        res.status(200);
        
        return "Ingrediente eliminado";

      }



      } 

    }, //fin deleteIngredient


    deleteRecipe: async (parent:any, { recipe }:{  recipe:string },
      {token, collectionIng, collectionRec, collectionUsu, res}:{token:string, collectionIng:Collection, collectionRec:Collection, collectionUsu:Collection,  res:any}) => {
 
      const usu = await collectionUsu.findOne({ token });
        if (usu == null){
              
        console.log(`error`)
        const token = "Token de sesion invalido";
        res.status(404);
        return token;
      }
      else{
        try{
        const email:string = usu!.email;
        console.log("email");
        console.log(email);
        const receta:RecipieFind = await collectionRec.findOne({name:recipe}) as unknown as RecipieFind;
        const author:string = receta!.autor;
        console.log("autor");
        console.log(author);
        if (email != author){
          res.status(500);
          return "No puedes borrar una receta que no te pertenece"
  
        }else{
          
          const ingredientes:string[] = receta!.ingredientes;
          ingredientes.forEach( async (ing:string) => {
            //await collectionRec.findOneAndDelete({rec});
            await collectionIng.updateOne({name:ing}, {$pop:{recetas:recipe}} )
          } );
          await collectionUsu.updateOne({email}, {$pull:{recetas:recipe}} )
          //await collection.updateOne({ email }, {$set: { token: token } });
          
  
  
          await collectionRec.findOneAndDelete({ name:recipe });
          //res.status(200);
          return "Receta eliminada";
        
  
        }
  
      }catch (e) {
        console.log(e);
      } 
  
        
    }
     

      return "Nop";
      }, //fin deleteReceta

}


// let result = await client.db("pruebaDB").collection("rickroll").find().toArray();

//         let arrSimple:Character[] = await Promise.all(result.map(async (char) => {
            
//             return {
//                 id: char.id,
//                 name: char.name,
//                 status: char.status,
//                 species: char.species,
//                 episode: char.episodes.map((epi:Episode) =>{ 
//                     return{
//                         name: epi.name,
//                         episode: epi.episode,
//                     }
//                 })

//             }
//         } ));





// export const Recipe = {
//   ingredients: async (parent: { ingredients: string[] }, args: any, context: { coleccionIngredientes: Collection, coleccionUsers: Collection }) => {
//       const Ingredientes: Ingrediente[] = await Promise.all(parent.ingredients.map(async (elem) => {
//           let IngredienteDB: Ingrediente = await context.coleccionIngredientes.findOne({ name: elem }) as Ingrediente;
//           return IngredienteDB;
//       }));
//       return Ingredientes;
//   }
// }