const express = require('express');
const bodyParser = require('body-parser');

const cookie = require('cookie-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const mongoose = require('mongoose');
const http = require('http');
const https = require('https');
//const io = require('socket.io')(http);

const jwt = require('jsonwebtoken');
const config = require('./config.json');
const jwt_decode = require('jwt-decode');
//Define when true when test on localhost
const isTest = false;

//database
mongoose.connect(config.mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

if (!isTest) {
    app.use(function (req, res, next) {
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            // request was via http, so redirect to https
            res.redirect('https://' + req.headers.host + req.url);
        }
    });
}

const isNotOnSession = (req, res, next) => {
    jwt.verify(req.cookies['ogrong-sesion'], config.secret, function (err, decoded) {
        if (err) {
            next()
        } else {
            return res.redirect('/');
        }
    });
}
const isSameUser = (req, res, next) => {
    let token = req.cookies['ogrong-sesion'];
    if (token) {
        let decoded = jwt_decode(token);
        if (req.params.user == decoded.username) {
            return res.redirect('/profile');
        } else {
            next();
        }
    }
    else {
        next();
    }
}
const isLogin = (req, res, next) => {
    jwt.verify(req.cookies['ogrong-sesion'], config.secret, function (err, decoded) {
        if (err) {
            return res.redirect('/login');
        } else {
            next();
        }
    });
}

app.get('/', function (req, res) {
    //res.render('index.ejs');
    res.sendFile(__dirname + '/chat.html');
});

app.get('/home', function (req, res) {
    res.render('home.ejs');
})

app.get('/chat', function (req, res) {
    res.sendFile(__dirname + '/chat.html');
})
app.use('/public', express.static('public'));

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

//index rount
app.get('/register', isNotOnSession, function (req, res) {
    res.render('register.ejs', { email: req.query.email, message: req.query.message });
});

app.get('/login', isNotOnSession, function (req, res) {
    res.render('login.ejs', { email: req.query.email, message: req.query.message });
});

app.get('/logout', function (req, res) {
    res.clearCookie('ogrong-sesion');
    res.redirect('/login');
})
const userData = require('./routes/userdata');
app.use('/user', userData);

app.get('/profile/:user', isSameUser, function (req, res) {
    let username = req.params.user;
    res.sendFile(__dirname + '/profile.html');
})
app.get('/profile', isLogin, function (req, res) {
    res.sendFile(__dirname + '/iProfile.html');
})


//listen on port 80
var httpServer = http.createServer(app);
httpServer.listen(80);

// when test off use https 
if (!isTest) {

    app.use(cookieSession(
        {
            secret: config.secret,
            httpOnly: true,  // Don't let browser javascript access cookies.
            secure: true, // Only use cookies over https.
            ephemeral: true, //remove when close browser
            domain: config.domain
        })
    );

    const credentials = {
        key: require('fs').readFileSync('./certificates/privkey.pem')
        , cert: require('fs').readFileSync('./certificates/fullchain.pem')
    }
    //listen on port 443
    var httpsServer = https.createServer(credentials, app);
    var io = require('socket.io')(httpsServer);
    httpsServer.listen(443);

}
//chat
/*
io.use((socket, next) => {
    if (socket.request.headers.cookie) {
        next();
    } else {
        next(new Error("invalid"));
    }
});
*/
io.on('connection', (s) => {
    var cookie_string = s.request.headers.cookie;
    //var parsed_cookies = connect.utils.parseCookie(cookie_string);
    console.log(cookie_string)
    setTimeout(() => {
        s.emit('testerEvent', {
            description: 'jame'
        })
    }, 4000)
    s.on('toppic', function (toppic) {
        console.log(toppic);
        io.sockets.emit('broadcast', {
            username: toppic.username,
            bToppic: toppic.toppic
        })
    });
    s.on('disconnect', () => { });
})