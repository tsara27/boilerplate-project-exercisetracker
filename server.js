const routes = require("./routes/index.js");
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(routes);
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
