const express = require('express')

const app = express()
app.use(express.static(__dirname + '/static'))

const https = require('https')
const fs = require('fs')
https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/uriegel.de/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/uriegel.de/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/uriegel.de/chain.pem')
    }, app).listen(443, () => console.log('Listening...'))

const insecureApp = express()
insecureApp.use((req, res) => res.redirect("https://" + req.headers.host + req.url))
//insecureApp.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))
const http = require('http')
http.createServer(insecureApp).listen(80, () => {
    console.log('Listening...')
})
