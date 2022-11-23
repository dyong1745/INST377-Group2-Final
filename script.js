async function retrieveData (){
    const url = 'https://data.princegeorgescountymd.gov/resource/9tsa-iner.json'; // remote URL! you can test it in your browser
    const data = await fetch(url); // We're using a library that mimics a browser 'fetch' for simplicity
    const json = await data.json(); // the data isn't json until we access it using dot notation
    console.log(json);
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
    
}
document.addEventListener("DOMContentLoaded", async () => mainEvent());
// https://data.princegeorgescountymd.gov/resource/9tsa-iner.json