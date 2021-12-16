

import { connectDB } from "./mongo";
import { Collection } from "mongodb";


export type AuthorFind = {
    _id: string,
    email: string,
    password: string,
    token: string
}

export type RecipieFind = {
    _id: string,
    name: string,
    description: string,
    ingredients: string[],
    author: string,
}

export type IngredientFind = {
    _id: string,
    name: string,
    recetas: string[]
 //   author: string
}

