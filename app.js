const express = require('express');
const http = require('http');

const app = express()
  .use(express.static('build/dist'));

app.set('port', 8080);

http.Server(app)
    .listen(8080)
    .on('listening', () => {
      console.debug('Listening on ' + 8080);
    });

