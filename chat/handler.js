'use strict';
module.exports = chatHandler;

const _ = require('lodash');
const Client = require('./client');

function chatHandler() {

  let clientList  = [];
  let waitingList = [];
  let io;

  return {init};

  function init(_io, app) {
    io = _io;
    io.on('connection', onConnect);
    app.use(appConfigs);
    app.disable('x-powered-by');
    app.post('/info', getServerInfo);
    setInterval(refreshConsole, 5000);
  }

  function appConfigs(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
              'Origin, X-Requested-With, Content-Type, Accept');
    next();
  }

  function getServerInfo(req, res) {
    res.json({usersOnline: clientList.length});
  }

  function refreshConsole() {
    process.stdout.write(`Clients:  ${clientList.length} | Waiting: ${waitingList.length} \r`);
  }

  function onConnect(socket) {
    let client = new Client(socket);

    socket.on('disconnect', () => onDisconnect(client));
    socket.on('next', () => onRequestNext(client));
    socket.on('msg', (msg) => onMessage(client, msg));
    socket.on('info', (info) => onReceiveInfo(client, info));
    socket.on('ready', (res) => onVideoInit(client, res));
    socket.on('offer_ok', (res) => onVideoOfferOK(client, res));
    socket.on('candidate', (candidate) => onVideoICE(client, candidate));
    clientList.push(client);
  }

  function onDisconnect(client) {
    try {
      client.disconnectFromPartner();
      _.remove(clientList, (c) => c.id === client.id);
      _.remove(waitingList, (c) => c.id === client.id);
    } catch (e) {
      console.log('[ERROR] ', e.message);
    }
  }

  function onReceiveInfo(client, info) {
    try {
      client.setchatInfo(info);
    } catch (e) {
      console.log('[ERROR] ', e.message);
    }
  }

  function onVideoICE(client, candidate) {
    try {
      let partner = client.getPartner();
      partner.sendVideoICE(candidate);
    } catch (e) {
      console.log('[ERROR] ', e.message);
    }
  }

  function onMessage(client, msg) {
    client.sendMessageToPartner(msg);
  }

  function onVideoInit(client, res) {
    try {
      if (res) {
        console.log("onVideoInit");
        let partner = client.getPartner();
        partner.sendVideoOffer(res);
      }
    } catch (e) {
      console.log('[ERROR] ', e.message);
    }
  }

  function onVideoOfferOK(client, res) {
    try {
      if (res) {
        let partner = client.getPartner();
        partner.sendVideoOfferResponse(res);
      }
    } catch (e) {
      console.log('[ERROR] ', e.message);
    }
  }

  function sortByPriority(client) {
    let sortedList = [];
    let clientInfo = client.getchatInfo();
    // 1) Opposite OP & same Problem
    for (let c of waitingList) {
      if (c.id != client.id) {
        let cInfo = c.getchatInfo();
        if (cInfo["op"] != clientInfo["op"] && cInfo["problem"] == clientInfo["problem"]) {
          sortedList.push(c)
        } 
      }
    }
    // 2) Opposite OP & any Problem
    for (let c of waitingList) {
      if (c.id != client.id) {
        let cInfo = c.getchatInfo();
        if (cInfo["op"] != clientInfo["op"] && cInfo["problem"] != clientInfo["problem"]) {
          sortedList.push(c)
        } 
      }
    }
    // 3) Same OP & Same Problem
    for (let c of waitingList) {
      if (c.id != client.id) {
        let cInfo = c.getchatInfo();
        if (cInfo["op"] == clientInfo["op"] && cInfo["problem"] == clientInfo["problem"]) {
          sortedList.push(c)
        } 
      }
    }
    // 3) Rest
    for (let c of waitingList) {
      if (c.id != client.id) {
        let cInfo = c.getchatInfo();
        if (cInfo["op"] == clientInfo["op"] && cInfo["problem"] != clientInfo["problem"]) {
          sortedList.push(c)
        } 
      }
    }
    return sortedList;
  }

  function onRequestNext(client) {
    try {
      console.log("Client: ", client.getchatInfo());

      let partner = false;

      client.disconnectFromPartner();
      client.sendSystemInfo('waiting_partner');
      let sortedWaitingList = sortByPriority(client);

      for (let possiblePartner of sortedWaitingList) {
        if (client.isValidPartner(possiblePartner)) {
          partner = possiblePartner;
          break;
        }
      }      

      if (!partner) {
        if (!_.some(waitingList, ['id', client.id])) {
          client.waitNext();
          waitingList.push(client);
        }
      } else {
        _.remove(waitingList, (c) => c.id === client.id || c.id === partner.id);
        client.setPartnerInfo(partner);
        client.requestVideoInit();
        partner.setPartnerInfo(client);
      }
    } catch (e) {
      console.log('[ERROR] ', e.message);
    }
  }
}
