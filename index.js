const express = require('express')
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const cors = require('cors')
const util = require('util')
const db = require('./db')
const http = require('http')
const favicon = require('serve-favicon')
const fs = require('fs')
const path = require('path')

const readDir = util.promisify(fs.readdir)

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy((username, password, cb) => {
    db.users.findByUsername(username, async (err, user) => {
        if (err) return cb(err) 
        if (!user) return cb(null, false) 
        if (!await bcrypt.compare(password, user.password)) 
            return cb(null, false) 
        return cb(null, user)
    })
}))

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => cb(null, user.id))
  
passport.deserializeUser((id, cb) => {
    db.users.findById(id, (err, user) => {
        if (err) return cb(err) 
        cb(null, user)
    })
})

const app = express()

app.use(favicon(path.join(__dirname, 'public', 'favicon.jpg')))

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => res.render('login'))
  
app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/'))
  
app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

const auth = require('connect-ensure-login').ensureLoggedIn()

//app.get('/images', auth, (req, res) => {
app.get('/images', auth, cors(), async (req, res) => {
    const  files = await readDir(path.join(__dirname, 'public', 'images'))
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(files))
})

app.get('/index', auth, cors(), async (req, res) => {
    const targets = [{
        title: "Spaziergang mit Roxy",
        url: "roxy",
        imageUrl: "indexes/roxy"
    },
    {
        title: "Feier",
        url: "celebration",
        imageUrl: "indexes/celebration"
    }]
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(targets))
})

app.use('/public', express.static('public'))
app.use("/", [auth, express.static(__dirname + '/dist/ImageViewer', { dotfiles: 'allow' })])

http.createServer(app).listen(8080, 'localhost', () => {
    console.log('Listening...')
})
    
// 
// https.createServer({
//          key: fs.readFileSync('/etc/letsencrypt/live/uriegel.de/privkey.pem'),
//          cert: fs.readFileSync('/etc/letsencrypt/live/uriegel.de/cert.pem'),
//          ca: fs.readFileSync('/etc/letsencrypt/live/uriegel.de/chain.pem')
//      }, app).listen(443, () => console.log('Listening 443...'))

// const insecureApp = express()
// insecureApp.use((req, res) => res.redirect("https://" + req.headers.host + req.url))
//insecureApp.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))
// const http = require('http')
// http.createServer(insecureApp).listen(80, () => {
//     console.log('Listening...')
// })
