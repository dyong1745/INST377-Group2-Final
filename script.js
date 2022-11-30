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
        el.innerText = item.organization;
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
    console.log(json);
    console.log(pullData(json,'type_litter'));
    console.log(pullData(json,'organization'));
    console.log(pullData(json,'number_bags'));
    const reply = json.filter((item) => Boolean(item.geocoded_column_1)).filter((item) => Boolean(item.name));
    return reply;

}

async function mainEvent() {
    retrieveData()
    // const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
    // const submit = document.querySelector('#get-resto'); // get a reference to your submit button
    // const loadAnimation = document.querySelector('.lds-ellipsis'); // get a reference to our loading animation
    // const chartTarget = document.querySelector('#myChart');
    // submit.style.display = 'none'; // let your submit button disappear
    const form = document.querySelector('.filters box')

    let currentArr = [];

    form.addEventListener('input', (event) => {
      console.log(event.target.value);
      injectHTML(filteredList);
      // markerPlace(filteredList, pageMap);
    });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
// https://data.princegeorgescountymd.gov/resource/9tsa-iner.json