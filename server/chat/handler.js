'use strict';
module.exports = chatHandler;

const _ = require('lodash');
const Client = require('./client');

function chatHandler() {

  let clientList  = [];
  let waitingList = [];
  let io;

  return {init};

  function init(_io, express) {
    io = _io;
    io.on('connection', onConnet);
    express.use(expressConfigs);
    express.disable('x-powered-by');
    express.get('/', getServerInfo);
    setInterval(refreshConsole, 5000);
  }

  function expressConfigs(req, res, next) {
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

  function onConnet(socket) {
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

  function onRequestNext(client) {
    try {
      let partner = false;
      // console.log("Finding a new partner");

      client.disconnectFromPartner();
      client.sendSystemInfo('waiting_partner');

      for (let possiblePartner of waitingList) {
        if (client.isValidPartner(possiblePartner)) {
          partner = possiblePartner;
          break;
        }
      }

      // console.log("Partner", partner);

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
