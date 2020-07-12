import $ from 'jquery'; 

window.serverURI = 'https://save-our-soul.herokuapp.com';
// window.serverURI = 'http://localhost:4000';

console.log("serverURI", window.serverURI);

getOnlineCount();
setInterval(getOnlineCount, 1000);

async function getOnlineCount(){
  const response = await fetch(window.serverURI+"/info", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  const info = await response.json();
  $('.online-count>strong').text(info.usersOnline);
}

