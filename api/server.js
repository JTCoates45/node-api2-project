// implement your server here
// require your posts router and connect it here
const express = require('express');
const postsRouter = require('./posts/posts-router');

const server = express();
server.use(express.json());

//this is putting the base endpoint as '/api/posts, so that doesn't need to be in our routes. '/' is the base in routes.
server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
  res.send(`
      <h2>Posts API</h>
      <p>This is the posts API, please use accordingly.</p>
    `);
});

module.exports = server;