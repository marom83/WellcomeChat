const cluster = require('cluster');
const express = require('express');
const app = express();
const numCPUs = require('os').cpus().length;

const port = 3000;

const uuidv1 = require('uuid/v1');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
    console.log(`Worker ${process.pid} is starting.`);  

  // this is only a test, remove it later
  if (cluster.worker.id === 2) {
    throw "An error thrown from a worker!";
  }

  cluster.worker.id = uuidv1();

  app.use((req, res) => {
    res.status(200).json({
      ua: req.headers['user-agent'],
      ip: req.connection.remoteAddress,
      uuid: cluster.worker.id
    });
  });

  app.listen(port);

  console.log(`Worker ${process.pid} started with id ${cluster.worker.id}`);
}