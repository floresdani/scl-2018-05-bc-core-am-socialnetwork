// Initialize firebase
var database = firebase.database();

window.onload = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //Si estamos logueados
      loggedOut.style.display = "none";
      loggedIn.style.display = "block";   
      
      //evento del boton postear 
      postbtn.addEventListener('click', () =>{ 
        validatePost();   
        createCollection();
        imprimir();
        postArea.innerHTML = " ";         
      })
      //const user = firebase.auth().currentUser;
      //if(user){
      //console.log(user);  
      //db.collection("users").add({
        //nombre:  user.displayName,
        //id: user.uid,
        //email: user.email,
        //edad : userAge.value
      //})
       //Mostrar post anteriores del usuario 
      //savePost();

    } else {
      //No estamos logueados
      loggedOut.style.display = "block";
      loggedIn.style.display = "none";
    }
  })}


//===============================LOGIN========================================
//Aquí va la función de iniciar sesión con email
function login() {
  const emailValue = email.value;
  const passwordValue = password.value;
  firebase.auth().signInWithEmailAndPassword(emailValue, passwordValue)
    .then(() => {
      console.log("Usuario con login exitoso");
    })
    .catch((error) => {
      console.log("Error de firebase" + error.code);
      console.log("Error de firebase, mensaje" + error.message);
    });
}
//Aquí va la función de cerrar sesión
function logout() {
  firebase.auth().signOut()
    .then(() => {
      console.log("Vuelve pronto, te extrañaremos");
    })
    .catch();
}
//Aquí va la función de iniciar sesión con Facebook
function loginFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  //provider.addScope("user_birthday"); tienen que pedirle permiso a facebook
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then(() => {
      console.log("Login con facebook");
      const user = firebase.auth().currentUser;

    db.collection("users").add({
      nombre:  user.displayName,
      id: user.uid,
      email: user.email,
      edad : userAge.value
    })
    })
    .catch((error) => {
      console.log("Error de firebase" + error.code);
      console.log("Error de firebase, mensaje" + error.message);
    });
}
//funcion login google
function loginGoogle() {

  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
  firebase.auth().getRedirectResult().then(function (result) {
    
  })
    // This gives you a Google Access Token. You can use it to access the Google API.
    //let token = result.credential.accessToken;
    // The signed-in user info.
    //let user = result.user;
  .catch(function (error) {
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
//=======================================REGISTRO=====================================
const userNameInput = document.getElementById("name_input" );
//tomar valores del DOM
const errorNombre = document.getElementById("error_nombre");
const userAge = document.getElementById("edad_input");
const email = document.getElementById("email_register");

const password = document.getElementById("password_register"); 

const password2 = document.getElementById("password_register");
const errorMsg = document.getElementById("error_password")
const confirmPassword = document.getElementById("confirm_password");
const errorConfirmPassword = document.getElementById("error_confirm_password");
const rememberMe = document.getElementById("rememeber_check");
const agree = document.getElementById("terms_check");
const createAcountBtn = document.getElementById("create_acount_button");



//validar que el nombre sean solo letras 
userNameInput.addEventListener('keyup', () =>{
  var letras=/^[A-Za-z\_\-\.\s\xF1\xD1]+$/;
  if(letras.test(userNameInput.value)) {
    errorNombre.innerHTML = " ";
  } else {
    errorNombre.innerHTML = "El nombre debe contener solo letras";
  }
})

//validar que la contraseña tenga minimo 6 caracteres
password2.addEventListener('keyup', () =>{
  if(password2.value.length < 6) {
    errorMsg.innerHTML = "La contraseña debe tener minimo 6 caracteres";
  } else if(password2.value.length >= 6) {
    errorMsg.innerHTML = " ";
  }
})

//validar que sea la misma contraseña 
confirmPassword.addEventListener('keyup', () => {
  if(password.value === confirmPassword.value){
    errorConfirmPassword.innerHTML = " ";
  } else {
    errorConfirmPassword.innerHTML = "Porfavor revisa la contraseña debe coincidir";
  }
})

//validar que acepte los terminos y condiciones 
agree.addEventListener('change', validateAgree, false); 
function validateAgree(){
  let checked = agree.checked;
  if(checked){
    createAcountBtn.disabled = false;
  } else {
    createAcountBtn.disabled = true;
  }
}

//guardar estos valores en un usuario con local storage (con el boton recordar)
rememberMe.addEventListener('change', saveLocalUser, false);  

  function saveLocalUser(){
    let checked = rememberMe.checked; 
    if(checked){
      window.localStorage.setItem('password', JSON.stringify(password_register.value));
      window.localStorage.setItem('email', JSON.stringify(email_register.value));
      window.localStorage.setItem('nombre', JSON.stringify(userName.value));
      window.localStorage.setItem('edad', JSON.stringify(userAge.value));
    }
  }
			
//llevarme a la siguiente ventana con el boton 
createAcountBtn.addEventListener('click', () => { 
    const emailVal = email.value; 
    const passwordVal = password.value; 
    //crear esta cuenta en firebase (con el boton crear cuenta)
    firebase.auth().createUserWithEmailAndPassword(emailVal, passwordVal)
    .then(() => {
      //cambiar de seccion
    const hideSection = document.getElementById('register_section');
    hideSection.style.display = "none";
    //crear coleccion de usuarios
    const user = firebase.auth().currentUser;

    db.collection("users").add({
      nombre:  userNameInput.value,
      id: user.uid,
      email: user.email,
      edad : userAge.value
    })
    .then(function(docRef) {
      //console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
    }) 
    .catch((error) => {
      console.log('fallo el registro', error);
    })
})
//========================================HOME========================================
//variables globales
let collectionRef;
let id; 
let nombre; 
let texto; 


 //guardar valores del DOM 
 const postbtn = document.getElementById("btn-post");
 const postArea = document.getElementById("postArea");

//validar que no este vacio para postear
function validatePost(){
  const postValue = document.getElementById("postArea").value;
  if(postValue.length === 0){
    prompt("texto vacio");
  }
}

//funcion que crea la coleccion de usuario
function createCollection(){
  
  const currentUser = firebase.auth().currentUser; 
  const cUserName = currentUser.displayName;
  const postAreaText = postArea.value;
  
  //crear llave de cada post 
   const newPostKey = firebase.database().ref().child('post').push().key;
  
   firebase.database().ref(`post/${newPostKey}`).set({
    nombre : cUserName,
    usuario:  currentUser.uid,
    texto : postAreaText
   });
 }
     

//funcion para dejar post guardados en la pagina 

/* function savePost(){
  const showSavedPost = document.getElementById("savedPost");
  const postRef = db.collection("usersPost");
  const postID = postRef.doc().get("id");
      console.log(postID); 
      showSavedPost.innerHTML +=  `
      <div class = "input_text_post">             
      <div>${doc.data().nombre} </div> 
      <div> : ${doc.data().texto}</div>
      <button id="btnLikes" class = "btn-post"><i class="fas fa-heart" onclick="counterLikes()"></i><p id="likes-counter"></p></button>
      <button class = "btn-post" onclick="eliminarPost('${doc.id}')"><i class="fas fa-trash"></i></button>
      <button class = "btn-post" onclick="editarPost('${doc.id}', '${doc.data().texto}')"><i class="fas fa-pencil-alt"></i></button>
      </div>
      `;
    
  
}
*/ 

//funcion que imprime 
function imprimir(){
  const showPostArea = document.getElementById("addPostUser");
  //imprimiendo en html el post 
  //Acá comenzamos a escuchar por nuevos mensajes usando el evento
  //on child_added
  firebase.database().ref('post')
    .limitToLast(1)//cuántos post aparecerán antes de ser borrados
    .on('child_added', (newPost) => {
      showPostArea.innerHTML += `
      <div class = "input_text_post">             
      <div> ${newPost.val().nombre}</div> 
      <div> : ${newPost.val().texto} </div>
      <button id="btnLikes" class = "btn-post"><i class="fas fa-heart" onclick="counterLikes()"></i><p id="likes-counter"></p></button>
      <button class = "btn-post" onclick="eliminarPost('${newPost}')"><i class="fas fa-trash"></i></button>
      <button class = "btn-post" onclick="editarPost('${newPost}', '${newPost.val().texto}')"><i class="fas fa-pencil-alt"></i></button>
      </div>
      `; 
    });
  }

//Funcion de eliminar post 
function eliminarPost(cUserName){
  db.collection("usersPost").doc(cUserName).delete().then(function() {
    
    console.log("Document successfully deleted!");
   }).catch(function(error) {
    console.error("Error removing document: ", error);
});
};

//funcion de editar post

function editarPost(cUserName, texto){

  document.getElementById("postArea").value = texto;
  const editButton = document.getElementById("btn-post");
  editButton.innerHTML = "Guardar"; 
  editButton.addEventListener('click', () => { 
    let newText = document.getElementById("postArea").value;
    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
      
        })
      
}

//funcion que borra el post anterior 
function deleteOld(){

}

// Función contador de LIKES
let i = 0;
function counterLikes() {
 // const btnLike = document.getElementById('btnLikes');
  i = i + 1;
  const showLikes = document.getElementById('likes-counter');
  showLikes.innerHTML = i; 
  console.log(showLikes)
 // showLikes.value = i;
 if(i > 1 || i == 2) {
document.getElementById('btnLikes').disabled = true;
}
}