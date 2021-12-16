import { Collection, Db, MongoClient } from "mongodb";
import { connectDB } from "../mongo";
import { v4 as uuid } from "uuid";
import { AuthorFind, IngredientFind, RecipieFind } from "../types";

const crypto = require("crypto")



const hash = async (password:string) => {
    return new Promise((resolve, reject) => {
        const salt:string  = crypto.randomBytes(8).toString("hex")
  
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

    addIngredient: async (parent:any, {name}:{ name:string},  {token, collectionIng, collectionRec, res}:{token:string, collectionIng:Collection, collectionRec:Collection,  res:any}) => { //buscar primero si ya existe ese ingredient

  
        // const recipes= await collectionRec.find({}).toArray();
        // if (recipes == null){
        //   res.status(404);
        //   console.log("F")
        //   return "error";
        // }

        
        // const recetas = recipes.filter(r => r.ingredients.some((i: string) => i === name));

     

        try{
          await collectionIng.insertOne({name });
        
        } catch(e) {
        console.log(e); 
      }
      //res.status(200);
        return  "Añadido ingrediente";
    },
    

    addRecipie: async (parent:any, {name, description, ingredientes}:{ name:string, description:string, ingredientes:string[]},
       {token, collectionIng, collectionRec, res}:{token:string, collectionIng:Collection, collectionRec:Collection,  res:any}) => {
     try{

      if (token == "Falta token de sesion" || token == "Falta token de sesion" ){
        return token; //res ya establecido
      }



      
      //añadir caso de que falte un ingrediente?
     
      let faltaIng:boolean = false;
      
      //  ingredientes.filter( async i =>{ 
      //   console.log(i);
      //    let Ing:any = await collectionIng.findOne({name:i});
      //    if (Ing == null){
      //      console.log("falta Ing")
      //     faltaIng = true;
      //     return;
      //    }
      //     else {
      //       console.log("alo");
      //       return Ing
      //    }

      //  })

       if (faltaIng){
         return "Almenos uno de los ingredientes de la receta no ha sido añadido previamente"
       }



      // const author = await collection.findOne({token});
      // if(author != null){
      //   const nombre:string = author.email;
      //   console.log(`${nombre}`);
      //   console.log(`el nombre`);
      // }else{
      //   console.log("Sin autor");

      // }
      //console.log(author.name);

      try{
      const receta = await collectionRec.insertOne({name, description, ingredientes }); //añadimos la receta //falta author
      
      if (receta){
        console.log("receta añadida");

        
        ingredientes.forEach( i => {
          collectionIng.updateOne({name: i}, {$push: { recetas:name  } });

          })
      }

      } catch(e) {
      console.log(e);

      }

      

      return "Añadida receta ingrediente";
    } catch(e){
      console.log(e);
    }
  }


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