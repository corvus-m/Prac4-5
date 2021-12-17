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
          return   "faltan email o contraseña"
        }
  
        const existe = await collection.findOne({ email });
        if (existe) { 
            return res.status(409).send("Ya existe un usuario con este email.");
        }
        const password1 = await hash(password);


      
          const token = uuid();
      
          
          // const crypto = require("crypto")
      
       const recetas:string[] = [];
          await collection.insertOne({ email, password:password1, token, recetas });
        console.log(`Bienvenido usuario, tu token de sesion es: ${token}`);
        //res.status(200);
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

  LogOut: async (parent:any, args:any, {token, collectionUsu, res}:{token:string,collectionUsu:Collection, res:any}) => {
   
    if(token == null){
      console.log("token invalido")
      res.status(401)
      return "token invalido"
    }

    const usu = await collectionUsu.findOne({token});
    if (usu == null){
      
     //  console.log(`error`)
      const token = "Token de sesion invalido";
      res.status(404);
      return token;
    }
    
    try{
      await collectionUsu.updateOne({token}, {$set: { token: undefined } }) 
      
    } catch(e) {
      console.log(e);
    }
      
    
    
    
    //fin usuario existe

    res.status(200);
    return "Sesion cerrada";
},

SignOut: async (parent:any, args:any, {token, collectionUsu, collectionRec, collectionIng, res}:{token:string, collectionUsu:Collection,collectionRec:Collection,collectionIng:Collection, res:any}) => {
   
  if(token == null){
    console.log("token invalido")
    res.status(401);
    return "token invalido"
  }
  const usu:AuthorFind = await collectionUsu.findOne({token}) as unknown as AuthorFind;
  if (usu == null){
    
     console.log(`error`)
    const token = "Token de sesion invalido";
    res.status(404);
    return token;
  }
  
  
  try{
    const recetas:string[] = usu!.recetas
    recetas.forEach(async (rec:string) =>{
      const receta:RecipieFind = collectionRec.findOneAndDelete({name:rec}) as unknown as RecipieFind;
      const ingredientes:string[] = receta!.ingredientes;
      ingredientes.forEach(async(ing:string) => {
        collectionIng.findOneAndDelete({name:ing}); //ez
      })
    })
    await collectionUsu.findOneAndDelete({token}) 
  
  } catch(e) {
    console.log(e);
  }
    
  
  
  
  //fin usuario existe

  res.status(200);
  return "Usuario eliminado";
},

    addIngredient: async (parent:any, {name}:{ name:string},  {token, collectionIng, collectionUsu, res}:{token:string, collectionIng:Collection, collectionUsu:Collection,  res:any}) => { //buscar primero si ya existe ese ingredient

      if (token == "Falta token de sesion" ){
        return token; //res ya establecido
      }

      const author = await collectionUsu.findOne({token});
      if (author == null){
        
         console.log(`error`)

        return "Token de sesion invalido";
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
        
         return "Token de sesion invalido";
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
      try{

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
          await collectionUsu.updateOne({email}, {$pull:{recetas:rec}} )
        } );
        //await collection.updateOne({ email }, {$set: { token: token } });
        


        await collectionRec.findOneAndDelete({ name:ingredient });
        res.status(200);
        
        return "Ingrediente eliminado";

      }
    }catch (e) {
      console.log(e);
    } 


      } 

    }, //fin deleteIngredient


    deleteRecipe: async (parent:any, { name }:{  name:string },
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
        // console.log("email");
        // console.log(email);
        const receta:RecipieFind = await collectionRec.findOne({name}) as unknown as RecipieFind;
        const author:string = receta!.autor;
        // console.log("autor");
        // console.log(author);
        if (email != author){
          res.status(500);
          return "No puedes borrar una receta que no te pertenece"
  
        }else{
          
          const ingredientes:string[] = receta!.ingredientes;
          ingredientes.forEach( async (ing:string) => {
            //await collectionRec.findOneAndDelete({rec});
            await collectionIng.updateOne({name:ing}, {$pull:{recetas:name}} )
          } );
          await collectionUsu.updateOne({email}, {$pull:{recetas:name}} )
          //await collection.updateOne({ email }, {$set: { token: token } });
          
  
  
          await collectionRec.findOneAndDelete({ name });
          //res.status(200);
          return "Receta eliminada";
        
  
        }
  
      }catch (e) {
        console.log(e);
      } 
  
        
    }
     

      return "No existe esa receta, comprueba el nombre.";
      }, //fin deleteReceta

      updateRecipe: async (parent:any, { name,description, ingredientes }:{  name:string, description:string, ingredientes:string[] },
        {token, collectionIng, collectionRec, collectionUsu, res}:{token:string, collectionIng:Collection, collectionRec:Collection, collectionUsu:Collection,  res:any}) => {
   
        const usu = await collectionUsu.findOne({ token });
        
          if (usu == null){
                
          console.log(`error`)
          const token = "Token de sesion invalido";
          res.status(404);
          return token;
        }
        else{
          
          const email:string = usu!.email;
          const receta:RecipieFind = await collectionRec.findOne({name}) as unknown as RecipieFind;
          const author:string = receta!.autor;
          if (email != author){
            res.status(500);
            return "No puedes modificar una receta que no te pertenece"
    
          }else{
            if(description == null && ingredientes == null){
              res.status(405);
              return "Para modificar una receta debes añadir al menos un campo que quieras modificar";
            }else if(description== null){
              await collectionRec.updateOne({name}, {$set:{description}})
            } else if(ingredientes== null){
              await collectionRec.updateOne({name}, {$set:{ingredientes}})

            } else{
              await collectionRec.updateOne({name}, {$set:{ingredientes,description}})
            }

            
          }
          return "Receta modificada correctamente";
    
      
         
    
      }
       
      return "No existe esa receta, comprueba el nombre.";
    }
  
}
