import $ from 'jquery'; 


window.serverURI = 'http://localhost:4000';
window.onbeforeunload = () => 'Are you sure you want to leave?';

getOnlineCount();
setInterval(getOnlineCount, 5000);

function getOnlineCount(){
  $.getJSON(window.serverURI, function(info) {
    $('.online-count>strong').text(info.usersOnline);
  });
}

