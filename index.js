require('dotenv').config({ path: "sample.env" });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

let dataUrl = [];

//POST
app.post("/api/shorturl/new", (req, res) => {

  const getHostnameFromRegex = (url) => {
    const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    return matches && matches[1];
  }

  hostname = getHostnameFromRegex(req.body.url);
  console.log("Hostname: " + hostname);

  if (!hostname) res.json({ error: 'invalid url' })

  dns.lookup(hostname, (error, addresses) => {
    console.error(error);
    console.log(addresses);

    if (!error) {
      let newUrl = { original_url: req.body.url, short_url: dataUrl.length + 1 }
      dataUrl.push(newUrl);
      res.json(newUrl);
    } else {
      res.json({ error: 'invalid url' });
    }
  })
})

// GET
app.get('/api/shorturl/:num', (req, res) => {

  for (let i = 0; i < dataUrl.length; i++) {
    console.log(dataUrl[i].original_url);
    if (dataUrl[i].short_url == req.params.num) {
      res.redirect(dataUrl[i].original_url);
    }
  }

})

app.listen(port, function () {
  console.log(`Listening on port http://localhost:${port}`);
});
