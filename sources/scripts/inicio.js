$(function () {

    //Componentes
    let body = document.getElementById('body')
    const btnPerfil = document.getElementById('btnPerfil')

    body.onload = async () => {

        //Cargar la pagina     
        let current = JSON.parse(localStorage.getItem("usuarioSesion"))
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
        elements[i].getElementsByTagName('img')[0].style.width = "250px";
        elements[i].getElementsByTagName('img')[0].style.height = "250px";
    }
}

rowImagenes = () => {
    let lista = [
        {
            id: '1',
            titulo: 'Columna',
            descripcion: 'Descripcion prueba',
            imagen: 'https://sistemas.com/termino/wp-content/uploads/Usuario-Icono.jpg'
        },
        {
            id: '2',
            titulo: 'Columna',
            descripcion: 'Descripcion prueba',
            imagen: 'https://sistemas.com/termino/wp-content/uploads/Usuario-Icono.jpg'
        },
        {
            id: '3',
            titulo: 'Columna',
            descripcion: 'Descripcion prueba',
            imagen: 'https://vignette.wikia.nocookie.net/infotic/images/d/d9/Usuarios.png/revision/latest?cb=20170827062729&path-prefix=es'
        },
        {
            id: '4',
            titulo: 'Columna',
            descripcion: 'Esta imagen esta probada',
            imagen: 'https://sistemas.com/termino/wp-content/uploads/Usuario-Icono.jpg'
        }
    ]
    let rowImagenes = document.getElementById('rowImagenes')
    rowImagenes.innerHTML = ""
    lista.map(item => {
        // console.log('ValorLista: ', item)
        rowImagenes.innerHTML += ` 
        <div class="column" style="background-color:#aaa;">
            <img src=${item.imagen} class="imagenPublica">
            <h2>${item.titulo}</h2>
            <p>${item.descripcion}</p>
        </div>`
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

    db.collection("users").where("uid","==",usuarioId).get().then(function(response){
            response.forEach((res) => {
                console.log('Usuario Result: ',res.data().username)
                txtusername.innerHTML = res.data().username
                txtemail.innerHTML = res.data().email,
                imgPerfil.src = res.data().photo
            })
    })

}