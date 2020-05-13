const { parse, eval } = require('expression-eval');

module.exports = Index;


function Index(n,m,type,m1,m2,m3,m4,a,b,c,d,h,k)
{
    if(type == 'null')
        return Zero(n,m);
    if(type == 'interpolX')
        return InterpolationX(n,m,m1,m3,a,b,c,d,h,k);
    if(type == 'interpolY')
        return InterpolationY(n,m,m2,m4,a,b,c,d,h,k);
}

function Zero(n,m)
{
    let v = [];
    for(let i = 0; i < n + 1; ++i)
    {
        let line = [];
        for(let j = 0; j < m +1; ++j)
        {
            line.push(0);
        }
        v.push(line);
    }

    return v;
}

function InterpolationX(n,m,m1,m3,a,b,c,d,h,k)
{
    let ma = (y) => eval(m1, {x : a, y : y, Math});
    let mc = (y) => eval(m3, {x : c, y : y, Math});

    let v = [];
    for(let i = 0; i < n + 1; ++i)
    {
        let line = [];
        for(let j = 0; j < m +1; ++j)
        {
            line.push(
                ((a + i *h) - a) / (c - a) * mc(b + j*k) +
                ((a + i *h) - c) / (c - a) * ma(b + j*k)
            );
        }
        v.push(line);
    }

    return v;
} 

function InterpolationY(n,m,m2,m4,a,b,c,d,h,k)
{
    let mb = (x) => eval(m2, {x : x, y : b, Math});
    let md = (x) => eval(m4, {x : x, y : d, Math});

    let v = [];
    for(let i = 0; i < n + 1; ++i)
    {
        let line = [];
        for(let j = 0; j < m +1; ++j)
        {
            line.push(
                ((b + j *k) - b) / (d - b) * md(a + i*h) +
                ((b + j *k) - d) / (d - b) * mb(a + i*h)
            );
        }
        v.push(line);
    }

    return v;
}