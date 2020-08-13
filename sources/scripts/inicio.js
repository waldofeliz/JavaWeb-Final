$(function () {

    //Componentes
    let body = document.getElementById('body')
    const btnPerfil = document.getElementById('btnPerfil')

    body.onload = async () => {

        //Cargar la pagina     
        let current = JSON.parse(localStorage.getItem("usuarioSesion"))
        let usuarioSesion = JSON.parse(localStorage.getItem("usuarioLogin"))
        if (current === null) {
            window.location.href = './login.html'
        }

        //Cargar perfil usuario
        await cargarPerfil(current)

        cargarContactos()

    }

    /* Optional: Add active class to the current button (highlight it) */
    let container = document.getElementById("btnContainer");
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
                            <img id="imgPost" src= "${resUsu.data().photo}" class="img-circle" style="width: 3rem; height: 3rem;" alt="${resUsu.data().uid}">
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
    let usuarioId = current.uid.toString()
    let txtusername = document.getElementById('txtusername')
    let txtemail = document.getElementById('txtemail')
    let imgPerfil = document.getElementById('imgPerfil')
    let imagenLocal = window.location.origin + '/sources/images/usericon2.jpeg'

    db.collection("users").where("uid","==",usuarioId).get().then(function(response){
            response.forEach((res) => {
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

cargarContactos = () => {
    let contactlist = document.getElementById('contact-list')
    db.collection("users").get().then(function(response){
        contactlist.innerHTML = ''
        response.forEach((res) => {
            contactlist.innerHTML += `
            <li class="list-group-item">
            <div class="row w-100">
                <div class="col-12 col-sm-6 col-md-3 px-0">
                    <img src="${res.data().photo}"
                        alt="${res.data().username}" class="rounded-circle mx-auto d-block img-fluid">
                </div>
                <div class="col-12 col-sm-6 col-md-9 text-center text-sm-left">
                    <span class="fa fa-envelope fa-2x text-success float-right pulse"
                        style="font-size:20px;"
                        title="online now"></span>
                    <label class="name lead">${res.data().username}</label>
                    <br>
                    <span class="fa fa-envelope fa-fw text-muted" data-toggle="tooltip"
                        data-original-title="" title=""></span>
                    <span class="text-muted small text-truncate">${res.data().email}</span>
                </div>
            </div>
        </li>
            `
        })
})
}