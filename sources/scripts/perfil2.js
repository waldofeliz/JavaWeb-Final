$(function () {

    //Componentes
    const body = document.getElementById('body')
    let current

    body.onload = async () => {

        //Cargar la pagina     
        current = JSON.parse(localStorage.getItem("usuarioContacto"))
        if (current === null) {
            window.location.href = './login.html'
        }

        //Cargar perfil usuario
        await cargarPerfil(current)
        await cargarPostUsuario(current)

    }

});

salir = () => {
    let resultado = confirm('Desea salir de la sesión?')

    if(resultado) {
        localStorage.removeItem("usuarioSesion")
        localStorage.removeItem("usuarioContacto")
        localStorage.removeItem("usuarioLogin")
        window.location.href = './login.html'
    }
}

irInicio = () => {
        localStorage.removeItem("usuarioContacto")
        window.location.href = './inicio.html'
}

cargarPerfil = async (current) => {
    let usuarioId = current
    let txtusername = document.getElementById('txtusername')
    let pComentario = document.getElementById('pComentario')
    let imgPerfil = document.getElementById('imgPerfil')
    let imagenLocal = window.location.origin + '/sources/images/usericon2.jpeg' 

    db.collection("users").where("uid","==",usuarioId).get().then(function(response){
            response.forEach((res) => {
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

cargarPostUsuario = async (current) => {
    let usuarioId = current
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
                                <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i>0</li>
                                <li class="gallery-item-comments"><span class="visually-hidden">Comments:</span><i class="fas fa-comment" aria-hidden="true"></i>0</li>
                            </ul>
        
                        </div>
        
                    </div>
                </div>`
            })
    })
}