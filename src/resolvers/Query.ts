import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { connectDB } from "../mongo";
import { AuthorFind, IngredientFind, RecipieFind } from "../types";




// addRecipie: async (parent:any, {name, description, ingredientes}:{ name:string, description:string, ingredientes:string[], res:any},
//     {token, collectionIng, collectionRec, res}:{token:string, collectionIng:Collection, collectionRec:Collection,  res:any}) => {

export const Query = {
    
    getRecipes: async (parent: any, args: {}, {token, collectionIng, collectionRec, res}:{token:string, collectionIng:Collection, collectionRec:Collection,  res:any}) => {
        
        if (token == "Falta token de sesion" || token == "Token de sesion invalido" ){
            return ; //res ya establecido
          }
    

        const recetas =  collectionRec.find({}) ;
        return recetas.toArray();
         
            
        
    },

    getRecipe: async (parent: any, {name}: {name:string}, 
      {token, collectionIng, collectionRec, res}:{token:string, collectionIng:Collection, collectionRec:Collection,  res:any}) => {
      
      if (token == "Falta token de sesion" || token == "Token de sesion invalido" ){
          return ; //res ya establecido
        }
  

      const receta =  collectionRec.findOne({name}) ;
      res.status(200);
      return receta;
  
  },

  getUser:async (parent: any, {id_str}: {id_str:string}, 
    {token,  collectionUsu, res}:{token:string, collectionUsu:Collection,  res:any}) => {
      
      if (token == "Falta token de sesion" || token == "Token de sesion invalido" ){
        return ; //res ya establecido
      }
      // try{

      const usuario :AuthorFind = await collectionUsu.findOne({_id: new ObjectId(id_str)}) as unknown as AuthorFind  ;
      
      // if (usuario){
      //   console.log(usuario._id);

      // // console.log(usuario!._id);
      // // console.log(usuario!.email);
      // }
      
      if(usuario == null){
        res.status(404);
      return usuario;
      }
      res.status(200);
      return usuario;
    // } catch (e){
    //   console.log(e)
    // }

  },

  getUsers:async (parent: any, args:any, 
    {token,  collectionUsu, res}:{token:string, collectionUsu:Collection,  res:any}) => {
      
      if (token == "Falta token de sesion" || token == "Token de sesion invalido" ){
        return ; //res ya establecido
      }

      const usuarios =  collectionUsu.find({}) ;
      return usuarios.toArray();

  }



}




















//enlaces de tipo

export const Recipe = { 
  author: async(parent:any, args: any, {collectionUsu}:{collectionUsu:Collection}) =>{
    const elAutor:AuthorFind = await  collectionUsu.findOne({email: parent!.autor}) as unknown as AuthorFind;
    return elAutor
  },
  ingredients:  async (parent:any, args: any, {collectionIng}:{collectionIng:Collection}) => {
    console.log("ALGOALGOALGOJAMON");
          const Ingredientes: IngredientFind[] =parent!.ingredientes.map(async (ing:string) =>{
            const elIngrediente:IngredientFind=  await collectionIng.findOne({ name: ing }) as unknown as IngredientFind ;
            return elIngrediente
          } )
          
          return Ingredientes;
      }


}


  export const Ingredient = { 
    author: async(parent:any, args: any, {collectionUsu}:{collectionUsu:Collection}) =>{
      const elAutor:AuthorFind = await  collectionUsu.findOne( {email: parent!.autor}) as unknown as AuthorFind;
      
      return elAutor
    },

    recipes:  async (parent:any, args: any, {collectionRec}:{collectionRec:Collection}) => {
   
            const Recetas: RecipieFind[] =parent!.recetas.map(async (rec:string) =>{
              const laReceta:RecipieFind = await collectionRec.findOne({ name: rec }) as unknown as RecipieFind ;
              return laReceta
            } )
            
            return Recetas;
        }


  }


  export const User = { 
    
    recipes:  async (parent:any, args: any, {collectionRec}:{collectionRec:Collection}) => {
   
            const Recetas: RecipieFind[] =parent!.recetas.map(async (rec:string) =>{
              const laReceta:RecipieFind = await collectionRec.findOne({ name: rec }) as unknown as RecipieFind ;
              return laReceta
            } )
            
            return Recetas;
        }


  }


