const express = require('express');
const fs = require("fs");
const https = require('https');
const axios = require('axios');
const qs = require('qs');
const btoa = require('btoa');
const { buffer } = require('stream/consumers');

const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");


const app = express();


//Sends the HTML File from the Views folder.
app.get('/', (req, res) => {
    res.sendFile('views/index.html', { root: __dirname })
});

app.get('/item', (req, res) => {
    res.sendFile('views/test.html', { root: __dirname })
});

app.get("/login/ebay", (req, res) => {
    //Change this URL with the relevant items. CLient ID and URI etc...
    res.redirect(`https://auth.sandbox.ebay.com/oauth2/authorize?client_id= *****CHANGE ME ******* &redirect_uri= *****CHANGE ME ******* &response_type=code`);
});

app.get("/auth/ebay/callback", (req, res) => {
    axios("https://api.sandbox.ebay.com/identity/v1/oauth2/token", {
            method: "post",
            scope: 'https://api.ebay.com/oauth/api_scope',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " +
                    btoa(
                        ` *****CHANGE ME ******* PUT IN YOUR CLIENT-ID ` + `:` + ` *****CHANGE ME ******* PUT IN YOUR CLIENT-SECRET `
                    )
            },
            data: qs.stringify({
                grant_type: "authorization_code",
                // parsed from redirect URI after returning from eBay,
                code: req.query.code,
                // this is set in your dev account, also called RuName

                redirect_uri: "*****CHANGE ME *******"
            })
        })
        .then(response => console.log(response))
        .catch(err => console.log(err));
});;



//Port setting for Local Host
https.createServer({ key, cert }, app).listen(3001);
