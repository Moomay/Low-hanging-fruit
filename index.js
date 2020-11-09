const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.set('view engine','ejs');
mongoose.connect('mongodb://localhost:27017/applogin', {useNewUrlParser: true});

var userSchema     = mongoose.Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String}
});

mongoose.model('User', userSchema);

var  User =  mongoose.model('User');
app.get('/login', function(req, res){
    res.render('login.ejs');
});
app.get('/register', function(req, res){
    res.render('register.ejs');
});
app.post('/signup', function (req, res) {

    var newUser = new User(req.body);
    newUser.save(function(err,data){
        if(err){
            res.send(err);
        }else{
            res.send('User Registered');
        }
    })
  });

  app.post('/signin',function(req,res){
    User.findOne({'email':req.body.email,'password':req.body.password},function(err,data){
        if(err){
            res.send(err);
        }else if(data){
            res.send('User Login Successful');
        }else {
            res.send('Wrong Username Password Combination');
        }
    })
});  
app.listen(8080)