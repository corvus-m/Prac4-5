import { ApolloServer, ApolloError, gql } from "apollo-server"//import del squema
import { connect } from "http2";
import { typeDefs } from "./schema";
//import { authenticate } from "./auth";
import { connectDB } from "./mongo";
import { Collection } from "mongodb";
import { Query, Recipe, Ingredient } from "./resolvers/Query";
import { Mutation } from "./resolvers/Mutation";
const config = require('./config.js');


const resolvers = {
  Query,
  Mutation,
  Recipe,
  Ingredient
}



//config.ts
//.env
const run =async () => {
  try{


    


    const db = await connectDB();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async({req,res}) => {
        const abresesion = ["SignIn", "LogIn"];
        const cierrasesion = ["SignOut", "LogOut"]
        const anade = ["addIngredient", "addRecipie"] //separar?
        const muestra = ["getRecipes", "getRecipe"] //separar?
        
        const collectionUsu = db.collection("usuarios");
        const collectionIng = db.collection("ingredientes");
        const collectionRec = db.collection("recetas");

       //const abresesion = ["SignIn", "LogIn"];
        if(abresesion.some(f => req.body.query.includes(f))){ //caso de ser signin o login
          
          const collection = db.collection("usuarios"); //QUITAR ESTA CONEXION AQUI?
          const email:string =  req.headers.email as string;
          const password:string =  req.headers.password as string;
          if(email == null || password == null){
            console.log("faltan email o contrasena")
            res.status(401)
            return "faltan email o contraseña"
          } 

          return{
            email,password,res
          }

          //const cierrasesion = ["SignOut", "LogOut"]
        }else if(cierrasesion.some(f => req.body.query.includes(f))){ //añadir cosas logeado
          const token = req.headers.token;
          if (token == null) return res.status(500).send("Falta token de sesion");

          
          const usuario = collectionUsu.findOne({token});                //await no hace falta
          if (usuario == null){
            return res.status(500).send("Token de sesion invalido");
          }
          return{token, res}
        }

        //const anade = ["addIngredient", "addRecipie"]
        else if(anade.some(f => req.body.query.includes(f))){ //añadir cosas logeado
          const token = req.headers.token;
          
          if (token == null) {
             
             console.log("ERROR");
            const token = "Falta token de sesion";
            return{token, res, collectionIng, collectionRec}
          }

          const collection = db.collection("usuarios");
          const author = await collection.findOne({token});
          // if (author == null){
            
          //    console.log(`error`)
          //   const token = "Token de sesion invalido";
          //   return{token, res}
          // }else{
          //   res.status(200);
          //   console.log(`author email: ${author!.email}`)
          // }

          return{  token, res, collectionIng, collectionRec}
        }//fin añade cosas

          //const muestra = ["getRecipes", "getRecipe"] 
        else if(muestra.some(f => req.body.query.includes(f))){ //mostrar cosas - usa token 
          const token = req.headers.token;
          console.log("entra en busca recetas");

          if (token == null) {
             
             console.log("ERROR");
            const token = "Falta token de sesion";
            return{token, res}
          }
          return{token, res, collectionIng, collectionRec}

        }


      }


    });
  
    server.listen(config.PORT).then(() => {
      console.log("server escuchando en el puerto 3000");
    });
  } catch (e) {
    console.error(e);
  }
  }
  
  try {
    run();
  } catch (e) {
    console.error(e);
  }

// const run = async () => {
//     const client = await connectDB();
//     const server = new ApolloServer({
//         typeDefs,
//         //resolvers,
//         context: ({ req, res }) => {
//             const validtoken = ["pepi", "juan"];
//             const header = req.headers["token"];
//             console.log(header);
//             if (validtoken.some((q) => req.body.query.includes(q))) {
//                 if (req.headers["token"] !== "12345") res.sendStatus(403);
//             } else {
//                 return {
//                     data: "holaaaaaaa",
//                     client,
//                 };
//             }
//         },
//     });
//     server.listen(3000).then(() => {
//         console.log("Server escuchando en el puerto 3000");
//     });

// };


