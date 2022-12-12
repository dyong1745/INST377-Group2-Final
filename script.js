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



/* 
 council district is council_district
 DPWT Main district is dpwt_main_dist
*/ 

// function that handles the shape of the chart
function shapeChartData(array,chartValue = 'council_district') {
  return array.reduce((collection, item) => {
    
    
    if(!collection[item[chartValue]]) {
      collection[item[chartValue]] = parseInt(item.total_bags_litter);
    } else {
      collection[item[chartValue]] += parseInt(item.total_bags_litter);
    };

    return collection;
    
  }, {});
}

function addData(chart,object) {
  const labels = Object.keys(object); // location names
  const info = Object.values(object); // num of times location appears
  chart.data.labels = labels;
  chart.data.datasets.data = info;
  chart.update();
}

function removeData(chart) {
    chart.data.labels = [];
    chart.data.datasets.data = [];
    chart.update();
}

async function retrieveData (){
    const url = 'https://data.princegeorgescountymd.gov/resource/9tsa-iner.json'; // remote URL! you can test it in your browser
    const data = await fetch(url); // We're using a library that mimics a browser 'fetch' for simplicity
    const json = await data.json(); // the data isn't json until we access it using dot notation
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
    console.log("shapedChart:", shapedChart);

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

  
    // Event listener for chart dropdown menu
    changeXAxis.addEventListener('change', (submitEvent) => {
      console.log('Chart Filter Selection Pressed');
        
      const chartSelection = shapeChartData(json,changeXAxis.value);
      removeData(showChart);
      addData(showChart,chartSelection);
      console.log("shape data:", chartSelection);
      
        
    });
        
  
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
// https://data.princegeorgescountymd.gov/resource/9tsa-iner.json
