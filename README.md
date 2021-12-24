# eBay_Pricing oAuth

Ebay Authentication uses oAuth. This code is what I used to generate an Authentication token for a eBay developer account for the use of APIs

**EBAY USES HTTPS FOR THEIR SERVERS WITH oAUTH. YOU MUST HOST YOUR LOCALHOST SERVER ON A HTTPS SERVER**

this is why if you look at my code that creates the express server at the bottom of the app.js file it looks weird. 

> Axios is not the best method for this code but it works. It is a rudamentary fix and could be changed out for Express code that is much more reliable and stronger but with Axios you can easily change headers.

The section dealing with headers in the ```app.get('/product') ``` section is what you will have to pay the most attention to. It is very dependent on the API you are using. Pay specific attention to ```X-EBAY-C-MARKETPLACE-ID: 'EBAY_--' ``` as it is very dependent on where you are working from

