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
    //you MUST set your scope here as well for accurate AUTH tokens. Read the Documentation for your RESTAPI to find what the scopes are for it.
    res.redirect(`https://auth.sandbox.ebay.com/oauth2/authorize?client_id= *****CHANGE ME ******* &redirect_uri= *****CHANGE ME ******* &response_type=code&scope=*****CHANGE ME *******`);
});

app.get("/auth/ebay/callback", (req, res) => {
    axios("https://api.sandbox.ebay.com/identity/v1/oauth2/token", {
            method: "post",
            //I am setting the scope again here as well. Just to reenforce that the headers transfer
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

app.get('/product', (req, res) => {
    //This is the API that you are using. In this example I am using the BROWSE API from eBay.
    axios.get('https://api.ebay.com/buy/browse/v1/item_summary/search?q=drone&limit=3', {
        //Depending on your API the method may be different. If you are acquiring data then its probably a GET Request. If you are posting a listing then its probably a POST request.
            method: 'GET',
            headers: {
                //You will most likely change most of these here besides the Authorization header. Read your API Doc for what you want to do.
                Authorization: "Bearer " + " THIS IS WHERE YOU PUT YOUR oAUTH TOKEN. MAKE SURE IT IS MADE THROUGH oAUTH AND NOT THROUGH Auth'n'Auth "
                "Content-Type": "application/json",
                "RESPONSE-DATA-FORMAT": "JSON",
                "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
                "X-EBAY-C-ENDUSERCTX": "affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>"
            }
        })
        //This returns the JSON data for what it is looking up. This took me days to figure out how to get the API to send me a response object but itll be easy for you :P
        .then(response => console.log(response.data))
        .catch(err => console.log(err))
});




//Port setting for Local Host
https.createServer({ key, cert }, app).listen(3001);
