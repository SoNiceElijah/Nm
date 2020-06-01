const { parse, eval } = require('expression-eval');
const transpose = require('./transpose');

const getArray = require('./Fills');

module.exports = interface;

function interface(ctx)
{
    if(ctx.type == 'test')
    {
        ctx.func = '-(' + ctx.func + ')';
        let r = NSA(ctx);

        let n = parseInt(ctx.n);
        let m = parseInt(ctx.m);

        let af = parse(ctx.real);
        let max = -100;

        let superZ = [];
        let normZ = [];

        for(let i = 0; i < m*3+6+1; ++i)
        {
            let lineS = [];
            let lineN = [];

            for(let j = 0; j < n*3+6+1; ++j)
            {
                if(r.chart.z[i][j] == 0)
                {
                    lineS.push(0);
                    lineN.push(0);

                    continue;
                }

                let f = eval(af,{x : r.chart.x[j],y : r.chart.y[i], Math})

                lineS.push(f);
                lineN.push(Math.abs(f - r.chart.z[i][j]));

                max = Math.max(max, Math.abs(f - r.chart.z[i][j]));
            }

            superZ.push(lineS);
            normZ.push(lineN);
        }

        r.stat['norm'] = { name : "|v - u|", val : max.toExponential(3) };
        r.report = {
            c1 : superZ,
            c2 : normZ,
        }
        return r;
    }        
    else
    {
        let r1 = NSA(ctx);

        let n = parseInt(ctx.n);
        let m = parseInt(ctx.m);

        ctx.n = n*2 + '';
        ctx.m = m*2 + '';

        let r2 = NSA(ctx);

        let superZ = [];
        let normZ = [];

        let max = -100;
        for(let i = 0; i < m+1; ++i)
        {
            let lineS = [];
            let lineN = [];

            for(let j = 0; j < n+1; ++j)
            {
                lineS.push(r2.chart.z[i*2][j*2]);
                lineN.push(Math.abs(r2.chart.z[i*2][j*2] - r1.chart.z[i][j]));

                max = Math.max(max, Math.abs(r2.chart.z[i*2][j*2] - r1.chart.z[i][j]));
            }

            superZ.push(lineS);
            normZ.push(lineN);
        }

        r1.stat['norm'] = { name : "|v2 - v|", val : max.toExponential(3) };
        r1.report = {
            c1 : superZ,
            c2 : normZ,
        }
        return r1;
    }
}


