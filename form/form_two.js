
let  a = 0;
let b = 1;

const funcs = [
    (x) => {
        if(x < 0)
            return x **3 + 3 * x ** 2;
        else
            return -(x ** 3) + 3 * x ** 2;
    },
    (x) => Math.sin(Math.exp(x)),
    (x) => Math.sin(Math.exp(x)) + Math.cos(10*x)
];

const devs = [
    (x) => {
        if(x < 0)
            return 3*x**2 + 6 * x;
        else
            return -3*x**2 + 6 * x;
    },
    (x) => Math.cos(Math.exp(x)) * Math.exp(x),
    (x) => Math.cos(Math.exp(x)) * Math.exp(x) - 10 * Math.sin(10*x)
];

const devs2 = [
    (x) => {
        if(x < 0)
            return 6 * x + 6;
        else
            return -6*x + 6;
    },
    (x) => -Math.sin(Math.exp(x)) * Math.exp(x) * Math.exp(x) + Math.cos(Math.exp(x)) * Math.exp(x),
    (x) => -Math.sin(Math.exp(x)) * Math.exp(x) * Math.exp(x) + Math.cos(Math.exp(x)) * Math.exp(x) - 100* Math.cos(10*x)
];

let info = {
    X : [],
    A : [],
    B : [],
    C : [],
    D : [],
}

const inter = [
    (x) => {

        let i = Math.floor((x - a)/h)+ (x < b ? 1 : 0);
        return info.A[i] + info.B[i]*(x - info.X[i]) + info.C[i] / 2 * ((x - info.X[i])**2) + info.D[i] / 6 * ((x - info.X[i])**3);
    },
    (x) => {
        let i = Math.floor((x - a)/h)+ (x < b ? 1 : 0);
        return (info.B[i] + info.C[i] * (x - info.X[i]) + info.D[i]/2* ((x - info.X[i])**2));
    },
    (x) => {
        let i = Math.floor((x - a)/h)+  (x < b ? 1 : 0);
        return (info.C[i] + info.D[i] * (x - info.X[i]));
    }
];

let f;
let f_;
let f__;

let h = 0;

let mode = 0;

document.getElementById('go').onclick = () => {
    
    let but = document.getElementById('go');
    but.setAttribute('loading','loading');

    if(document.getElementById('f1').checked)
    {
        f = funcs[0];
        f_ = devs[0];
        f__ = devs2[0];

        a = -1;
        b = 1;
    }
    if(document.getElementById('f2').checked)
    {
        f = funcs[1];
        f_ = devs[1];
        f__ = devs2[1];

        a = 0;
        b = 1;
    }
    if(document.getElementById('f3').checked)
    {
        f = funcs[2];
        f_ = devs[2];
        f__ = devs2[2];

        a = 0;
        b = 1;
    }

    Spline();
    BuildData();
    Draw();

    but.removeAttribute('loading');
}

document.getElementById('w1').onclick = () => {
    mode = 0;
    Draw();
}

document.getElementById('w2').onclick = () => {
    mode = 1;
    Draw();
}

document.getElementById('w3').onclick = () => {
    mode = 2;
    Draw();
}

function Spline()
{
    info = {
        X : [],
        A : [],
        B : [],
        C : [],
        D : [],
    };

    let n = parseInt(document.getElementById('n').value);
    let m1 = parseFloat(document.getElementById('sa').value);
    let m2 = parseFloat(document.getElementById('sb').value);

    h = (b - a) / n;

    let alpha = [];
    let betta = [];

    for(let i = 0; i <= n; ++i)
    {
        info.X.push(a + i*h);
        info.A.push(f(a + i*h));
    }

    alpha.push(0);
    betta.push(0);

    alpha.push(0);
    betta.push(m1);

    for(let i = 1; i < n; ++i)
    {
        alpha.push(((-1.0)*h) / (alpha[i]*h + 4*h));
        betta.push(
            ((-6.0/h)*(info.A[i+1] - 2*info.A[i] + info.A[i-1]) +
            betta[i] * h) / (-4.0 * h - alpha[i] * h));
    }

    console.log(alpha);
    console.log(betta);

    for(let i = 0; i < n; ++i)
    {
        info.C.push(0);
    }

    info.C.push(m2);
    for(let i = n; i >= 1; --i)
    {
        info.C[i-1] = alpha[i]*info.C[i] + betta[i];
    }

    info.B.push(0);
    info.D.push(0);
    for(let i = 1; i <= n; ++i)
    {
        info.B.push((info.A[i] - info.A[i-1])/h + h*(2*info.C[i] + info.C[i-1])/6);
        info.D.push((info.C[i] - info.C[i-1])/h); 
    }


}

