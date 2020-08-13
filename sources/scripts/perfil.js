$(function () {

    //Componentes
    const body = document.getElementById('body')
    const btnCancelar = document.getElementById('btnCancelar')
    const btnGuardar = document.getElementById('btnGuardar')
    const btnSubir = document.getElementById('btnSubir')
    const btnPostear = document.getElementById('btnPostear')
    let current
    let usuarioSesion 

    body.onload = async () => {

        //Cargar la pagina     
        current = JSON.parse(localStorage.getItem("usuarioSesion"))
        usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogin"))
        // console.log('Usuario', current)
        if (current === null) {
            window.location.href = './login.html'
        }

        //Cargar perfil usuario
        await cargarPerfil(current)
        await cargarPostUsuario(current)

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

    btnPostear.onclick = async () => {
        postearContenido(current)
        await cargarPostUsuario(current)
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
    let imgPerfil = document.getElementById('imgPerfil')
    let imagenLocal = window.location.origin + '/sources/images/usericon2.jpeg' 

    db.collection("users").where("uid","==",usuarioId).get().then(function(response){
            response.forEach((res) => {
                console.log('Usuario Result: ',res.data().username)
                txtusername.innerHTML = res.data().username
                pComentario.innerHTML = `<span class="profile-real-name" id="spanUsername">${res.data().username}</span> ${res.data().comentario}`
                if(res.data().photo == ''){
                    imgPerfil.src = imagenLocal
                }else {
                imgPerfil.src = res.data().photo
                }
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

postearContenido = (current) => {
    //Obteniendo las referencias del proyecto
    let usuarioId = current.uid.toString()
    const ref = firebase.storage().ref()
    const file = document.querySelector('#upPostFoto').files[0]
    const name = new Date() +'-' +file.name
    if(file == null){
        alert('Debe selecionar una imagen')
    }else {
        const metadata = {
            contentType : file.type
        }

        const task = ref.child(`${usuarioId}/Post/${name}`)
        .put(file, metadata)

        task.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log('URL: ', url)

            let usuarioInfo = {
                uid : usuarioId,
                url : url
            }

            guardar(usuarioInfo)
            
        })
    }
    console.log(ref)
    setTimeout(() => {
        recargar()
}, 3000);
}

guardar = (user) => {
	db.collection('post').add({
		uid: user.uid,
		photo : user.url,
	})
		.then(us => {
			console.log('us: ', us)
			alert('Post realizado')
			window.location.reload()
		})
		.catch(error => {
			console.log('error: ', error)
		})
}

cargarPostUsuario = async (current) => {
    console.log('Current User Uid: ',current.uid.toString())
    let usuarioId = current.uid.toString()
    let pGallery = document.getElementById('gallery')

    db.collection("post").where("uid","==",usuarioId).get().then(function(response){
        pGallery.innerHTML = ''
            response.forEach((res) => {
                console.log('Usuario Result: ', res)
                pGallery.innerHTML += ` <div class="gallery" id="gallery">
    
                <div class="gallery-item" tabindex="0">
    
                    <img src="${res.data().photo}" class="gallery-image" alt="">
    
                    <div class="gallery-item-info">
    
                        <ul>
                            <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 56</li>
                            <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 2</li>
                        </ul>
    
                    </div>
    
                </div>`
            })
    })
}