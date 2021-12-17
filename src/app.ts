import { ApolloServer, ApolloError, gql } from "apollo-server"//import del squema
import { connect } from "http2";
import { typeDefs } from "./schema";
//import { authenticate } from "./auth";
import { connectDB } from "./mongo";
import { Collection } from "mongodb";
import { Query, Recipe, Ingredient, User } from "./resolvers/Query";
import { Mutation } from "./resolvers/Mutation";
const config = require('./config.js');


const resolvers = {
  Query,
  Mutation,
  Recipe,
  Ingredient,
  User
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
        // const cierrasesion = ["SignOut", "LogOut"]
        // const cambia = ["addIngredient", "addRecipie", "deleteIngredient","deleteRecipe","updateRecipe"]
        // const muestra = ["getRecipes", "getRecipe","getUser","getUsers"] 
        
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
        }
   
          const token = req.headers.token;
          //console.log("entra en busca ");

          if (token == null) {
             
             //console.log("ERROR");
            const token = "Falta token de sesion";
            return{token, res}
          }
          return{token, res, collectionIng, collectionRec, collectionUsu}

        


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