function NSA(ctx)
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
        fill
    } = ctx;

    a = parseFloat(a);
    b = parseFloat(b);
    c = parseFloat(c);
    d = parseFloat(d);


    let multn = parseInt(n);
    let multm = parseInt(m);

    m = multm * 3 + 6;
    n = multn * 3 + 6;

    eps = parseFloat(eps);
    max = parseFloat(max);

    let xarr = [];
    let yarr = [];

    let am1 = parse(m1);
    let am2 = parse(m2);
    let am3 = parse(m3);
    let am4 = parse(m4);

    let k = (d - b) / m;
    let h = (c - a) / n;

    let v = getArray(n,m,fill,am1,am2,am3,am4,a,b,c,d,h,k);

    let mask = [];
    for(let i = 0; i < n+1; ++i)
    {
        let line = [];
        for(let j = 0; j < m+1; ++j)
            line.push(true);
        
        mask.push(line);
    }

    for(let j = 2 + multm * 1; j <  4 + multm * 2 + 1; ++j)
        for(let i = 2 + multn *1; i < 4 + multn*2 + 1; ++i)
            mask[i][j] = false;

    for(let j = 0; j < m + 1; ++j)
    {
        v[0][j] = eval(am1, {x : a, y : j * k + b, Math});
        v[n][j] = eval(am3, {x : c, y : j * k + b, Math});
        
        yarr.push(j * k + b);
    }

    for(let j = 2 + multm * 1; j <  4 + multm * 2 + 1; ++j)
    {
        v[2 + multn*1][j] = eval(am1, {x : a + (2 + multn*1)*h, y : j * k + b, Math});
        v[4 + multn*2][j] = eval(am3, {x : a + (4 + multn*2)*h, y : j * k + b, Math});
    }


    for(let i = 0; i < n + 1; ++i)
    {
        v[i][0] = eval(am2, {x : i * h + a, y : b, Math});
        v[i][m] = eval(am4, {x : i * h + a, y : d, Math});

        xarr.push(i * h + a);
    }

    for(let i = 2 + multn *1; i < 4 + multn*2 + 1; ++i)
    {
        v[i][2 + multm * 1] = eval(am2, {x : i * h + a, y : b + (2 + multm * 1)*k, Math});
        v[i][4 + multm * 2] = eval(am4, {x : i * h + a, y : b + (4 + multm * 2)*k, Math});
    }

    const k2 = -1.0 / (k*k);
    const h2 = -1.0 / (h*h);
    const a2 = -2.0 * (h2 + k2);

    let mEps = 100;
    let num = 0;
    let af = parse(func);

    
    let betta = 0;

    let r = equation(v,func);
    let z;
    z = getZ(r,z);

    let alpha = -dotProduct(z,z) / dotProduct(equation(z,'0'),z);

    while(num < max && mEps > eps)
    {
        mEps = 0;

        for(let i = 1; i < 2 + multn * 1; ++i)
        {
            for(let j = 1; j < m; ++j)
            {
                let prev = v[i][j];
                v[i][j] = prev - alpha * z[i][j];

                let cEps = Math.abs(v[i][j] - prev);
                mEps = Math.max(cEps,mEps);
            }
        }

        for(let i = 2 + multn * 1; i < 4 + multn * 2 + 1; ++i)
        {
            for(let j = 1; j < 2 + multm*1; ++j)
            {
                let prev = v[i][j];
                v[i][j] = prev - alpha * z[i][j];

                let cEps = Math.abs(v[i][j] - prev);
                mEps = Math.max(cEps,mEps);
            }

            for(let j = 4+multm*2 +1; j < m; ++j)
            {
                let prev = v[i][j];
                v[i][j] = prev - alpha * z[i][j];

                let cEps = Math.abs(v[i][j] - prev);
                mEps = Math.max(cEps,mEps);
            }
        }

        for(let i = 4 + multn * 2 + 1; i < n; ++i)
        {
            for(let j = 1; j < m; ++j)
            {
                let prev = v[i][j];
                v[i][j] = prev - alpha * z[i][j];

                let cEps = Math.abs(v[i][j] - prev);
                mEps = Math.max(cEps,mEps);
            }
        }

        num++;

        r = equation(v,func);
        let az = equation(z,'0');
        betta = dotProduct(az,r) / dotProduct(az,z);

        z = getZ(r,z);
        az = equation(z,'0');

        r = reverse(r);
        alpha = -dotProduct(r,z) / dotProduct(az,z);
        
    }


    function equation(left,right)
    {
        let aff = parse(right);
        let res = [...left].map(l => l.map(e => 0));
        for(let i = 1; i < n; ++i)
        {
            for(let j = 1; j < m; ++j)
            {
                if(!mask[i][j])
                    continue;

                let f = eval(aff,{x : a + i * h, y : b + j * k, Math});
                res[i][j] = a2 * left[i][j] +
                    h2 * (left[i-1][j] + left[i+1][j]) +
                    k2 * (left[i][j-1] + left[i][j+1]) +
                    f;
    
            }
        }
    
        return res;
    }

    function getZ(left,right)
    {
        if(!right)
            right = [...left].map(l => l.map(e => 0));

        let res = [...left].map(l => l.map(e => 0));
        for(let i = 0; i < n+1; ++i)
        {
            for(let j = 0; j < m +1; ++j)
            {
                if(!mask[i][j])
                    continue;

                res[i][j] = -left[i][j] + betta * right[i][j];
            }
        }

        return res;
    }

    function reverse(arr)
    {
        return arr.map(l => l.map(e => -e));
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

function dotProduct(m1,m2)
{
    let res = 0;
    for(let i = 0; i < m1.length; ++i)
    {
        for(let j = 0; j < m1[0].length; ++j)
        {
            res += m1[i][j] * m2[i][j];
        }
    }

    return res;
}






