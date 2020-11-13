const bodyParser = require('body-parser');
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/User');
const config = require('../config.json')
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    const email = req.body.email
    if (req.body.username == '' || req.body.password == '' || req.body.email == ''){
        let emailEn = encodeURIComponent(email);
        return res.redirect('/register?email='+emailEn+'&message=กรอกข้อมูลให้ครบ');
    }
    const passhash = crypto.createHash('md5').update(req.body.password).digest('hex');
    let emailIsUse = await User.findOne({
        email: req.body.email
    })
    let usernameIsUse = await User.findOne({
        username: req.body.username
    })
    if (emailIsUse || usernameIsUse){
        return res.redirect('/register?message=ชื่อผู้ใช้หรืออีเมล์ซ้ำ')
    }
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        //password: req.body.password
        password: passhash,
        profile: ""
    });
    

    newUser.save(function(err,data){
        if(err){
            let emailEn = encodeURIComponent(email);
            return res.redirect('/register?email='+emailEn+'&message=บางอย่างผิดพลาด');
        }else{
            let token = jwt.sign({username:req.body.username}, config.secret);
            res.cookie('ogrong-sesion', token);
            return res.redirect('/');
        }
    });
    
});

router.post('/signin',async (req,res) => {
    const {email, password} = req.body;
    if (!email || !password){
        return res.render('login', {message: 'โปรดกรอกข้อมูลให้ครบ'})
    }
    let user = await User.findOne({
        email:req.body.email,
        password: req.body.password
    })
    /*
    if (user){
        let token = jwt.sign({username: user.username}, config.secret);
            res.cookie('ogrong-sesion', token);
            return res.redirect('/');
    }else{
        return res.render('login', {message: 'อีเมล์หรือชื่อผู้ใช้ไม่ถูกต้อง'})
    }*/
    if (user){
        let passhash = crypto.createHash('md5').update(password).digest('hex')
        const isCorrect = (user.password == passhash);
        if (isCorrect) {
            let token = jwt.sign({username: user.username}, config.secret);
            res.cookie('ogrong-sesion', token);
            return res.redirect('/');
        }
        else {
            let emailEn = encodeURIComponent(email);
            return res.redirect('/login?email='+emailEn+'&message=อีเมล์หรือชื่อผู้ใช้ไม่ถูกต้อง');
            //return res.render('login', {message: 'อีเมล์หรือชื่อผู้ใช้ไม่ถูกต้อง'})
        }
    }
    else {
        var string = encodeURIComponent(email);
        return res.redirect('/login?email='+string+'&message=ไม่พบอีเมล์ของท่าน');
        //return res.render('login', {message: 'ไม่พบอีเมล์ของท่าน'})
    }
});

router.get('/verify', function(req, res){
    jwt.verify(req.cookies['ogrong-sesion'], config.secret, function(err, decoded){
        if (err){
            res.sendStatus(403)
        }else{
            res.send(decoded.username);
        }
    });
})
module.exports = router;