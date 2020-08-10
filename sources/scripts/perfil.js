$(function () {

    //Componentes
    const body = document.getElementById('body')
    const btnPerfil = document.getElementById('btnPerfil')
    const btnImgPerfil = document.getElementById('btnImgPerfil')
    let current

    body.onload = async () => {

        //Cargar la pagina     
        current = JSON.parse(localStorage.getItem("usuarioSesion"))
        // console.log('Usuario', current)
        if (current === null) {
            window.location.href = './login.html'
        }

        //Cargar perfil usuario
        await cargarPerfil(current)

    }

});



salir = () => {
    let resultado = confirm('Desea salir de la sesión?')

    if(resultado) {
        localStorage.removeItem("usuarioSesion")
        window.location.href = './login.html'
    }
}

irInicio = () => {
        window.location.href = './inicio.html'
}

cargarPerfil = async (current) => {
    console.log('Current User: ',current)
    console.log('Current User Uid: ',current.uid.toString())
    let usuarioId = current.uid.toString()
    let txtusername = document.getElementById('txtusername')
    let pComentario = document.getElementById('pComentario')
    // let txtemail = document.getElementById('txtemail')
    let imgPerfil = document.getElementById('imgPerfil')

    db.collection("users").where("uid","==",usuarioId).get().then(function(response){
            response.forEach((res) => {
                console.log('Usuario Result: ',res.data().username)
                txtusername.innerHTML = res.data().username
                pComentario.innerHTML = `<span class="profile-real-name" id="spanUsername">${res.data().username}</span> ${res.data().comentario}<`
                // txtemail.innerHTML = res.data().email
                imgPerfil.src = res.data().photo
            })
    })
}

uploadImagePerfil = (current) => {
    console.log('current foto: ',current)
    //Obteniendo las referencias del proyecto
    const ref = firebase.storage().ref()
    const file = document.querySelector('#btnImgPerfil').files[0]
    const name = current.uid.toString() + new Date() +'-' +file.name
    if(file == null){
        alert('Debe selecionar una imagen')
    }else {
        const metadata = {
            contentType : file.type
        }

        const task = ref.child(name).put(file, metadata)

        task.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log(url)
            alert('Imagen subida')
            imagen.src = url
        })

    }
    console.log(ref)
}

recargar = () => {
    location.reload()
}