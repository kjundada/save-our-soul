import $ from 'jquery'; 

window.serverURI = 'http://localhost:4000';

getOnlineCount();
setInterval(getOnlineCount, 1000);

function getOnlineCount(){
  $.getJSON(window.serverURI, function(info) {
    $('.online-count>strong').text(info.usersOnline);
  });
}

