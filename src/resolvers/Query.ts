import { Collection, Db, MongoClient } from "mongodb";
import { connectDB } from "../mongo";
import { IngredientFind, RecipieFind } from "../types";




// addRecipie: async (parent:any, {name, description, ingredientes}:{ name:string, description:string, ingredientes:string[], res:any},
//     {token, collectionIng, collectionRec, res}:{token:string, collectionIng:Collection, collectionRec:Collection,  res:any}) => {

export const Query = {
    
    getRecipes: async (parent: any, args: {}, {token, collectionIng, collectionRec, res}:{token:string, collectionIng:Collection, collectionRec:Collection,  res:any}) => {
        console.log("Recipies");
        if (token == "Falta token de sesion" || token == "Token de sesion invalido" ){
            return ; //res ya establecido
          }
    

        const recetas =  collectionRec.find({}) ;
        return recetas.toArray();
         
            
        
    }
    // getRecipe: (_, {id}, { recipies, ingredients}) => {
    //     return recipies.map((r, index) => ({
    //         ...recipies[id], 
    //         id: index,
    //     }));
    // }

}

// getRecipe: async (parent: any, args: { id: string }, context: { coleccionRecetas: Collection }) => {
//     var id = args.id;
//     var good_id = new ObjectId(id);
//     let RecetaDB: Receta = await context.coleccionRecetas.findOne({ _id: good_id }) as Receta;
//     console.log(RecetaDB);
//     return {
//         id: RecetaDB._id,
//         name: RecetaDB.name,
//         description: RecetaDB.description,
//         ingredients: RecetaDB.ingredients,
//         author: RecetaDB.author
//     }
// }
// //ESTOS CAMPOS SOLO SE MUESTRAN SI LOS PIDE EL CLIENTE, DE OTRA FORMA SERIA UN BUCLE INFINITO

// pet: parent => {
//     return pets.find(pet => pet.name === parent.petName);
// }

// export const Recipe : { //parent de graphql
//     ingredients: parent => {  
        
//         return }
//   }










  

//previo

// export const Recipe = { //parent de graphql
//     ingredients: async ({ingredientes}: { ingredientes: string[] }, args: any, context:{collectionIng:Collection}) => {
  
//         const ingridientsFin: IngredientFind[] = await Promise.all( ingredientes.map(async (name) => {
  
//             let ingFinded: IngredientFind = await context.collectionIng.findOne({ name }) as unknown as IngredientFind ;
//             return ingFinded;
//         }));
        
//         return ingridientsFin;
//     }
  
//   }

// export const Recipe = { //parent de graphql
//   ingredients: async ({ingredientes}: { ingredientes: any }, args: any, context:{collectionIng:Collection}) => {

//       const ingridientsFin: IngredientFind[] = await Promise.all( ingredientes.map(async (name) => {

//           let ingFinded: IngredientFind = await context.collectionIng.findOne({ name }) as unknown as IngredientFind ;
//           return ingFinded;
//       }));
      
//       return ingridientsFin;
//   }

// }

export const Recipe = { 
  ingredients:  async (parent:any, args: any, {collectionIng}:{collectionIng:Collection}) => {
 
          const Ingredientes: IngredientFind[] =parent!.ingredientes.map(async (ing:string) =>{
            const elIngrediente:IngredientFind=  await collectionIng.findOne({ name: ing }) as unknown as IngredientFind ;
            return elIngrediente
          } )
          
          return Ingredientes;
      }


}


  export const Ingredient = { 
    recipes:  async (parent:any, args: any, {collectionRec}:{collectionRec:Collection}) => {
   
            const Recetas: RecipieFind[] =parent!.recetas.map(async (rec:string) =>{
              const laReceta:RecipieFind = await collectionRec.findOne({ name: rec }) as unknown as RecipieFind ;
              return laReceta
            } )
            
            return Recetas;
        }


  }



//   return recipies.map = await Promise.all( recipies.map(async (name) => {
  
//     let ingFinded: IngredientFind = await context.collectionIng.findOne({ name }) as unknown as IngredientFind ;
//     return ingFinded;
// }));


//         //cada vez que devuelva algo de tipo receta, hace algo a los ingredientes
// export const Recipie = {
//     ingredients: (parent: {ingredients: number[]},  args: {}, { recipies, ingredients}) =>{ //que sifnifica parent?
//         //return parent.ingredients.map( (ing, index) => ({ // Para que esta el ing?
//             return parent.ingredients.map( ( index) => ({
//             ...ingredients[index],
//             id: index
//         }))

//     }
// }

//         //cada vez que devuelva algo de tipo receta, hace algo a los ingredientes
// export const Ingredient = { 
//     recipies: (parent: {id: number, name: string},  args: any, { recipies, ingredients}) =>{  //devolvera un objeto de recetas
//         return recipies.filter( r => r.ingredients.some(i => i === parent.id)) //recetas que contienen el ingrediente

//     }
// }