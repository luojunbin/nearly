const fs = require('fs');
const express = require('express');

const PORT = 8082;

let bundle = require('./dist/bundle');

let app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/', async function (req, res) {
  let file = fs.readFileSync('./index.html', 'utf8');
  let {data, html} = await bundle.renderServerApp();

  console.log(html);

  res.send(
    file
      .replace('{__GRAX_STATE__}', JSON.stringify(data))
      .replace('{html}', html)
  );
});

app.listen(PORT, () => console.log(`server run in http://localhost:${PORT}`));
