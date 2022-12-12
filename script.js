function filterLitterData(array, typeLitterInput1){
  // let coordArray = []
  return array.filter((item) => item.type_litter.includes(typeLitterInput1));
    
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

function initChart(chart,object) {
  const labels = Object.keys(object); // location names
  const info = Object.values(object); // num of times location appears
  const data = {
    labels : labels,
    datasets: [{
      label: 'Total Bags of Litter',
      data: info,
      backgroundColor: 'rgb(159, 30, 120)',
    }]
  };

  const config = {
    type : "bar",
    data : data,
    options: {}
  };

  return new Chart(
    chart,
    config
  );
}

function shapeChartData(array) {
  return array.reduce((collection, item) => {
    if(!collection[item.council_district]) {
      collection[item.council_district] = parseInt(item.total_bags_litter);
    } else {
      collection[item.council_district] += parseInt(item.total_bags_litter);
    };
    return collection;
  }, {});
}

/*
function changeChart(chart, dataObject) {
  const labels = Object.keys(dataObject); // location names
  const info = Object.values(dataObject); // num of times location appears

  chart.data.labels = labels;
  chart.data.datasets.forEach((set) => {
    set.data = info; 
    return set;
  });
  chart.update();
*/

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
    
    console.log(json);

    // Data array
    console.log(uniqueArr);
    const typeLitter = document.querySelector('#type_litter');
    const showMap = initMap();

    let type_litter_value = typeLitter.value;
    
    // const org_value = organization.value;
    // const type_clean_value = type_cleanup.value;

    // const orgValue = org.options[org.selectedIndex].value;
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

    // Filter map data and place markers on the map
    const mapFilters = filterLitterData(json, typeLitter.value).slice(0,30);
    console.log('mapFilters', map)
    markerPlace(mapFilters, showMap);
   
    console.log(form);
    let currentArr = [];

    // Display Chart
    const targetChart = document.querySelector('#myChart');
    const changeXAxis = document.querySelector('#x-axis-filters');
    const chartData = await retrieveData();
    const shapedChart = shapeChartData(json);
    const showChart = initChart(targetChart, shapedChart);

    // Event listener for refresh button
    form.addEventListener('submit', (submitEvent) => {
        console.log('typeLitter:', typeLitter.value);
        // submitEvent.preventDefault();
        console.log('Refresh Button Pressed');
        injectHTML(uniqueArr);
        markerPlace(mapFilters, showMap)
    });

    // Event listener for map dropdown menu (select options)
    typeLitter.addEventListener('change', (submitEvent) => {
        // submitEvent.preventDefault();
        const filterLitter = filterLitterData(json, typeLitter.value).slice(0,30);
        console.log('mapFilters', filterLitter);
        console.log('type_litter_val: ', typeLitter.value);
        
        markerPlace(filterLitter, showMap);
    });

  /*
    // Event listener for chart dropdown menu
    chartFilter.addEventListener('change' (submitEvent) => {
      
    });
        
  */
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
// https://data.princegeorgescountymd.gov/resource/9tsa-iner.json
