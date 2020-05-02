const express = require('express');
const app = express();

const bp = require('body-parser');
const methods = require('./methods/index');

app.set('views','form');
app.set('view engine','pug');

app.use(bp.urlencoded());

app.get('/', async (req,res) => {
    res.render('form');
});

app.post('/run', async (req,res) => {

    let data = {};
    if(req.body.method == 'SOR')
    {
        data = methods.sor(req.body);
    }
    if(req.body.method == 'FPI')
    {
        data = methods.fpi(req.body);
    }

    res.json(data);
});


app.listen(4321, () => {
    console.log('LABA IS READY TO GO');
});