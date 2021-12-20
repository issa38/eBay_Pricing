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
    res.redirect(`https://auth.sandbox.ebay.com/oauth2/authorize?client_id=IsaiahMo-PricingA-SBX-a7e95348f-859bfa14&redirect_uri=Isaiah_Moragn-IsaiahMo-Pricin-olkmpcwzh&response_type=code`);
});

app.get("/auth/ebay/callback", (req, res) => {
    axios("https://api.sandbox.ebay.com/identity/v1/oauth2/token", {
            method: "post",
            scope: 'https://api.ebay.com/oauth/api_scope',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " +
                    btoa(
                        `IsaiahMo-PricingA-SBX-a7e95348f-859bfa14` + `:` + `SBX-7e95348f5fb8-9289-4276-8ec4-34e6`
                    )
            },
            data: qs.stringify({
                grant_type: "authorization_code",
                // parsed from redirect URI after returning from eBay,
                code: req.query.code,
                // this is set in your dev account, also called RuName

                redirect_uri: "Isaiah_Moragn-IsaiahMo-Pricin-olkmpcwzh"
            })
        })
        .then(response => console.log(response))
        .catch(err => console.log(err));
});;



//Port setting for Local Host
https.createServer({ key, cert }, app).listen(3001);