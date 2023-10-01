debugger
async function getCurrencies() {
    const response = await fetch('https://api.currencyapi.com/v3/latest?apikey=cur_live_5UzXC9dYPhurmKPXxlMY9iSQDWC2PATFotV7wTax');
    const data = await response.json();
    const result = await data
    return result;
}
const lang = {
    "titlename": {
        "ua": "Конвертація валют на javascript",
        "en": "сurrency converter to javascript"
    },
    "nameExchange": {
        "ua": "Обмінник",
        "en": "Exchange"
    },
    "FormControlSelectFirst":{
        "ua": "Віддаю",
        "en": "Give away"
    },
    "buttonConvert":{
        "ua": "Конвертувати",
        "en": "Сonvert"
    },
    "FormControlSelectSecond":{
        "ua": "Отримую",
        "en": "Recieve"
    },
    "historyBlock":{
        "ua":"Історія конвертацій",
        "en":"Сonversion history"
    },
    "buttonClearHistory":{
        "ua":"Очистить історію",
        "en":"Clear history"
    },
}
const ratesCurse = { BTC: 0.0000370049, EUR: 0.9468501578, GBP: 0.819460138, USDT: 1.0026793725, UAH: 36.7084961443 };
document.addEventListener('DOMContentLoaded', async () => {
    const result = await getCurrencies()
    ratesCurse.BTC = result.data.BTC.value
    ratesCurse.EUR = result.data.EUR.value
    ratesCurse.GBP = result.data.GBP.value
    ratesCurse.USDT = result.data.USDT.value
    ratesCurse.UAH = result.data.UAH.value
    // Создаем начальные данные графика
    const initialData = {
        labels: [result.meta.last_updated_at],
        datasets: [
            {
                label: 'BTC / USD',
                data: [],
                cubicInterpolationMode: 'monotone',
                borderColor: 'red',
                backgroundColor: 'red',
            },
            {
                label: 'EUR / USD',
                data: [],
                cubicInterpolationMode: 'monotone',
                borderColor: 'blue',
                backgroundColor: 'blue',
            },
            {
                label: 'GBP / USD ',
                data: [],
                cubicInterpolationMode: 'monotone',
                borderColor: 'pink',
                backgroundColor: 'pink',
            },
            {
                label: 'USDT / USD',
                data: [],
                cubicInterpolationMode: 'monotone',
                borderColor: 'green',
                backgroundColor: 'green',
            },
            {
                label: 'UAH / USD',
                data: [],
                cubicInterpolationMode: 'monotone',
                borderColor: 'yellow',
                backgroundColor: 'yellow',
            }
        ],
    };

    // Инициализируем плагин и создаем график с начальными данными
    const chartContext = document.querySelector('.chart').getContext('2d');
    const chart = new Chart(chartContext, {
        type: 'bar',
        data: initialData,
        labels: initialData,
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'white',
                        stepSize: 0.1,
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                    },
                },
                y: {

                    ticks: {
                        color: 'white',
                        stepSize: 0.001,

                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                    },
                },
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                    },
                },
            },
        },
    });
    // Получаем данные о курсах Bitcoin из асинхронной функции и обновляем график
    const currencyValueBtc = result.data.BTC.value
    const currencyValueEur = result.data.EUR.value
    const currencyValueGbp = result.data.GBP.value
    const currencyValueUsdt = result.data.USDT.value
    const currencyValueUah = result.data.UAH.value
const currencyDate = result.meta.last_updated_at
    // Обновляем данные графика с данными о курсах Bitcoin
    chart.data.datasets[0].data[0] = currencyValueBtc;
    chart.data.datasets[1].data[0] = currencyValueEur;
    chart.data.datasets[2].data[0] = currencyValueGbp;
    chart.data.datasets[3].data[0] = currencyValueUsdt;
    chart.data.datasets[4].data[0] = currencyValueUah;

    //Указываем дату обновления курса
    chart.data.labels[0] = currencyDate;
    chart.update();

    let select1 = document.getElementById("FormControlSelect1");
    let select2 = document.getElementById("FormControlSelect2");
    for (let key in ratesCurse) {

        let option1 = document.createElement("option");
        option1.text = key;
        let option2 = document.createElement("option");
        option2.text = key;
        select1.appendChild(option1);
        select2.appendChild(option2);

    }
});

const buttonConvert = document.querySelector('#buttonConvert');
const buttonClearHistory = document.querySelector('#buttonClearHistory');
const selectLeng = document.getElementById('selectLeng')
buttonConvert.onclick = getConvert;
buttonClearHistory.onclick = clearHistory;
let history = []
let count = 0
function getConvert() {
    const input1 = document.querySelector('#input1')
    const input2 = document.querySelector('#input2')
    const selecter1 = document.querySelector('#FormControlSelect1')
    const selecter2 = document.querySelector('#FormControlSelect2')
    if (parseFloat(input1.value) <= 0 || input1.value == '') {
        alert("Введіть коректне значення")
        input1.value = null
    }
    else {
        input2.value = (input1.value / ratesCurse[selecter1.value] * ratesCurse[selecter2.value]).toFixed(2)
        history.push(`${input1.value} ${selecter1.value} = ${input2.value} ${selecter2.value}`)
        saveHistory(history)
        const numberList = document.getElementById('numberList')
        const listItem = document.createElement('li')
        listItem.textContent = history[count]
        numberList.appendChild(listItem);
        count++
        if (count >= 20) {
            clearHistory()
        }
    }
}

function saveHistory(history) {
    localStorage.setItem('history', JSON.stringify(history));
}
function clearHistory() {
    history = []
    localStorage.removeItem('history')
    numberList.innerHTML = '';
    count = 0
}
function changeLeng() {
    let selectedLeng = selectLeng.value;

    for (let key in lang) {
        document.querySelector('.' + key).textContent = lang[key][selectedLeng];
    }
    window.location.hash = selectedLeng;
    setCookie('selectedLanguage', selectedLeng, 30);
}

selectLeng.addEventListener('change', changeLeng);

function setInitialLenguage() {
    let hash = window.location.hash.substr(1);
    if(hash == ''){
       if(document.cookie == '')
       {
        selectLeng.value = 'ua'
        window.location.hash = 'ua'
       }else{
        selectLeng.value = getCookieValue('selectedLanguage')
        window.location.hash = getCookieValue('selectedLanguage')
       }
    }else{
        selectLeng.value = hash;
    }
    changeLeng();
}
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
function getCookieValue(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}
setInitialLenguage();
