let data = {};

const layout = {
    title: 'График',
    autosize: false,
    width: 850,
    height: 560
};

$('.menu-button').click((e) => {


    let str = e.currentTarget.id;
    let id = str.substring(2);
    let gid = $(e.currentTarget).attr('-data-pages').split(' ');
       
    $('#b'+ gid[0] + ' .menu-button').removeAttr('selected');
    $('#' + str).attr('selected', 'selected');
   
    for(let g of gid)
    {
        $('#' + g + ' .container').addClass('none');
        $('#' + g + '' + id).removeClass('none');
    }

    let cls = str.substring(1,2);
    if(cls === 'p')
    {
        data = {};
        let docs = $('#' + gid[0] + '' + id + ' input');
        docs.each((s) => {
            data[docs[s].id] = '';
        });
    }
});
$('#bp0').click() ;

$('#z1').click((e) => {

    let values = {};
    values['method'] = 'SOR';

    run(values, 'z1');
})

$('#z2').click((e) => {

    let values = {};
    values['method'] = 'FPI';

    run(values, 'z2');
})

$('#z4').click((e) => {

    let values = {};
    values['method'] = 'SOR';

    run(values, 'z4');
})

function run(values, id)
{
    for(let param in data)
    {
        values[param.substring(1)] = $('#' + param).val();
    }
    
    console.log(values);

    $('#' + id).attr('loading','loading');
    $('#' + id).text('Загрузка');

    $.post('/run',values, (answer) => {
        console.log(answer);
        Plotly.newPlot('chart', [answer.chart], layout);

        buildTable(answer.chart.z,answer.chart.x,answer.chart.y);
        buildStat(answer.stat);

        console.log(answer.info); 

        $('#' + id).removeAttr('loading');
        $('#' + id).text('Запуск');
        
    })
}

function buildTable(data,x,y_list)
{
    data.reverse();
    $('#data').html('');

    let table = document.createElement('table');
    let count = 1;

    let tr = document.createElement('tr');

    let htd = document.createElement('td');
    htd.className = 'htd';
    htd.innerHTML = `<b class="y1">Y</b> \\ <b class="x1">X</b>`;
    tr.append(htd);

    for(let e of x)
    {
        let td = document.createElement('td');
        td.className = 'x1';
        td.innerHTML = e.toFixed(3) + '';
        tr.append(td);
    }
    table.append(tr);

    for(let line of data)
    {
        tr = document.createElement('tr');

        let td = document.createElement('td');

        td = document.createElement('td');
        td.innerHTML = y_list[y_list.length - count].toFixed(3) + '';
        td.className = 'y1';
        tr.append(td);

        for(let el of line)
        {
            td = document.createElement('td');
            td.innerHTML = el.toFixed(3) + '';
            td.setAttribute('title',el + '');
            tr.append(td);
            
        }

        ++count;
        table.append(tr);
    }

    $('#data').append(table);
}

function buildStat(data)
{
    $('#res').html('');
    let str = '';

    for(let prop in data)
    {       
        str += '<i>'+data[prop].name+'</i>' + '<br>' + data[prop].val;
        str += '<br>';        
    }

    $('#res').html(str);
}