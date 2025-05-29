require('dotenv').config();

const express = require('express');
const { getCachedUrl, cacheUrl } = require('./redisClient');
const { getUrl } = require('./db');

const app = express();

app.get('/urls/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  let longUrl = await getCachedUrl(shortCode);
  if (!longUrl) {
    longUrl = await getUrl(shortCode);
    if (!longUrl) return res.status(404).send('Not found');
    await cacheUrl(shortCode, longUrl);
  }
  res.send({ long_url: longUrl });
});

app.listen(8002);