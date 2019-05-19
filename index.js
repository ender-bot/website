
// COPYRIGHT 2019
// EnderDev & GamingGeek
// Made with Express and Pug with <3 

const express = require("express");
const log = require("./utilities/log");
const path = require("path");
const favicon = require('serve-favicon');
const p = require("phin");
const client_secret = require("./utilities/secret.json").secret;
const {wrapAsync} = require('@rimiti/express-async');
const cookieParser = require('cookie-parser')

const app = express()
const port = 60001;
app.use(cookieParser())
  
app.get('/', wrapAsync(async function serveMe(req, res) {
    var cookie = req.cookies;
    const resp = await p({
        url: 'https://discordapp.com/api/users/@me',
        parse: 'json',
        headers: {
            "Authorization": `Bearer ${cookie.auth}`
        }
    });
    const render = {
        oauth: {
            username: "User",
            discriminator: "0000",
            password: "@",
            avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
            id: "0"
        },
        favicon: 'i/favicon.ico'
    };
    render.oauth.username = resp.body.username
    render.oauth.discriminator = resp.body.discriminator
    render.oauth.id = resp.body.id
    if(resp.body.avatar) {
        render.oauth.avatar = `https://cdn.discordapp.com/avatars/${resp.body.id}/${resp.body.avatar}.png?size=1024`
    }
    res.render("home.pug", render)
}));


app.get("/login", wrapAsync(async function yeet(req, res) {
    var code = req.query.code;
    var data = { 
        client_id: '579661562688700417', 
        client_secret, 
        grant_type: 'authorization_code', 
        code, 
        redirect_uri: 'http://localhost:60001/login', 
        scope: 'identify guilds' 
    }
    const resp = await p({
        url: 'https://discordapp.com/api/oauth2/token',
        method: 'POST',
        form: data,
        parse: 'json'
    });
    if(resp.body.error) {
        res.json(resp.body)
    }
    else {
        res.send(resp.body)
    }
    console.log(resp.body)
    
}));

app.get("/add", (req, res) => {
    res.redirect("https://discordapp.com/oauth2/authorize?client_id=371685425351229441&scope=bot&permissions=536341759&response_type=code&redirect_uri=https%3A%2F%2Fbot.ender.site%2Fthanks")
});
    
app.get('/i/:file', (req, res) => {
    res.sendFile(__dirname+'\\views\\i\\'+req.params.file, { }, function(err) {
        if(err) {
            return res.send("Not found")
        }
    })
});

app.disable('x-powered-by');

app.listen(port, () => {
    log("info", `Server has been loaded to port ${port}`)
})
