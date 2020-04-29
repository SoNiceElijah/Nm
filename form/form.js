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
        let docs = $('#' + gid[0] + '' + id + ' input');
        docs.each((s) => {
            data[docs[s].id] = '';
        });
    }
});
$('#bp0').click() ;

$('#z1').click((e) => {

    let values = {};
    for(let param in data)
    {
        values[param.substring(1)] = $('#' + param).val();
    }

    values['method'] = 'SOR';
    console.log(values);

    $('#z1').attr('loading','loading');
    $('#z1').text('Загрузка');

    $.post('/run',values, (answer) => {
        console.log(answer);
        Plotly.newPlot('chart', [answer.chart], layout);

        buildTable(answer.chart.z);
        buildStat(answer.stat);

        $('#z1').removeAttr('loading');
        $('#z1').text('Запуск');
        
    })
})

function buildTable(data)
{
    $('#data').html('');

    let table = document.createElement('table');
    for(let line of data)
    {
        let tr = document.createElement('tr');
        for(let el of line)
        {
            let td = document.createElement('td');
            td.innerHTML = el + '';
            td.setAttribute('title',el + '');
            tr.append(td);
        }

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
        str += data[prop].name + ' = ' + data[prop].val;
        str += '\n';        
    }

    $('#res').html(str);
}