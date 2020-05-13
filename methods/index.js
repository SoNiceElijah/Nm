const sor = require('./SOR');
const fpi = require('./FPI');
const cgm = require('./CGM');
const nsa = require('./NSA');

module.exports = {
    sor,
    fpi,
    cgm,
    nsa
}

let x = 0;
let y = 0;
((2*Math.PI*y*Math.exp(Math.pow(Math.sin(Math.PI*x*y),2)) *
((Math.PI*y)*(Math.PI*y)) * 
((Math.pow(Math.sin(2 * Math.PI * x * y),2)) + 2 * Math.cos(2 * Math.PI * x *y)))
+
(2*Math.PI*x*Math.exp(Math.pow(Math.sin(Math.PI*y*x),2)) *
((Math.PI*x)*(Math.PI*x)) * 
((Math.pow(Math.sin(2 * Math.PI * y * x),2)) + 2 * Math.cos(2 * Math.PI * y *x))))                