let tableNum = -1;
function BuildData()
{
    for(let i = 0; i < tableNum; ++i)
    {
        document.getElementById('table').deleteRow(1);
    }
    for(let i = 0; i < 4*(tableNum) + 1; ++i)
    {
        document.getElementById('stat').deleteRow(1);
    }

    for(let i = 1; i< info.X.length; ++i)
    {
        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerHTML = i + "";
        td1.setAttribute("title",i);

        let td2 = document.createElement('td');
        td2.innerHTML = info.X[i-1].toFixed(3);
        td2.setAttribute("title",info.X[i-1]);

        let td3 = document.createElement('td');
        td3.innerHTML = info.X[i].toFixed(3);
        td3.setAttribute("title",info.X[i]);

        let td4 = document.createElement('td');
        td4.innerHTML = info.A[i].toFixed(3);
        td4.setAttribute("title",info.A[i]);

        let td5 = document.createElement('td');
        td5.innerHTML = info.B[i].toFixed(3);
        td5.setAttribute("title",info.B[i]);

        let td6 = document.createElement('td');
        td6.innerHTML = info.C[i].toFixed(3);
        td6.setAttribute("title",info.C[i]);

        let td7 = document.createElement('td');
        td7.innerHTML = info.D[i].toFixed(3);
        td7.setAttribute("title",info.D[i]);

        tr.append(td1);
        tr.append(td2);
        tr.append(td3);
        tr.append(td4);
        tr.append(td5);
        tr.append(td6);
        tr.append(td7);

        document.getElementById('table').append(tr);
    }

    let j = 0;
    let s = inter[0];
    let s_ = inter[1];

    let mx = -10000;
    let mx_ = -10000;

    let mf = -10000;
    let mf_ = -10000;

    for(let i = a; i< b + h/8; i += h/4)
    {
        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerHTML = j + "";
        td1.setAttribute("title",j);

        let td2 = document.createElement('td');
        td2.innerHTML = i.toFixed(3);
        td2.setAttribute("title",i);

        let td3 = document.createElement('td');
        td3.innerHTML = f(i).toFixed(3);
        td3.setAttribute("title",f(i));

        let td4 = document.createElement('td');
        td4.innerHTML = s(i).toFixed(3);
        td4.setAttribute("title",s(i));

        let td5 = document.createElement('td');
        td5.innerHTML = Math.abs(f(i) - s(i)).toFixed(3);
        td5.setAttribute("title",Math.abs(f(i) - s(i)));

        let td6 = document.createElement('td');
        td6.innerHTML = f_(i).toFixed(3);
        td6.setAttribute("title",f_(i));

        let td7 = document.createElement('td');
        td7.innerHTML = s_(i).toFixed(3);
        td7.setAttribute("title",s_(i));

        let td8 = document.createElement('td');
        td8.innerHTML = Math.abs(f_(i) - s_(i)).toFixed(3);
        td8.setAttribute("title",Math.abs(f_(i) - s_(i)));

        tr.append(td1);
        tr.append(td2);
        tr.append(td3);
        tr.append(td4);
        tr.append(td5);
        tr.append(td6);
        tr.append(td7);
        tr.append(td8);

        document.getElementById('stat').append(tr);
        ++j;

        if(Math.abs(f(i) - s(i)) > mf)
        {
            mf = Math.abs(f(i) - s(i));
            mx = i;
        }

        if(Math.abs(f_(i) - s_(i)) > mf_)
        {
            mf_ = Math.abs(f_(i) - s_(i));
            mx_ = i;
        }
    }

    document.getElementById('maxf').innerHTML = mf + ' в точке ' + mx;
    document.getElementById('maxf_').innerHTML = mf_ + ' в точке ' + mx_;
    tableNum = info.X.length-1;
}

function Draw()
{
    const layout = {
        width : 480,
        height : 540,
        margin: {
            l: 50,
            r: 30,
            b: 50,
            t: 50,
            pad: 4
          },
    }

    let data = {
        x : [],
        y : [],
        name : 'Функция'
    }

    let int = {
        x : [],
        y : [],
        name : 'Интерполяция'
    }

    let fd;
    let id;

    if(mode == 0)
    {
        fd = f;
        id = inter[0];
    }
    if(mode == 1)
    {
        fd = f_;
        id = inter[1];
    }
    if(mode == 2)
    {
        fd = f__;
        id = inter[2];
    }

    for(let i = a; i <= b + 0.01; i += 0.01)
    {
        data.x.push(i);
        data.y.push(fd(i));

        int.x.push(i);
        int.y.push(id(i));
    }

    Plotly.newPlot('chart',[data, int],layout);
}