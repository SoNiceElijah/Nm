const { parse, eval } = require('expression-eval');

module.exports = SOR;

function SOR(ctx)
{    
    let {
        func, 
        m1, 
        m2, 
        m3, 
        m4, 
        a, 
        b, 
        c, 
        d, 
        n, 
        m, 
        eps, 
        max
    } = ctx;

    a = parseFloat(a);
    b = parseFloat(b);
    c = parseFloat(c);
    d = parseFloat(d);

    n = parseInt(n);
    m = parseInt(m);

    eps = parseFloat(eps);
    max = parseFloat(max);

    let xarr = [];
    let yarr = [];

    //Array
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

    let am1 = parse(m1);
    let am2 = parse(m2);
    let am3 = parse(m3);
    let am4 = parse(m4);

    let k = (d - b) / m;
    for(let j = 0; j < m + 1; ++j)
    {
        v[0][j] = eval(am1, {x : a, y : j * k + b, Math});
        v[n][j] = eval(am3, {x : c, y : j * k + b, Math});
        
        yarr.push(j * k + b);
    }

    let h = (c - a) / n;
    for(let i = 0; i < n + 1; ++i)
    {
        v[i][0] = eval(am2, {x : i * h + a, y : b, Math});
        v[i][m] = eval(am4, {x : i * h + a, y : d, Math});

        xarr.push(i * h + a);
    }

    let w = 1.88178350347058;

    let k2 = -1.0 / (k*k);
    let h2 = -1.0 / (h*h);
    let a2 = -2.0 * (h2 + k2);

    let mEps = 100;
    let num = 0;
    let af = parse(func);
    while(num < max && mEps > eps)
    {
        mEps = 0;
        for(let j = 1; j < m; ++j)
        {
            for(let i = 1; i < n; ++i)
            {
                let prev = v[i][j];

                let f = eval(af,{x : a + i * h, y : b + j * k, Math});
                v[i][j] = - w * (h2 * (v[i + 1][j] + v[i - 1][j]) + k2 * (v[i][j + 1] + v[i][j - 1]));
                v[i][j] = v[i][j] + (1 - w)* a2 * prev + w *f;
                v[i][j] = v[i][j] / a2;

                let cEps = Math.abs(v[i][j] - prev);
                if(mEps < cEps)
                    mEps = cEps
            }
        }

        ++num;
    }

    

    return {
        stat: {
            num : { name : "Количество итераций", val : num},
            eps : { name : "Достигнутая точность", val : mEps}
        },
        chart : {
            x : xarr,
            y : yarr,
            z : v,
            type : 'surface'
        }
    }

}

