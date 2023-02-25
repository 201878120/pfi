$(document).ready(init_UI)

function init_UI() {
    google.charts.load('current', { packages: ['corechart'], language: 'us' });
    google.charts.setOnLoadCallback(makeGraphWeather);
    $(window).resize(makeGraphWeather);
    $("#search_ville").click(function (e) {
        let cityName = $("#nom_ville").val();
        if (cityName) {
            getInfoWeather(cityName).then((info)=>{
                dataWeather = info;
                makeGraphWeather();
            });
        }
    })
    dataWeather = {
        "city": "Exemple Québec",
        "data": [
            {
                "date": "2/23",
                "tempMin": -20.3,
                "tempMax": -11.2
            },
            {
                "date": "2/24",
                "tempMin": -27,
                "tempMax": -14.8
            },
            {
                "date": "2/25",
                "tempMin": -20.1,
                "tempMax": -9
            },
            {
                "date": "2/26",
                "tempMin": -24,
                "tempMax": -6.7
            },
            {
                "date": "2/27",
                "tempMin": -15.8,
                "tempMax": -3.2
            },
            {
                "date": "2/28",
                "tempMin": -5.3,
                "tempMax": -1.2
            },
            {
                "date": "3/1",
                "tempMin": -4,
                "tempMax": 0.5
            }
        ]
    }
}
function addLeadingZero(num, numOfDigits = 2) {
    let numStr = num.toString();
    const numLen = numStr.length;
    if (numLen < numOfDigits) {
        const diff = numOfDigits - numLen;
        for (let i = 0; i < diff; i++) {
            numStr = '0' + numStr;
        }
    }
    return numStr;
}
function findMinMaxDates(data) {
    let minDate, maxDate;

    data.forEach(obj => {
        const currentDate = new Date(obj.date);
        if (!minDate || currentDate < minDate) {
            minDate = currentDate;
        }
        if (!maxDate || currentDate > maxDate) {
            maxDate = currentDate;
        }
    });
    return { "min": minDate, "max": maxDate }
}
let dataWeather = [];
function makeGraphWeather() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'Date');
    dataTable.addColumn('number', 'MAX');
    dataTable.addColumn('number', 'MIN');
    for (var noDaylyWeader = 0; noDaylyWeader < dataWeather.data.length; noDaylyWeader++) {
        var row = [dataWeather.data[noDaylyWeader].date, dataWeather.data[noDaylyWeader].tempMax, dataWeather.data[noDaylyWeader].tempMin];
        dataTable.addRow(row);
    }

    var options = {
        title: `${dataWeather.city} - Prévision de ${dataWeather.data.length} jours`,
        titleTextStyle: {
            color: 'green', 
            fontSize: 25,   
            bold: true      
        },
        curveType: 'none',
        legend: { position: 'top' },
        series: {
            0: { color: '#ff0000' }, // couleur rouge pour Max
            1: { color: '#0000ff' }  // couleur bleue pour Min
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(dataTable, options);
}
async function getInfoWeather(city, countryCode = null) {

    const API_KEY = 'fd7de46a1900469aa39f74b5bc2a078b';

    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}${countryCode ? `,${countryCode}` : ""}&key=${API_KEY}&days=14`;
    let promise = new Promise((resolve, reject) => {

        $.getJSON(url, function (data) {
            const cityName = data.city_name;
            const forecasts = data.data.reduce((acc, datum) => {
                const date = new Date(datum.datetime);
                const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
                const forecast = {
                    date: formattedDate,
                    tempMin: datum.min_temp,
                    tempMax: datum.max_temp
                };
                if (!acc.some(item => item.date === formattedDate)) {
                    acc.push(forecast);
                } else {
                    const index = acc.findIndex(item => item.date === formattedDate);
                    if (forecast.tempMin < acc[index].tempMin) {
                        acc[index].tempMin = forecast.tempMin;
                    }
                    if (forecast.tempMax > acc[index].tempMax) {
                        acc[index].tempMax = forecast.tempMax;
                    }
                }
                return acc;
            }, []);
            dataWeather = { "city": cityName, "data": forecasts };
            resolve(dataWeather);
        }).fail(function (error) {
            console.error(error);
            reject({ data: [], city: "Erreur" });
        });
    })
    return promise;
}