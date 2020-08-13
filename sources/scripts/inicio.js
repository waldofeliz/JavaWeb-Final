$(function () {

    //Componentes
    let body = document.getElementById('body')
    const btnPerfil = document.getElementById('btnPerfil')

    body.onload = async () => {

        //Cargar la pagina     
        let current = JSON.parse(localStorage.getItem("usuarioSesion"))
        let usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogin"))
        console.log('Usuario Sesion: ',usuarioSesion)
        // console.log('Usuario', current)
        if (current === null) {
            window.location.href = './login.html'
        }

        //Cargar perfil usuario
        await cargarPerfil(current)

    }

    /* Optional: Add active class to the current button (highlight it) */
    let container = document.getElementById("btnContainer");
    // console.log('Container', container)
    let btns = container.getElementsByClassName("btn");
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }

    btnPerfil.onclick = () => {
        window.location.href = './perfil.html'
    }

    rowImagenes()

});


// Get the elements with class="column"
let elements = document.getElementsByClassName("column");

// Declare a loop variable
let i;

// List View
function listView() {
    for (i = 0; i < elements.length; i++) {
        console.log('Elements: ', elements[i].getElementsByTagName('img'))
        elements[i].style.width = "100%";
        elements[i].style.display = "flex";
        elements[i].style.flexDirection = "column";
        elements[i].style.justifyContent = "center";
        elements[i].style.alignItems = "center";
        elements[i].getElementsByTagName('img')[0].style.width = "300px";
        elements[i].getElementsByTagName('img')[0].style.height = "300px";
    }
}

// Grid View
function gridView() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "50%";
        elements[i].getElementsByTagName('img')[0].style.width = "150px";
        elements[i].getElementsByTagName('img')[0].style.height = "200px";
        elements[i].style.width = "24rem";
    }
}

rowImagenes = () => {
    let rowImagenes = document.getElementById('rowImagenes')

    db.collection("post").get().then(function(response){
        rowImagenes.innerHTML = ""
            response.forEach((res) => {

                db.collection("users").where("uid","==",res.data().uid).get().then(function(response){
                    response.forEach((resUsu) => {
                        rowImagenes.innerHTML += ` 
                        <div class="card column" style="width: 24rem; margin: 1%" id="divCard">
                        <div class="card-header" style="display:flex; flex-direction: row;
                        justify-content: center; align-items: center; text-align: left;">
                            <img src = "${resUsu.data().photo}" class="img-circle" style="width: 3rem; height: 3rem;">
                            <p>${resUsu.data().username}</p>
                        </div>
                        <div class="card-body">
                        <img class="card-img-top imagenPublica" src="${res.data().photo}" alt="">
                        </div>
                        <div class="card-footer">
                        <p class="card-text"></p>
                        </div>
                    </div>
                    `
                    })
            })


                
            })
    })




}

salir = () => {
    let resultado = confirm('Desea salir de la sesión?')

    if(resultado) {
        localStorage.removeItem("usuarioSesion")
        window.location.href = './login.html'
    }
}

cargarPerfil = async (current) => {
    console.log('Current User: ',current)
    console.log('Current User Uid: ',current.uid.toString())
    let usuarioId = current.uid.toString()
    let txtusername = document.getElementById('txtusername')
    let txtemail = document.getElementById('txtemail')
    let imgPerfil = document.getElementById('imgPerfil')
    let imagenLocal = window.location.origin + '/sources/images/usericon2.jpeg'

    db.collection("users").where("uid","==",usuarioId).get().then(function(response){
            response.forEach((res) => {
                console.log('Usuario Result: ',res.data().username)
                txtusername.innerHTML = res.data().username
                txtemail.innerHTML = res.data().email
                if(res.data().photo == ''){
                    imgPerfil.src = imagenLocal
                }else {
                    imgPerfil.src = res.data().photo
                }
            })
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