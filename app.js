const express = require('express');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const app = express();
app.use(cookie())
app.set('view engine', 'ejs');// set view
app.get('/', (req, res) => {
    res.render('index.ejs')
});
//app.post()
app.listen(8081)