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

app.get('/one', async (req,res) => {
    res.render('form_one');
});

app.get('/two', async (req,res) => {
    res.render('form_two');
});

app.get('/picture.png', (req,res) => {
    res.sendFile(__dirname + '/picture.png');
})

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
    if(req.body.method == 'CGM')
    {
        data = methods.cgm(req.body);
    }
    if(req.body.method == 'NSA')
    {
        data = methods.nsa(req.body);
    }

    res.json(data);
});


app.listen(4321, () => {
    console.log('LABA IS READY TO GO');
});