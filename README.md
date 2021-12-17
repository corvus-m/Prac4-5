# Prac4-5

Esta práctica consiste en el desarrollo de una API en graphQL que permita gestionar un blog de recetas. Los datos se almacenan en MongoDB Atlas.

## SignIn 
#### Permite registrarse con usuario y contraseña.
Se deben meter por headers usuario y contraseña.

## SignOut 
#### Permite a un usuario loggeado borrar su cuenta. Borra todas sus recetas.
Se debe meter el token de sesión por headers.

## LogIn 
#### Permite loggearse con usuario y contraseña. Devuelve un token de sesión.
Se deben meter por headers usuario y contraseña.

## LogOut 
#### Permite desloggearse cuando el usuario tiene la sesión iniciada.
Se debe meter el token de sesión por headers.

## AddIngredient
#### Añade un ingrediente a la base de datos. Solo usuarios registrados. Devuelve un token de sesión.
Se debe meter el token de sesión por headers.

## DeleteIngredient 
#### Borra un ingrediente de la base de datos y todas las recetas que contengan ese ingrediente.
Se debe meter el token de sesión por headers.
Para borrar un ingrediente debes ser un usuario registrado y el ingrediente debe ser tuyo. La petición borra todas las recetas asociadas a ese ingrediente.

## AddRecipe 
#### Añade una receta a la base de datos. Solo usuarios registrados.
Se debe meter el token de sesión por headers.

## UpdateRecipe 
#### Actualiza una receta existente en la base de datos. Solo usuarios registrados. Solo puedes actualizar la receta si es tuya.
Se debe meter el token de sesión por headers.
parámetros opcionales (se pueden pasar ambos, uno, o ninguno):
 - ingredientes. Permite cambiar los ingredientes de la receta por los añadidos.
 - description. Permite cambiar la descripcion de la receta.

## DeleteRecipe 
#### Borra una receta de la base de datos. Solo usuarios registrados. Solo puedes borrar la receta si es tuya.
Se debe meter el token de sesión por headers.

## getRecipes 
#### Devuelve todas las recetas.
Se debe meter el token de sesión por headers.

## getRecipe
#### Devuelve la receta pedida por id
Se debe meter el token de sesión por headers.

## getUser 
#### Devuelve un usuario pedido por id
Se debe meter el token de sesión por headers.

## getUsers 
#### Devuelve todos los usuarios
Se debe meter el token de sesión por headers.
