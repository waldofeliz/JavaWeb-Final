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
	/*.then(function(user){
		let usuario = user.user.uid
		console.log('Usuario',usuario)
	})
	.catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorCode)
		alert(errorMessage)
		// ...
	  });
	  */
	  let user = {
			username: userName,
		  	email: email,
			uid: userAuth.user.uid
	  }

	  db.ref('users/' + user.uid).set(user)
	  .then(us => {
		  console.log('User Create: ',us)
	  })
	  .catch(error=> {
		  console.log('Error User: ',error.message)
	  })

}
