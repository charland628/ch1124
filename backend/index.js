const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "origin, content-type, accept");
    next();
});

app.get('/getTools', (req, res) => {
    fs.readFile('./json/tools.json', (err, data) => { 
        if (err) throw err; 
        const tools = JSON.parse(data);
        res.json(tools);
    });
});

app.get('/getToolCharges', (req, res) => {
    fs.readFile('./json/toolRentalCharges.json', (err, data) => { 
        if (err) throw err; 
        const charges = JSON.parse(data);
        res.json(charges);
    });
});

app.post('/toolRental', (req, res) => {
    const validToolCode = req.body.toolCode.length > 0;
    const validCheckoutDate = req.body.checkoutDate.length > 0;
    const validReturnDate = req.body.returnDate.length > 0;
    const validDiscountPercent = (0 <= req.body.discountPercent) && (req.body.discountPercent <= 100);
    const validChargeableDays = req.body.chargeableDays >= 0;
    const validDailyCharge = req.body.dailyCharge >= 0;
    const validPrediscountAmount = req.body.prediscountAmount >= 0;
    const validDiscountAmount = req.body.discountAmount >= 0;
    const validFinalAmount = req.body.finalAmount >= 0;

    const dataIsValid = validToolCode &&
        validCheckoutDate &&
        validReturnDate &&
        validDiscountPercent &&
        validChargeableDays &&
        validDailyCharge &&
        validPrediscountAmount &&
        validDiscountAmount &&
        validFinalAmount;
    

    fs.readFile('./json/toolRentalPostResponse.json', (err, data) => { 
        if (err) throw err; 
    
        const status = JSON.parse(data);
        status.success = dataIsValid;
        res.json(status);
    });
});

app.listen(3000, function(req, res) {
    console.log("Server is running at port 3000");
});
