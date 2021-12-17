import { ApolloServer, ApolloError, gql } from "apollo-server"//import del squema
export const typeDefs = gql`
type User{
  id: ID!
  email: String!
  pwd: String!
  token: String
  recipes: [Recipe!]!
}

type Ingredient{
  id: ID!
  name: String!
  recipes: [Recipe!]!
  author: User!
}


type Recipe{
  id: ID!
  name: String!
  description: String!
  ingredients: [Ingredient!]!
  author: User!
}



type Query {
  getRecipes: [Recipe] 
  getRecipe(id_str: String): Recipe!
  getUser(id_str: String!): User
  getUsers: [User]
}

type Mutation {
    addIngredient(name:String): String 
    addRecipie(name:String!, description:String!, ingredientes:[String]!): String
    SignIn: String!
    LogIn: String!
    LogOut:String!
    SignOut:String!
    deleteIngredient(ingredient:String!):String!
    deleteRecipe(name:String!):String!
    updateRecipe(name:String!, description:String, ingredientes:[String]):String!
}
`
//updateRecipe(id: ID!, recipe): RecipeInput!