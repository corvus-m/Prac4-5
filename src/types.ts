

import { connectDB } from "./mongo";
import { Collection, ObjectId } from "mongodb";


export type AuthorFind = {
    _id: ObjectId,
    email: string,
    password: string,
    token: string,
    recetas: string[]
}

export type RecipieFind = {
    _id: ObjectId,
    name: string,
    description: string,
    ingredientes: string[],
    autor: string,
}

export type IngredientFind = {
    _id: ObjectId,
    name: string,
    recetas: string[]
    autor: string
}

