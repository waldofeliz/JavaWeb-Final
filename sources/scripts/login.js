$(function () {

	$('#login-form-link').click(function (e) {
		$("#login-form").delay(100).fadeIn(100);
		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function (e) {
		$("#register-form").delay(100).fadeIn(100);
		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

	//Botones
	let btnEnviar = document.getElementById('btnEnviar')
	let btnRegistrar = document.getElementById('btnRegistrar')
	let btnLogin = document.getElementById('btnLogin')

	//Eventos boton
	btnEnviar.onclick = () => {
		restablecerPassword()
	}
	btnRegistrar.onclick = function () {
		crearUsuario()
	}
	btnLogin.onclick = function () {
		loginUsuario()
	}


	// Get the modal
	var modal = document.getElementById("myModal")

	// Get the button that opens the modal
	var btn = document.getElementById("myBtn")

	//Get btnClose 
	var btnClose = document.getElementById('btnClose')

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0]

	// When the user clicks the button, open the modal 
	btn.onclick = () => {
		modal.style.display = "block"
	}

	// When the user clicks the button close, close modal
	btnClose.onclick = () => {
		modal.style.display = "none"
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = () => {
		modal.style.display = "none"
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = (event) => {
		if (event.target == modal) {
			modal.style.display = "none"
		}
	}

//Remember me

if (localStorage.chkbox && localStorage.chkbox != '') {
    $('#rmCheck').attr('checked', 'checked');
    $('#txtEmail').val(localStorage.username);
	$('#txtpassword').val(localStorage.pass);
} else {
    $('#rmCheck').removeAttr('checked');
    $('#txtEmail').val('');
    $('#txtpassword').val('');
}

$('#rmCheck').click(function () {

    if ($('#rmCheck').is(':checked')) {
        // save username and password
        localStorage.username = $('#txtEmail').val();
        localStorage.pass = $('#signinPwd').val();
		localStorage.chkbox = $('#txtpassword').val();		
		alert('Email y Password almacenados en el navegador')
    } else {
        localStorage.username = '';
        localStorage.pass = '';
        localStorage.chkbox = '';
    }
});


//END remember me

});

//Funciones
crearUsuario = async () => {
	let userName = document.getElementById('txtRusername').value
	let email = document.getElementById('txtRemail').value
	let password = document.getElementById('txtRpassword').value
	let confirmPassword = document.getElementById('txtRconfirmPassword').value
	let mensajeError = ''

	if (userName === '') {
		return alert('El campo de usuario puede estar vacio')
	} else if (email === '') {
		return alert('El campo email no puede estar vacio')
	} else if (password === '') {
		return alert('El campo de password no puede estar vacio')
	} else if (password !== confirmPassword) {
		return alert('Debe confirmar el password')
	}


	const userAuth = await firebase.auth().createUserWithEmailAndPassword(email, password)
		.catch(error => {
			mensajeError = error.message
		})

	if (mensajeError.length > 0)
		return alert(mensajeError.toString())

	let user = {
		username: userName,
		email: email,
		uid: userAuth.user.uid
	}
	if (userAuth.user.uid.length > 0)
		guardar(user)
}

guardar = (user) => {
	db.collection('users').add({
		username: user.username,
		email: user.email,
		uid: user.uid,
		photo : '',
		comentario: ''
	})
		.then(us => {
			console.log('us: ', us)
			alert('Usuario registrado satisfactoriamente')
			window.location.reload()
		})
		.catch(error => {
			console.log('error: ', error)
		})
}

restablecerPassword = () => {
	let emailReset = document.getElementById('txtEnviar').value
	firebase.auth().sendPasswordResetEmail(emailReset)
		.then(response => {
			console.log('Response Reset: ', response)
		})
		.catch(error => {
			console.log('Response Error: ', error)
		})
}

loginUsuario = async () => {
	let email = document.getElementById('txtEmail').value
	let password = document.getElementById('txtpassword').value

	firebase.auth().signInWithEmailAndPassword(email, password)
	.then(response => {
		//alert('Sesion iniciada')
		let usuario = firebase.auth().currentUser;

		//Cargar perfil
		cargarPerfil(usuario)

		console.log('Usuario login',JSON.stringify(usuario))
		localStorage.setItem("usuarioSesion",JSON.stringify(usuario))
		window.location.href = './inicio.html'
		return false
	})
	.catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		alert('No se ha podido iniciar sesión. \nValidar el usuario y password insertado.')
		email.value = ''
		password.value = ''
		recargar()
		return false
	  });
	  return false
}

cargarPerfil = async (current) => {
	let usuarioId = current.uid.toString()

    db.collection("users").where("uid","==",usuarioId).get().then(function(response){
            response.forEach((res) => {
				console.log('Usuario Result: ',res.data().username)
				let usuarioSesion = {
					username : res.data().username,
					photo : res.data().photo
				}
				localStorage.setItem("usuarioLogin",JSON.stringify(usuarioSesion))
				console.log('Usuario Sesion: ',JSON.stringify(usuarioSesion))
            })
    })
}

recargar = () => {
    location.reload()
}