const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Provider } = require('oidc-provider');
const path = require('path');
const cookieParser = require("cookie-parser");

const SignupController = require('./controller/signup.controller');

const { Issuer, Strategy } = require('openid-client');
const { SchemaType, SchemaTypes, SchemaTypeOptions } = require('mongoose');

const app = express();

app.use(express.json());

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false, cookie: { maxAge: 1000 * 60 * 60 * 5 } }));

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

const oidc = new Provider('http://localhost:3000', {
    clients: [{
        client_id: "oidcCLIENT",
        client_secret: "Some_super_secret",
    grant_types: ["authorization_code"],
        redirect_uris: ["http://localhost:3000/auth/login/callback", "https://oidcdebugger.com/debug", "http://localhost:3000/login/callback"],
        response_types: ["code",],
    }],
    pkce: { required: () => false, },
});

app.use("/oidc", oidc.callback());

Issuer.discover('http://localhost:3000/oidc')
    .then(function (oidcIssuer) {
        var client = new oidcIssuer.Client({
            client_id: 'oidcCLIENT',
            client_secret: 'Some_super_secret',
            redirect_uris: ["http://localhost:3000/login/callback"],
            response_types: ['code'],

        });
        passport.use('oidc',
            new Strategy({ client, passReqToCallback: true }, (req, tokenSet, userinfo, done) => {
                req.session.tokenSet = tokenSet;
                req.session.userinfo = userinfo;
                return done(null, tokenSet.claims());
            })
        );
    });


app.get('/login', passport.authenticate('oidc', { scope: "openid" }));

app.get('/login/callback', (req, res, next) => {
    passport.authenticate('oidc', {
        successRedirect: '/user',
        failureRedirect: '/'
    })(req, res, next)
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get("/user", (req, res) => {
    res.header("Content-Type", 'application/json');
    console.log(req.session);
    res.end(JSON.stringify({ tokenset: req.session.tokenSet, userinfo: req.session.userinfo }, null, 2));
});

app.get('/signup', SignupController.signupForm);
app.post('/signup', SignupController.signup);

app.listen(3000, function () {
    console.log('Your node js server is running on PORT:', 3000);
});
