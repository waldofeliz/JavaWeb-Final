$(function() {

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});


//Botones
let btnEnviar = document.getElementById('btnEnviar')



//Eventos boton
btnEnviar.onclick = function() {
	modal.style.display = "block"
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
btn.onclick = function() {
  modal.style.display = "block"
}

// When the user clicks the button close, close modal
btnClose.onclick = function() {
	modal.style.display = "none"
  }

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none"
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none"
  }
}

});

crearUsuario = async () => {
	let userName = document.getElementById('txtRusername').value
	let email = document.getElementById('txtRemail').value
	let password = document.getElementById('txtRpassword').value
	let confirmPassword = document.getElementById('txtRconfirmPassword').value
	let mensajeError = ''

	if(userName ===''){
		return alert('El campo de usuario puede estar vacio')
	}else if(email === ''){
		return alert('El campo email no puede estar vacio')
	} else if(password === ''){
		return alert('El campo de password no puede estar vacio')
	}else if(password !== confirmPassword){
		return alert('Debe confirmar el password')
	}
	
	
	const userAuth = await firebase.auth().createUserWithEmailAndPassword(email, password)
	.catch(error => {
		mensajeError = error.message
	})

	if(mensajeError.length > 0)
	return alert(mensajeError.toString())

	  let user = {
			username: userName,
		  	email: email,
			uid: userAuth.user.uid
	  }
	  if(userAuth.user.id.length > 0)
	  guardar(user)
}

 guardar = (user) => {
	db.collection('users').add({
		username : user.username,
		email : user.email,
		uid : user.uid
	})
	.then(us => {
		console.log('us: ',us)
	})
	.catch(error => {
		console.log('error: ',error)
	})
}