$(function() {

    //Componentes
    let body = document.getElementById('body')

    body.onload = () => {
        let current = JSON.parse(localStorage.getItem("usuarioSesion"))
        console.log('Usuario',current)
        if(current === null){
            window.location.href = './login.html'
        }
    }
})