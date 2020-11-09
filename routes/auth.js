const express = require('express')
const router = express.Router();

const User = require('../models/User');

router.post('/signup', function (req, res) {

    var newUser = new User(req.body);
    newUser.save(function(err,data){
        if(err){
            return res.render('register.ejs', {message: 55})
        }else{
            return res.render('index.ejs', { newUser })
        }
    })
  });

router.post('/signin',function(req,res){
    User.findOne({'email':req.body.email,'password':req.body.password},function(err,data){
        if(err){
            res.render('login.ejs', { message: err})
        }else if(data){
            res.render('index.ejs', { message: data });
        }else {
            res.render('login.ejs', { message: 'Email or Password incorrect' })
        }
    })
});  

module.exports = router;