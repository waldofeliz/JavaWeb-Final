# JavaWeb-Final

## Proyecto Red-Social

## Herramientas Utilizadas
* Javascript
* Bootstrap
* Jquery
* Firebase
> * Firebase Storage
> * Firebase Authentication
> * Firebase Firestore
* Github

## Funcionalidades Generales
Reigstro de usuario, login de usuario, pagina inicio donde se visualizan los post realizados por los usuarios de la web y su lista de contacto como el perfil de usuario en sesión.

Pagina de perfil de usuario en sesión, en esta podra editar el perfil, foto, datos y cambiar la contraseña. Tambien podra realizar los post del usuario en sesión.

Listar los contactos que tiene el usuario en sesión donde podra ver el perfil del contacto selecionado a navegar en su perfil.

## Pasos para configurar el proyecto

Para configurar el poryecto solo se debe crear una cuenta de fire store y cambiar los valores de los parametros de firebase a utilizar en el proyecto.

```javascript

 // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: ""
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        let db = firebase.firestore();
```

Tambien se debe se debe instalar node js con npm para poder instalar las dependencias de bootstrap. Si ya tiene instalado node js solo debe correr el siguiente comando.

```node 
npm install
```
