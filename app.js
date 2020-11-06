const express = require('express');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const app = express();

app.use(cookie());

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');// set view

app.get('/', function(req, res) {
    res.render('index.ejs')
});
app.get('/login', function(req, res){
    res.sendFile(__dirname+"/"+"loginForm.html");
});

app.post('/auth', function(req, res){
    data = {
        username: req.body.user,
        password: req.body.password
    };
    console.log(data);
    res.end(JSON.stringify(data));

});
//app.post()
app.listen(80)