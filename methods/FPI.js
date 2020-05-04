const { parse, eval } = require('expression-eval');
const transpose = require('./transpose');

module.exports = interface;

function interface(ctx)
{
    if(ctx.type == 'test')
    {
        ctx.func = '-(' + ctx.func + ')';
        let r = FPI(ctx);

        let n = parseInt(ctx.n);
        let m = parseInt(ctx.m);

        let af = parse(ctx.real);
        let max = -100;
        for(let i = 1; i < m; ++i)
        {
            for(let j = 1; j < n; ++j)
            {
                let f = eval(af,{x : r.chart.x[j],y : r.chart.y[i], Math})
                max = Math.max(max, Math.abs(f - r.chart.z[i][j]));
            }
        }

        r.stat['norm'] = { name : "|v - u|", val : max.toExponential(3) };
        return r;
    }        
    else
    {
        let r1 = FPI(ctx);

        let n = parseInt(ctx.n);
        let m = parseInt(ctx.m);

        ctx.n = n*2 + '';
        ctx.m = m*2 + '';

        let r2 = FPI(ctx);

        let max = -100;
        for(let i = 1; i < m; ++i)
        {
            for(let j = 1; j < n; ++j)
            {
                max = Math.max(max, Math.abs(r2.chart.z[i*2][j*2] - r1.chart.z[i][j]));
            }
        }

        r1.stat['norm'] = { name : "|v2 - v|", val : max.toExponential(3) };
        return r1;
    }
}

function FPI(ctx)
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
        max,
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

    let t = parseFloat(ctx.t);
    if(t == 0)
    {
        t = getOptimalT(h,k,n,m);
    }
   

    let k2 = -1.0 / (k*k);
    let h2 = -1.0 / (h*h);
    let a2 = -2.0 * (h2 + k2);

    let mEps = 100;
    let num = 0;
    let af = parse(func);
    while(num < max && mEps > eps)
    {
        mEps = 0;

        let r = [];
        for(let i = 1; i < n; ++i)
        {
            let line = [];
            for(let j = 1; j < m; ++j)
            {
                let f = eval(af,{x : a + i * h, y : b + j * k, Math});
                let num = a2 * v[i][j] + h2 * (v[i-1][j] + v[i+1][j]) + k2 * (v[i][j-1] + v[i][j+1]) + f;
                line.push(num);
            }

            r.push(line);
        }

        for(let j = 1; j < m; ++j)
        {
            for(let i = 1; i < n; ++i)
            {
                let prev = v[i][j];
                v[i][j] = prev - t * r[i-1][j-1];                

                let cEps = Math.abs(v[i][j] - prev);
                mEps = Math.max(cEps,mEps);                
            }
        }

        ++num;
    }

    let diff = -100;
    for(let i = 1; i < n; ++i)
    {
        for(let j = 1; j < m; ++j)
        {
            let f = eval(af,{x : a + i * h, y : b + j * k, Math});
            let left = (h2 * (v[i + 1][j] + v[i - 1][j]) + k2 * (v[i][j + 1] + v[i][j - 1]));
            left += a2 * (v[i][j]);
            diff = Math.max(diff, Math.abs(f - left));
        }
    }

    v = transpose(v);

    return {
        stat: {
            num : { name : "Количество итераций", val : num},
            eps : { name : "Достигнутая точность", val : mEps.toExponential(3)},
            t : {name : "Параметр t", val : t},
        },
        chart : {
            x : xarr,
            y : yarr,
            z : v,
            type : 'surface',
        },
        info : {
            diff
        }
    }

}

function getOptimalT(h,k,n,m)
{
    let lmin = 4.0 / (h*h) * Math.sin(Math.PI / (2 * n)) * Math.sin(Math.PI / (2 * n)) +
        4.0 / (k*k) * Math.sin(Math.PI / (2*m)) * Math.sin(Math.PI / (2*m));

    let lmax = 4.0 / (h*h) * Math.sin(Math.PI * (n-1)/(2*n))* Math.sin(Math.PI * (n-1)/(2*n)) +
        4.0 / (k*k) * Math.sin(Math.PI * (m-1)/(2*m))* Math.sin(Math.PI * (m-1)/(2*m));
    
    return 2.0 / (lmin + lmax);
}
