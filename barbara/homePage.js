// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
  db.settings(settings);

window.onload = () => {

  inicializarFirebase();

  // Llevarme a la ventana de login al presionar botón Entrar 
  const entrar = document.getElementById('btn-entrar');
  entrar.addEventListener('click', () => {
    loggedOut.style.display = "block";
    landingPage.style.display = "none";
  });

  // Llevarme a la ventana de crear cuenta al presionar botón Registro
  const registro = document.getElementById('registerBtn');
  registro.addEventListener('click', () => {
    loggedOut.style.display = "none";
    registerPage.style.display = "block";
  });

  //--------Daniela--------
  function inicializarFirebase() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) { //Si estamos logueados

        loggedOut.style.display = "none";
        navBar.style.display = "block";
        loggedHome.style.display = "block";

        const displayName = user.displayName;
        const userPhoto = user.photoURL;
        const phoneNumber = user.phoneNumber;
        const email = user.email;

        // Imprimiendo imagen de perfil en el muro
        homePageImageUser.style.backgroundImage = "url(" + userPhoto + ")";


        // Imprimiendo nombre y foto en perfil
        profileName.textContent = displayName;
        profileImage.style.backgroundImage = "url(" + userPhoto + ")";

        emailProfile.textContent = email;
        phone.textContent = phoneNumber;

        console.log("User > " + JSON.stringify(user));

      } else {
        //No estamos logueados
        landingPage.style.display = "block";
        navBar.style.display = "none";
        loggedHome.style.display = "none";

      }
    });
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) { //Si estamos logueados

      loggedOut.style.display = "none";
      navBar.style.display = "block";
      loggedHome.style.display = "block";
      
      const displayName = user.displayName;
      const userPhoto = user.photoURL;
      const phoneNumber = user.phoneNumber;
      const email = user.email;
      
      // Imprimiendo imagen de perfil en el muro
      homePageImageUser.style.backgroundImage = "url("+userPhoto+")";

      // Imprimiendo datos de contacto y foto en perfil
      profileName.textContent = displayName;
      profileImage.style.backgroundImage = "url("+userPhoto+")";
      emailProfile.textContent = email;
      phone.textContent = phoneNumber;

      function accesToProfile () {
        loggedHome.style.display = "none";
        navBar.style.display = "block";
        loggedProfile.style.display = "block";
      };

      console.log("User > " + JSON.stringify(user));

    } else {
      //No estamos logueados
      landingPage.style.display = "block";
      navBar.style.display = "none";
      loggedHome.style.display = "none";
    }
  });
}

  firebase.database().ref('messages')
    .limitToLast(2) // Filtro para no obtener todos los mensajes
    .once('value')
    .then((messages) => {
      console.log("Posts" + JSON.stringify(messages));
    })
    .catch(() => {

    });

  //Acá comenzamos a escuchar por nuevos mensajes usando el evento
  //on child_added
  firebase.database().ref('messages')
    .limitToLast(1)//cuántos post aparecerán antes de ser borrados
    .on('child_added', (newMessage) => {
      addPostUser.innerHTML += `
            <div>${newMessage.val().creatorName}</div>
            <div>${newMessage.val().text}</div>
            <div>${newMessage.val().timestamp}</div>
            
          
        `;
    });
};
//===============================LOGIN========================================
//Aquí va la función de iniciar sesión con email y contraseña
function login() {
  const emailValue = emailLogin.value;
  const passwordValue = passwordLogin.value;
  firebase.auth().signInWithEmailAndPassword(emailValue, passwordValue)
    .then(() => {
      console.log("Usuario con login exitoso");

    })
    .catch((error) => {
      console.log("Error de firebase" + error.code);
      console.log("Error de firebase, mensaje" + error.message);
    });
}
// *****Aquí va la función de cerrar sesión****
function logout() {
  firebase.auth().signOut()
    .then(() => {
      const logOutBtn = document.getElementById('logOutButton');
      logOutBtn.addEventListener('click', () => {

        landingPage.style.display = "block";
        navBar.style.display = "none";
        loggedOut.style.display = "none";
        console.log("Vuelve pronto, te extrañaremos");
    })
    .catch();
}
// Aquí va la función de iniciar sesión con Facebook
function loginFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();

  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then(() => {
      console.log("Login con facebook");
    })
    .catch((error) => {
      console.log("Error de firebase" + error.code);
      console.log("Error de firebase, mensaje" + error.message);
    });
}
// Función login con Google
const profileName = document.getElementById('userName');
const profileImage = document.getElementById('userImage');
const homePageImageUser = document.getElementById('homePageImageUser');
const emailProfile = document.getElementById('emailProfile');
const phone = document.getElementById('phone');

function loginGoogle() {

  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
  firebase.auth().getRedirectResult().then(function (result) {

    // This gives you a Google Access Token. You can use it to access the Google API.
    //let token = result.credential.accessToken;
    // The signed-in user info.
    //let user = result.user;
  }).catch(function (error) {
    console.log('entrar' + error);
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    // The email of the user's account used.
    let email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    let credential = error.credential;

  });

}
//========================================HOME========================================
// Homepage
const btnPost = document.getElementById('btnSendPost');

btnPost.addEventListener('click', () => {
  //Limpiar textarea
  document.getElementById('postArea').value = ' ';
  //Acá se guarda el post ingresado
  let post = document.getElementById('postArea').value;
  //validación de textarea con contenido
  if (post.length === 0 || post === null) {
    return alert('Ingrese un comentario');
  };

  //Acá se imprimirán los post ingresados 
  const postsContainer = document.getElementById('addPostUser');
  //Se crea un div contenedor para nuevos elementos
  const newPosts = document.createElement('div');
  //crear ícono de comentario
  const commentIcon = document.createElement('i');
  commentIcon.classList.add('far', 'fa-comment-alt');
  //crear ícono de me gusta
  const likeIcon = document.createElement('i');
  likeIcon.classList.add('fas', 'fa-heart', 'heart');
  //crear ícono de agregar a amigos
  const addUserIcon = document.createElement('i');
  addUserIcon.classList.add('fas', 'fa-user-plus');

  //Parentesco de los nodos creados
  let textNewPosts = document.createTextNode(post);
  const containerElements = document.createElement('div');
  containerElements.appendChild(textNewPosts);
  newPosts.appendChild(commentIcon);
  newPosts.appendChild(likeIcon);
  newPosts.appendChild(addUserIcon);
  newPosts.appendChild(containerElements);
  postsContainer.appendChild(newPosts);

  //Función para eliminar post
  //function removePost() { 
  //  .parentNode.removeChild();
  //}

  //al ingresar post aparecerán estos elementos
});
//funcion de enviar post
function sendMessage() {
  const currentUser = firebase.auth().currentUser;
  const PostAreaText = postArea.value;
const startedAt = firebase.database.ServerValue.TIMESTAMP;

  //Para tener una nueva llave en la colección messages
  const newMessageKey = firebase.database().ref().child('messages').push().key;

  firebase.database().ref(`messages/${newMessageKey}`).set({
    creator: currentUser.uid,
    creatorName: currentUser.displayName,
    text: PostAreaText,
    timestamp: {".sv":"timestamp"}
  });
  
}

//======================================== CHAT ====================================

// Función enviar chat
function sendChat() {
  const currentUser = firebase.auth().currentUser;
  const chatAreaText = textAreaChat.value;
  // Validar que no este vacío el chat
  if (chatAreaText.length === 0 || chatAreaText == null) {
    return alert('Debes ingresar un mensaje')
  }
  // Para tener una nueva llave en la colección messages del chat
  const newChatKey = firebase.database().ref().child('chats').push().key;

  firebase.database().ref(`chats/${newChatKey}`).set({
    creator: currentUser.uid,
    creatorName: currentUser.displayName,
    text: chatAreaText
  });
}

// ------Mariel-----

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

const userName = document.getElementById("name_input");
//tomar valores del DOM
const errorNombre = document.getElementById("error_nombre");
const userAge = document.getElementById("edad_input");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password");
const errorMsg = document.getElementById("error_password")
const confirmPassword = document.getElementById("confirm_password");
const errorConfirmPassword = document.getElementById("error_confirm_password");
const rememberMe = document.getElementById("rememeber_check");
const agree = document.getElementById("terms_check");
const createAcountBtn = document.getElementById("create_acount_button");
const userName = document.getElementById('name_input');
//tomar valores del DOM
const errorNombre = document.getElementById('error_nombre');
const userAge = document.getElementById('edad_input');
const email = document.getElementById('email_register');
const password = document.getElementById('enter_password'); 
const password2 = document.getElementById('enter_password');
const errorMsg = document.getElementById('error_password')
const confirmPassword = document.getElementById('confirm_password');
const errorConfirmPassword = document.getElementById('error_confirm_password');
const rememberMe = document.getElementById('remember_check');
const agree = document.getElementById('terms_check');
const createAcountBtn = document.getElementById('create_acount_button');

//validar que el nombre sean solo letras 
userName.addEventListener('keyup', () => {
  var letras = /^[A-Za-z\_\-\.\s\xF1\xD1]+$/;
  if (letras.test(userName.value)) {
    errorNombre.innerHTML = " ";
  } else {
    errorNombre.innerHTML = "El nombre debe contener sólo letras";
  }
})

//validar que la contraseña tenga minimo 6 caracteres
password2.addEventListener('keyup', () => {
  if (password2.value.length < 6) {
    errorMsg.innerHTML = "La contraseña debe tener como mínimo 6 caracteres";
  } else if (password2.value.length >= 6) {
    errorMsg.innerHTML = " ";
  }
})

//validar que sea la misma contraseña 
confirmPassword.addEventListener('keyup', () => {
  if (password.value === confirmPassword.value) {
    errorConfirmPassword.innerHTML = " ";
  } else {
    errorConfirmPassword.innerHTML = "Por favor revisa, ambas contraseñas deben coincidir";
  }
})

//validar que acepte los terminos y condiciones 
agree.addEventListener('change', validateAgree, false);
function validateAgree() {
  let checked = agree.checked;
  if (checked) {
    createAcountBtn.disabled = false;
  } else {
    createAcountBtn.disabled = true;
  }
}

// Guardando estos valores en un usuario con local storage (con el boton recordar)

rememberMe.addEventListener('change', saveLocalUser, false);

function saveLocalUser() {
  let checked = rememberMe.checked;
  if (checked) {
    window.localStorage.setItem('password', JSON.stringify(password.value));
    window.localStorage.setItem('email', JSON.stringify(email.value));
    window.localStorage.setItem('nombre', JSON.stringify(userName.value));
    window.localStorage.setItem('edad', JSON.stringify(userAge.value));

rememberMe.addEventListener('change', saveLocalUser, false);  

  function saveLocalUser(){
    let checked = rememberMe.checked; 
    if(checked){
      window.localStorage.setItem('password', JSON.stringify(enter_password.value));
      window.localStorage.setItem('email', JSON.stringify(email_register.value));
      window.localStorage.setItem('nombre', JSON.stringify(userName.value));
      window.localStorage.setItem('edad', JSON.stringify(userAge.value));
    }
  }
}

//llevarme al muro (Home page) al presionar botón Registrar 

createAcountBtn.addEventListener('click', () => {
  const emailVal = email.value;
  const passwordVal = password.value;
  // Crear esta cuenta en Firebase (con el botón Registrar)
  firebase.auth().createUserWithEmailAndPassword(emailVal, passwordVal)
    .then(() => {
      // ********Cambiar de sección**********
      const hideSection = document.getElementById('registerPage'); // Esconder página de registro
      const showSection1 = document.getElementById('navBar'); // Mostrar barra de navegación
      const showSection2 = document.getElementById('loggedHome'); // Mostrar muro

      hideSection.style.display = "none";
      showSection1.style.display = "block";
      showSection2.style.display = "block";

function createAccount() { 
    const emailVal = email_register.value; 
    const passwordVal = enter_password.value; 
    // Crear esta cuenta en Firebase (con el botón Registrar)
    firebase.auth().createUserWithEmailAndPassword(emailVal, passwordVal)
    .then(() => {
    // ********Cambiar de sección**********
    registerPage.style.display ="none"; // Esconder página de registro
    navBar.style.display="block";// Mostrar barra de navegación
    loggedHome.style.display="block";// Mostrar muro
    
    });

  // Creando colección de usuarios
  const user = firebase.auth().currentUser;

  db.collection("users").add({
    nombre: userName.value,
    id: user.uid,
    email: user.email,
    edad: userAge.value
  })
    .then(function (docRef) {
      //console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
})
    }
   

    
