// use Postman(or a browser) to send a GET or POST request onto localhost:3000 and it will respond with this JSON
const express = require('express');
const app = express();

app.use((req, res) => {
  res.status(200).json({
    message: 'It works!'
  });
});

module.exports = app;

