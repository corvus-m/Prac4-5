

import { connectDB } from "./mongo";
import { Collection } from "mongodb";


export type AuthorFind = {
    _id: string,
    email: string,
    password: string,
    token: string,
    recetas: string[]
}

export type RecipieFind = {
    _id: string,
    name: string,
    description: string,
    ingredientes: string[],
    autor: string,
}

export type IngredientFind = {
    _id: string,
    name: string,
    recetas: string[]
    autor: string
}

