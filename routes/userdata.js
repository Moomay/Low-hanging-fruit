
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const config = require('../config.json');
const User = require('../models/User');
const Profile = require('../models/Profile')
const isOnSession = (req, res ,next) =>{
    jwt.verify(req.cookies['ogrong-sesion'], config.secret, function(err, decoded){
        if (err){
            return res.redirect('/login');
        }else{
            next()
        }
    });
}
router.get('/me', function(req, res){
    let token = req.cookies['ogrong-sesion'];
    if (!token){
        res.sendStatus(403);
    } else{
        var decoded = jwt_decode(token);
        res.json(decoded);
    }
});
router.post('/profile', isOnSession, function(req, res){
    let token = req.cookies['ogrong-sesion'];
    let decoded = jwt_decode(token);
    let profile = req.body.profile.toString();
    let username = decoded.username.toString();
    console.log(decoded.username, profile)
    User.updateOne({"username": decoded.username}, {$set :{"profile": profile}}, (err, data)=>{
        if (err) console.log(err)
    });
    res.redirect('/profile')
    res.end("suscess")
});
router.get('/getprofile', async(req, res) =>{
    let username = req.query.username;
    console.log(username);
    let user = await User.findOne({username: username})
    if (user){
        return res.json({profile: user.profile})
    }else {
        return res.sendStatus(404)
    }
})
module.exports = router;
