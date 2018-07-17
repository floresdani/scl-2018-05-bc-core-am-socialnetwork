window.onload = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //Si estamos logueados
      loggedOut.style.display = "none";
      loggedIn.style.display = "block";
      console.log("User > " + JSON.stringify(user));
    } else {
      //No estamos logueados
      loggedOut.style.display = "block";
      loggedIn.style.display = "none";
    }
  });
  //=========POST==========
  firebase.database().ref('messages')
    .limitToLast(2) // Filtro para no obtener todos los mensajes
    .once('value')
    .then((messages) => {
      console.log("Posts" + JSON.stringify(messages));
    })
    .catch(() => {

    });

  //Acá comenzamos a escuchar por nuevos post usando el evento
  //on child_added
  firebase.database().ref('messages')
    .limitToLast(1)//cuántos post aparecerán antes de ser borrados
    .on('child_added', (newMessage) => {
      addPostUser.innerHTML += `
            <div>${newMessage.val().creatorName}</div>
            <div>${newMessage.val().text}</div>
        `;
    });
  //=================CHAT=========
  firebase.database().ref('chats')
    .limitToLast(2) // Filtro para no obtener todos los mensajes
    .once('value')
    .then((chats) => {
      console.log("Chats" + JSON.stringify(chats));
    })
    .catch(() => {
      console.log(errorMessage);
    });

  //Acá comenzamos a escuchar por nuevos post usando el evento
  //on child_added
  firebase.database().ref('chats')
    .limitToLast(1)//cuántos post aparecerán antes de ser borrados
    .on('child_added', (newChat) => {
      addChatUser.innerHTML += `
            <div>${newChat.val().creatorName}</div>
            <div>${newChat.val().text}</div>
        `;
    });

  //Un valor de marcador de posición para completar automáticamente la marca de tiempo actual (tiempo transcurrido desde la época de Unix, en milisegundos) según lo determinen los servidores de Firebase.
  let sessionsRef = firebase.database().ref("sessions");
  sessionsRef.push({
    startedAt: firebase.database.ServerValue.TIMESTAMP
  });
  //EVENTO DOM CLICK EN CHAT

};
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
//======================================== HOME ========================================

// Función de enviar post
function sendMessage() {
  const currentUser = firebase.auth().currentUser;
  const PostAreaText = postArea.value;

  // Para tener una nueva llave en la colección messages
  const newMessageKey = firebase.database().ref().child('messages').push().key;

  firebase.database().ref(`messages/${newMessageKey}`).set({
    creator: currentUser.uid,
    creatorName: currentUser.displayName,
    text: PostAreaText
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

