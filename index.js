
// COPYRIGHT 2019
// EnderDev & GamingGeek
// Made with Express and Pug with <3 

const express = require("express");
const log = require("./utilities/log");
const path = require("path");
const favicon = require('serve-favicon');
const phin = require("phin");
const client_secret = require("./utilities/secret.json").secret;

const app = express()
const port = 60001;
  
app.get('/', (req, res) => {
    res.render("home.pug", { oauth: { username: "Test", password: "Test", avatar: "https://cdn.discordapp.com/avatars/371685425351229441/82967dd71e6583754d573305464fc556.png?size=1024" }, favicon: 'i/favicon.ico' })
});

app.get("/login", async, (req, res) => {
    var code = req.query.code;
    var data = { 
        client_id: '579661562688700417', 
        client_secret, 
        grant_type: 'authorization_code', 
        code, 
        redirect_uri: 'https://localhost:60001/login', 
        scope: 'identify guilds' 
    }
    const resp = await p({
        url: 'https://discordapp.com/api/oauth2/token',
        method: 'POST',
        data
    });
    res.redirect(`/login?resp=${resp.access_token}`)
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
