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
   const zoos = await db('zoos');
   res.status(200).json(zoos);
  } catch (error) {
   res.status(500).json(error);
  }
})

// GET by id
server.get('/api/zoos/:id', async (req, res) => {
  try {
   const zoo = await db('zoos')
    .where({id: req.params.id})
    .first();
   res.status(200).json(zoo);
  } catch (error) {
   res.status(500).json(error);
  }
})

// UPDATE roles
server.put('/api/zoos/:id', async (req, res) => {
  try {
    //updated will get pulled from db by id, then updated
    const updated = await db('zoos')
      .where({id: req.params.id})
      .update(req.body);
      res.status(200).json(updated);
      // if updated is valid, it will have an id number greater than 0
      // the conditional below will check that the data associated with
      // the id exists

      // conditional below still in progress
      // if(updated > 0) {
      //   // if a record exists and is successfully updated, 
      //   // it will return the record with the 200 status
      //   const zoo = await db('zoos')
      //     .where({id: req.params.id})
      //     .first();
      //   res.status(200).json(zoo);
      // } else {
      //   res.status(404).json({message: "Zoo not found"});
      // }


  } catch (error) {
    res.status(500).json({err: "Error updating zoo"});
  }
})

// DELETE zoo
server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos')
      .where({id: req.params.id})
      .del(req.body);
      res.status(200).json(count);
     

      if(count > 0) {
        res.status(204);
      } else {
        res.status(404).json({message: "Zoo not found"});
      }


  } catch (error) {
    res.status(500).json({err: "Error updating zoo"});
  }
})

const port = 5000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
