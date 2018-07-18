// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
  db.settings(settings);

window.onload = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //Si estamos logueados
      loggedOut.style.display = "none";
      loggedIn.style.display = "block";
    
      //guardar valores del DOM 
      const postbtn = document.getElementById("btn-post");
      const postArea = document.getElementById("postArea");
      
      //Mostrar post anteriores del usuario 
      savePost()
      //evento del boton postear
      postbtn.addEventListener('click', () =>{ 
        validatePost();
        const currentUser = firebase.auth().currentUser;
        const postAreaText = postArea.value;
        //llamando a la coleccion usuarios desde database 
        //escuchando el evento onSnapshot, cada vez que se crea un post
        db.collection("users").onSnapshot((querySnapshot) => {
          
          querySnapshot.forEach((doc) => {
            
            let userName = doc.data().nombre;
            //añadiendo una nueva coleccion
            db.collection("usersPost").add({
              nombre : userName,
              usuario:  currentUser.uid,
              texto : postAreaText
            }) 
            let  showPostArea = document.getElementById("addPostUser");
            //llamando a la nueva coleccion y refrescando el input 
              db.collection("usersPost").onSnapshot((querySnapshot) => {
                showPostArea.innerHTML = " ";
                querySnapshot.forEach((doc) => {
                   postArea.value = " "; 
                  //imprimiendo en html el post 
                  showPostArea.innerHTML +=  `
                  <div class = "input_text_post">             
                  <div>${doc.data().nombre} </div> 
                  <div> : ${doc.data().texto}</div>
                  <button class = "btn-post"><i class="fas fa-heart"></i></button>
                  <button class = "btn-post" onclick="eliminarPost('${doc.id}')"><i class="fas fa-trash"></i></button>
                  <button class = "btn-post" onclick="editarPost('${doc.id}', '${doc.data().texto}')"><i class="fas fa-pencil-alt"></i></button>
                  </div>
                  `;
                  

                });
            })
          })
      
      })  

    }) 


    } else {
      //No estamos logueados
      loggedOut.style.display = "block";
      loggedIn.style.display = "none";
    }
  });


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

}
//validar que no este vacio para postear
function validatePost(){
  const postValue = document.getElementById("postArea").value;
  if(postValue.length === 0){
    prompt("texto vacio");
  }
}

//funcion para dejar post guardados en la pagina 
function savePost(){
  const showSavedPost = document.getElementById("savedPost");

  db.collection("usersPost").onSnapshot((querySnapshot) => {
    
    querySnapshot.forEach((doc) => { 
      
      showSavedPost.innerHTML +=  `
      <div class = "input_text_post">             
      <div>${doc.data().nombre} </div> 
      <div> : ${doc.data().texto}</div>
      <button id="btnLikes" class = "btn-post"><i class="fas fa-heart" onclick="counterLikes()"></i><p id="likes-counter"></p></button>
      <button class = "btn-post" onclick="eliminarPost('${doc.id}')"><i class="fas fa-trash"></i></button>
      <button class = "btn-post" onclick="editarPost('${doc.id}', '${doc.data().texto}')"><i class="fas fa-pencil-alt"></i></button>
      </div>
      `;
    });
  })  
}

//Funcion de eliminar post 
function eliminarPost(id){
  db.collection("usersPost").doc(id).delete().then(function() {
    
    console.log("Document successfully deleted!");
   }).catch(function(error) {
    console.error("Error removing document: ", error);
});
}

//funcion de editar post

function editarPost(id, texto){

  document.getElementById("postArea").value = texto;
  const editButton = document.getElementById("btn-post");
  editButton.innerHTML = "Guardar"; 
  editButton.onclick = function(){
    let postCollection = db.collection("usersPost").doc(id); 

      let newText = document.getElementById("postArea").value;

    
      return postCollection.update({
        texto : newText
      })
      .then(function() {
          console.log("Document successfully updated!");
          editButton.innerHTML = "Postear"; 
      })
      .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });
  }
  
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

//========================================HOME========================================
// Homepage

/* function sendMessage(){
  const currentUser = firebase.auth().currentUser;
  const PostAreaText = postArea.value;

  //Para tener una nueva llave en la colección messages
  const newMessageKey = firebase.database().ref().child('messages').push().key;

  firebase.database().ref(`messages/${newMessageKey}`).set({
      creator : currentUser.uid,
      creatorName : currentUser.displayName,
      text : PostAreaText
  });
} */ 

//Función para eliminar post
//function removePost() { 
//  .parentNode.removeChild();
//}