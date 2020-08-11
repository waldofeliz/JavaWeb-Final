$(function () {

    //Componentes
    const body = document.getElementById('body')
    const btnCancelar = document.getElementById('btnCancelar')
    const btnGuardar = document.getElementById('btnGuardar')
    const btnSubir = document.getElementById('btnSubir')
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

    btnCancelar.onclick = () => {
        limpiarCampos()
    }

    btnGuardar.onclick = () => {
         modificarPerfil(current)
    }

    btnSubir.onclick = () => {
        subirFoto(current)
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
                pComentario.innerHTML = `<span class="profile-real-name" id="spanUsername">${res.data().username}</span> ${res.data().comentario}`
                // txtemail.innerHTML = res.data().email
                imgPerfil.src = res.data().photo
            })
    })
}

recargar = () => {
    location.reload()
}

limpiarCampos = () => {
    let txtEmail = document.getElementById('txtEmail').value = ''
    let txtUsuario = document.getElementById('txtUsuario').value = ''
    let txtComentario = document.getElementById('txtComentario').value = ''
    let upFoto = document.getElementById('upFoto').value = ''
}

modificarPerfil = async (current) => {
    let usuarioId = current.uid.toString()
    let txtUsuario = document.getElementById('txtUsuario').value
    let txtComentario = document.getElementById('txtComentario').value
   
    db.collection("users").where("uid","==",usuarioId).get().then(function(response){
        response.forEach((res) => {
            let estatus = db.collection('users').doc(res.id).update({
                username : txtUsuario,
                comentario : txtComentario
            })
        })
    }) 
    setTimeout(() => {
            recargar()
    }, 3000);
}

subirFoto = (current) => {
    //Obteniendo las referencias del proyecto
    let usuarioId = current.uid.toString()
    const ref = firebase.storage().ref()
    const file = document.querySelector('#upFoto').files[0]
    const name = new Date() +'-' +file.name
    if(file == null){
        alert('Debe selecionar una imagen')
    }else {
        const metadata = {
            contentType : file.type
        }

        const task = ref.child(`${usuarioId}/Perfil/${name}`)
        .put(file, metadata)

        task.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log('URL: ', url)

            db.collection("users").where("uid","==",usuarioId).get().then(function(response){
                response.forEach((res) => {
                    db.collection('users').doc(res.id).update({
                        photo : url
                    })
                })
            }) 
            
        })
    }
    console.log(ref)
    setTimeout(() => {
        recargar()
}, 3000);
}