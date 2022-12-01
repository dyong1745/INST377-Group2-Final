// function filterData(array,filterInputValue){
//     return array.filter((item) => {

//     });
// }

function injectHTML(list) {
    console.log('fired injectHTML');
    const target = document.querySelector('#info');
    target.innerHTML = '';

    const listEl = document.createElement('ol');
    target.appendChild(listEl);
    list.forEach((item) => {
        const el = document.createElement('li');
        el.innerText = item;
        listEl.appendChild(el);
    });
    
}

function pullData(array,item){
    return array.map((currArr) => {
        return currArr[item];
    })

}
async function retrieveData (){
    const url = 'https://data.princegeorgescountymd.gov/resource/9tsa-iner.json'; // remote URL! you can test it in your browser
    const data = await fetch(url); // We're using a library that mimics a browser 'fetch' for simplicity
    const json = await data.json(); // the data isn't json until we access it using dot notation
    // console.log(json);
    // console.log(pullData(json, 'ORGANIZATION'));
    // console.log(pullData(json, 'TYPE_CLEANUP'));
    // console.log(pullData(json, 'TYPE_LITTER'));
    // console.log(pullData(json, 'TOTAL_BAGS_LITTER'));
    // console.log(pullData(json, 'MAJOR_WSHED'));
    // console.log(pullData(json, 'COUNCIL_DISTRICT'));
    // console.log(pullData(json, 'DPWT_MAIN_DIST'));
    // const reply = json.filter((item) => Boolean(item.geocoded_column_1)).filter((item) => Boolean(item.name));
    return pullData(json,'type_litter');

}

async function mainEvent() {
    let uniqueArr = []
    const data = await retrieveData();
    console.log(data);
    data.forEach((item) => {
        if (uniqueArr.includes(item) === false){
            uniqueArr.push(item)
        }
    })

    console.log(uniqueArr);
    // const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
    // const submit = document.querySelector('#get-resto'); // get a reference to your submit button
    // const loadAnimation = document.querySelector('.lds-ellipsis'); // get a reference to our loading animation
    // const chartTarget = document.querySelector('#myChart');
    // submit.style.display = 'none'; // let your submit button disappear
    const form = document.querySelector('.filters_box')

    console.log(form);
    let currentArr = [];

    form.addEventListener('input', (event) => {
      console.log(event.target.value);
      injectHTML(uniqueArr);
    });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
// https://data.princegeorgescountymd.gov/resource/9tsa-iner.json