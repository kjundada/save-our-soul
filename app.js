'use strict';
const express = require('express');
const http = require('http');
const config = require('./config');
const chatHandler = require('./chat/handler')();
const morgan = require('morgan');
const io = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || config.port;
// const HOST = process.env.HOST || config.host;
const app = express();

app.use(morgan('dev'));


console.log("Running in", process.env.NODE_ENV);

app.use(express.static( 'build' ));
app.use('/static', express.static(path.join(__dirname, 'build')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html')); 
});


const server = http.createServer(app);


chatHandler.init(io(server), app);

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`) //http://${HOST}:
});
