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