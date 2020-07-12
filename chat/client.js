'use strict';
module.exports = client;

function client(socket) {
  let {id} = socket;
  let partnersMap = {};
  let videoHandshake = {};
  let currentPartner = false;
  let isWaiting = true;
  let chatInfo;

  resetVideoHandshake();
  return {
    id,
    socket,
    setPartnerInfo,
    isValidPartner,
    waitNext,
    sendSystemInfo,
    sendMessageToPartner,
    disconnectFromPartner,
    requestVideoInit,
    sendVideoOffer,
    sendVideoOfferResponse,
    sendVideoICE,
    setchatInfo,
    isWaiting: () => isWaiting,
    getPartner: () => currentPartner,
    getchatInfo: () => chatInfo
  };

  function setPartnerInfo(partner) {
    if (!partnersMap[partner.id]) partnersMap[partner.id] = {chatsCount:0};

    let currentTimestamp = Math.floor(Date.now() / 1000);

    partnersMap[partner.id].lastChatTimestamp = currentTimestamp;
    partnersMap[partner.id].chatsCount++;

    isWaiting = false;
    currentPartner = partner;
    partner.sendSystemInfo('partner_connected');
  }

  function setchatInfo(type) {
    chatInfo = type;
  }

  function resetVideoHandshake() {
    videoHandshake = {
      offerSent: false,
      offerResponseSent: false
    };
  }

  function disconnectFromPartner() {
    if (currentPartner) {
      currentPartner.waitNext();
      currentPartner.sendSystemInfo('partner_disconnected');
    }
    resetVideoHandshake();
    currentPartner = false;
  }

  function sendMessageToPartner(message) {
    let msg = {
      from: 'partner',
      content: message
    };
    if (currentPartner) {
      socket.broadcast.to(currentPartner.id).emit('msg', msg);
    }
  }

  function sendSystemInfo(code) {
    socket.emit('sysinfo', code);
  }

  function requestVideoInit() {
    console.log("Server is emitting ready.");
    socket.emit('ready');
  }

  function sendVideoOffer(data) {
    if (!videoHandshake.offerSent) {
      console.log("Server sending video offer");
      socket.emit('offer', data);
      videoHandshake.offerSent = true;
      return true;
    }
    return false;
  }

  function sendVideoOfferResponse(res) {
    if (!videoHandshake.offerResponseSent) {
      socket.emit('answer', res);
      videoHandshake.offerResponseSent = true;
      return true;
    }
    return false;
  }

  function sendVideoICE(candidate) {
    socket.emit('candidate', candidate);
  }

  function waitNext() {
    currentPartner = false;
    isWaiting = true;
  }

  function isValidPartner(partner) {
    // console.log("checking if valid partner");
    if (partner.id !== socket.id && partner.isWaiting()) {
      const partnerInfo = partner.getchatInfo();
      // if (partnerInfo.op === chatInfo.op) { // do not connect helpers with helpers and vice versa 
      //   return false;
      // }

      let isReturningPartner = !!partnersMap[partner.id];
      if (isReturningPartner) {
        let now = Math.floor(Date.now() / 1000);
        let timeSinceLastChat = (now - partnersMap[partner.id].lastChatTimestamp);
        // if timeSinceLastChat > 5 minutes
        return (timeSinceLastChat > 300);
      } return true;
    } return false;
  }
}
