const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: { filename: './data/lambda.sqlite3' },
  useNullAsDefault: true // this is needed for sqlite
}
const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

// POST endpoint
server.post('/api/zoos',  (req, res) => {
  const newZoo = req.body;

  if (newZoo) {
    db.insert(newZoo)
    .into('zoos')
    .then(ids => {
      res.status(200).json(ids[0]);
    })
    .catch(err => {
      res.status(500).json(err);
    })
  } else {
    res.status(500).json({err: "Please provide name of zoo"});
  }
  
})

// GET all endpoint
server.get('/api/zoos', async (req, res) => {
  try {
   const zoos = await db(zoos);
   res.status(200).json(zoos);
  } catch (error) {
   res.status(500).json(error);
  }
})



const port = 5000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
