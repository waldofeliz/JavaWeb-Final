$(function () {

    //Componentes
    const body = document.getElementById('body')
    const btnCancelar = document.getElementById('btnCancelar')
    const btnGuardar = document.getElementById('btnGuardar')
    const btnSubir = document.getElementById('btnSubir')
    const btnPostear = document.getElementById('btnPostear')
    const btnEliminar = document.getElementById('btnEliminar')
    const btnPassword = document.getElementById('btnPassword')
    let current
    let usuarioSesion 

    body.onload = async () => {

        btnEliminar.style.display = "none"

        //Cargar la pagina     
        current = JSON.parse(localStorage.getItem("usuarioSesion"))
        usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogin"))
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
    
    btnEliminar.onclick = () => {
        eliminarFotoPerfil(current)
    }

    btnPassword.onclick = async () => {
        await recuperarPassword(current)
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
    let usuarioId = current.uid.toString()
    let txtusername = document.getElementById('txtusername')
    let pComentario = document.getElementById('pComentario')
    let imgPerfil = document.getElementById('imgPerfil')
    let imgPreFoto = document.getElementById('imgPreFoto')
    let btnEliminar = document.getElementById('btnEliminar')
    let txtUsuario = document.getElementById('txtUsuario')
    let txtComentario = document.getElementById('txtComentario')
    let imagenLocal = window.location.origin + '/sources/images/usericon2.jpeg' 

    db.collection("users").where("uid","==",usuarioId).get().then(function(response){
            response.forEach((res) => {
                txtusername.innerHTML = res.data().username
                pComentario.innerHTML = `<span class="profile-real-name" id="spanUsername">${res.data().username}</span> ${res.data().comentario}`
                txtUsuario.value = res.data().username
                txtComentario.value = res.data().comentario
                if(res.data().photo == ''){
                    imgPerfil.src = imagenLocal
                    
                }else {
                imgPerfil.src = res.data().photo
                imgPreFoto.src = res.data().photo
                btnEliminar.style.display = ""
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
    let usuarioId = current.uid.toString()
    let pGallery = document.getElementById('gallery')

    db.collection("post").where("uid","==",usuarioId).get().then(function(response){
        pGallery.innerHTML = ''
            response.forEach((res) => {
                pGallery.innerHTML += ` 
                <div class="gallery" id="gallery">    
                    <div class="gallery-item" tabindex="0">
        
                        <img src="${res.data().photo}" class="gallery-image" alt="${res.data().uid}">
        
                        <div class="gallery-item-info">
        
                            <ul>
                                <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> 56</li>
                                <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i> 2</li>
                            </ul>
        
                        </div>
        
                    </div>
                </div>`
            })
    })
}

eliminarFotoPerfil = (current) => {    
    let usuarioId = current.uid.toString()
   // Create a root reference
   var storageRef = firebase.storage().ref();
   // Create a reference 
   var mountainsRef = storageRef.child(`${usuarioId}/Perfil`);

   let btnEliminar = document.getElementById('btnEliminar')

   // Now we get the references of these files
   mountainsRef.listAll().then(function (result) {
       result.items.forEach(function (file) {
          file.delete();

          db.collection("users").where("uid","==",usuarioId).get().then(function(response){
            response.forEach((res) => {
                db.collection('users').doc(res.id).update({
                    photo : ''
                })
            })
        }) 

          setTimeout(() => {
            btnEliminar.style.display = "none"
            recargar()
    }, 3000);
       });
   }).catch(function (error) {
       // Handle any errors
   });
}

recuperarPassword = async (current) => {

    let txtPassword = document.getElementById('txtPassword').value
    let txtRepPassword = document.getElementById('txtRepPassword').value
    let user = firebase.auth().currentUser;

    if(txtPassword !== txtRepPassword){
        alert('La Contraseña debe ser la misma')
    }else if(txtPassword === '') {
        alert('El campo Nueva Contraseña no puede estar vacio')
    }
    else if(txtRepPassword === '') {
        alert('El campo Repetir Contraseña no puede estar vacio')
    }
    else{
        user.updatePassword(txtPassword).then(function() {
            alert('Contraseña Actualizada')
          }).catch(function(error) {
            // An error happened.
          });
    }    
}