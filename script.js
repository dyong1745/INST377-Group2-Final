function filterLitterData(array,orgInput1,cleanupInput2){
    let coordArray = []
   return array.filter((item) => item.organization === orgInput1 && item.type_cleanup === cleanupInput2);
    
}

function injectHTML(list) {
    console.log('fired injectHTML');
    const target = document.querySelector('#chart-filters');
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

function initMap() {
    const map = L.map('map').setView([38.9897, -76.9378], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    return map;
}

function markerPlace(array, map) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });
    array.forEach((item, index) => {
      const {longitude,latitude} = item.geocoded_column;
      L.marker([longitude, latitude]).addTo(map);
      if (index === 0) {
        map.setView([longitude, latitude], 10);
      }
    });
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
    return pullData(json);

}

async function mainEvent() {
    const url = 'https://data.princegeorgescountymd.gov/resource/9tsa-iner.json'; // remote URL! you can test it in your browser
    const data = await fetch(url); // We're using a library that mimics a browser 'fetch' for simplicity
    const json = await data.json(); // the data isn't json until we access it using dot notation
    let uniqueArr = []
   
    
    
    // console.log('mapfilters:', mapFilters);
    console.log(json);
    // console.log(json[0]['latitude']);
    // data.forEach((item) => {
    //     if (uniqueArr.includes(item) === false){
    //         uniqueArr.push(item)
    //     }
    // })

    // data array
    console.log(uniqueArr);
    const organization = document.querySelector('#organization');
    const type_cleanup = document.querySelector('#type-clean');
    const showMap = initMap();

    const org_value = organization.value;
    // const orgValue = org.options[org.selectedIndex].value;
    const type_clean_value = type_cleanup.value;
    // const clean_val = type_clean.options[type_clean.selectedIndex].value;

    // console.log("org:", org);
    // console.log("clean",type_clean);
    // const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
    // const submit = document.querySelector('#get-resto'); // get a reference to your submit button
    // const loadAnimation = document.querySelector('.lds-ellipsis'); // get a reference to our loading animation
    // const chartTarget = document.querySelector('#myChart');
    // submit.style.display = 'none'; // let your submit button disappear
    const form = document.querySelector('.filters')
    const submit = document.querySelector('#refresh-button');

    const mapFilters = filterLitterData(json,org_value, type_clean_value).slice(0,10);
    markerPlace(mapFilters, showMap);
   
    console.log(form);
    let currentArr = [];

    form.addEventListener('submit', (submitEvent) => {
      console.log('Button Pressed');
      injectHTML(uniqueArr);
      markerPlace(mapFilters, showMap)
    });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
// https://data.princegeorgescountymd.gov/resource/9tsa-iner.json
