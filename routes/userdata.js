
const express = require('express');
const router = express.Router()

const cookieParser = require('cookie-parser');
const jwt_decode = require('jwt-decode');

router.get('/me', function(req, res){
    let token = req.cookies['ogrong-sesion'];
    if (!token){
        res.sendStatus(403);
    } else{
        var decoded = jwt_decode(token);
        res.json(decoded);
    }
});

module.exports = router;
