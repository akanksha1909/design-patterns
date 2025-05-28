require('dotenv').config();

const express = require('express');
const { getNextId } = require('./redisClient');
const { insertUrl } = require('./db');
const { encode } = require('./base62');

const app = express();
app.use(express.json());

app.post('/urls', async (req, res) => {
  try {
    const { long_url } = req.body;

    if (!long_url) {
      return res.status(400).send('Missing URL');
    }

    const id = await getNextId();

    const shortCode = encode(id);

    await insertUrl(id, shortCode, long_url);

    res.send({ short_url: `http://localhost/${shortCode}` });

  } catch (error) {
    console.log('Error in POST /urls:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(8001);