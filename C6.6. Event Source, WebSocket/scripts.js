const inptNode = document.querySelector(".inpt");
const btnSend = document.querySelector("#js_send");
const btnGeo = document.querySelector("#js_geo");
const divWithChat = document.querySelector(".bordered_div");

const wsUri = 'wss://echo-ws-service.herokuapp.com/';
let webSocket;

function createWebSocket(uri) {
   webSocket = new WebSocket(uri);
   webSocket.onopen = function(evt) {
     const greetNode = document.querySelector(".js_empty_message");
     greetNode.innerHTML = "CONNECTED";
     if (divWithChat.lastElementChild.textContent == "DISCONNECTED") {
       divWithChat.lastElementChild.textContent = "CONNECTED";
     }
   };

   webSocket.onclose = function(evt) {
     displayMessage("DISCONNECTED", "center");
     webSocket.close();
     webSocket = null;
   };
    
   webSocket.onmessage = function(evt) {
     displayMessage(evt.data, "start");
   };
  
   webSocket.onerror = function(evt) {
     console.log("err");
     displayMessage('<span style="color: red;">ERROR:</span> ' + evt.data, "center");
   };
}

window.addEventListener("load", (event) => {
  createWebSocket(wsUri);
});

document.addEventListener("beforeunload", () => {
        writeToScreen("DISCONNECTED", "center");
        webSocket.close();
        webSocket = null;
    }
);

function displayMessage(message, alignStyle) {
  let prgrfNode = document.createElement("p");
  prgrfNode.style.overflowWrap = "break-word";
  prgrfNode.style.alignSelf = alignStyle;
  prgrfNode.className = "p_border";
  prgrfNode.innerHTML = message;
  prgrfNode.style.color = (message == "Гео-локация") ? 'rgba(11,77,127,255)' : 'rgba(0, 0, 0, 1)';
  divWithChat.appendChild(prgrfNode);
  divWithChat.scrollTop = divWithChat.scrollHeight;
}
    
//Если WebSocket закрылся по любой причине, то делаем это:
function sendAttempt(mgs) {
  try {
      webSocket.send(mgs);
    } catch (InvalidStateError) {
      createWebSocket(wsUri);
      webSocket.onopen = function(evt) {
      divWithChat.lastElementChild.previousElementSibling.textContent = "CONNECTED";
      webSocket.send(mgs);
      }
    }
}

btnSend.addEventListener('click', () => {
  const message = inptNode.value ? inptNode.value : "Пустое сообщение";
  displayMessage(message, "end");
  sendAttempt(message);
});


let txtToSend; //сообщение-запрос гео-локации к эхо-серверу
// Функция-параметр для navigator.geolocation.getCurrentPosition(success, error);  
const error = () => {
  window.alert("Невозможно получить ваше местоположение");
}

// Функция-параметр для navigator.geolocation.getCurrentPosition(success, error);
const success = (position) => {
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  txtToSend = `<a target="_blank" href = 'https://www.openstreetmap.org/#map=18/${latitude}/${longitude}'>Ваша локация</a>`;
  displayMessage("Гео-локация", "end");
  sendAttempt(txtToSend);
}

btnGeo.addEventListener('click', () => {
  if (!navigator.geolocation) {
     window.alert("Geolocation не поддерживается вашим браузером");
  } else {
    //console.log("Определение местоположения…");
    navigator.geolocation.getCurrentPosition(success, error);
  }
});

