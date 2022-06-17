window.addEventListener('load', ()=>{
let long;
let lat;
let description = document.querySelector('.temperature-description')
let location = document.querySelector('.location-timezone')
let temperature = document.querySelector('.temperature')
let temp_unit = document.querySelector('.temperature-unit')
let date_time = document.querySelector('.date-time')
let hours_minutes = document.querySelector('.hours-minutes')
let weather_img = document.querySelector('.location-section > .weather > img') 
let body_html = document.querySelector('body')
let humidity = document.querySelector('#humidity')
let pressure = document.querySelector('#pressure')
let wind = document.querySelector("#wind")

async function fetch_OWapi_JSON(){
    console.log(`long: ${long}, lat: ${lat}`)
    const OWMapi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=e47ecd7b6876d7c69854ddc70259a4a7`;
    const response = await fetch(OWMapi);

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
    const result = await response.json();
    return result;
}

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        //console.log(`long: ${long}, lat: ${lat}`)
        
        //FETCH DATA
        fetch_OWapi_JSON().then(data => {
            console.log(data);

            const tempCelsius = data.main.temp - 273.15
            const tempFarenheit = tempCelsius * (9/5) + 32

            description.textContent = data.weather[0]['description'];
            weather_img.src = `http://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png`;
            location.textContent = data.sys.country + ' / '+ data.name ;

            temperature.textContent = (tempCelsius).toFixed(1);
            humidity.textContent = `humidity: ${data.main.humidity}%`;
            pressure.textContent = `pressure: ${data.main.pressure} hPa`;
            
            //WIND DIRECTION
            let wind_deg = data.wind.deg;
            //console.log(wind_deg)
            let wind_direction = '';
            if(wind_deg == 90){
                wind_direction = 'North';
            }else if(wind_deg == 0){
                wind_direction = 'East';
            }else if(wind_deg == 180){
                wind_direction = 'West';
            }else if(wind_deg == 270){
                wind_direction = 'South';
            }else if( wind_deg > 0 && wind_deg < 90){
                wind_direction = 'North East';
            }else if( wind_deg > 90 && wind_deg < 180){
                wind_direction = 'North West';
            }else if( wind_deg > 180 && wind_deg < 270){
                wind_direction = 'South West';
            }else{
                wind_direction = 'South East';
            }
            wind.textContent = `wind: ${data.wind.speed} m/s from ${wind_direction}`;
        //CHANGE TEMP UNIT ONCLICK
        temperature.addEventListener('click', changeTempUnit);

        function changeTempUnit(){
            if(temp_unit.textContent === '°C'){
                temp_unit.textContent = '°F';
                temperature.textContent = (tempFarenheit).toFixed(1);
            
            }else if(temp_unit.textContent === '°F'){
                temp_unit.textContent = '°C';
                temperature.textContent = (tempCelsius).toFixed(1);
            } 
        } 
    });  
});  
//DATE AND TIME
const monthsArr = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
const weekdaysArr = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function format(value){
      if(value < 10){
          value = `0${value}`
      }
      return value
    }

function getTime(){
     
     let currentDate = new Date()
     
     let month = monthsArr[currentDate.getMonth()]
     let weekday = weekdaysArr[currentDate.getDay()]
     let date = format(currentDate.getDate())
     let hours = format(currentDate.getHours())
     let minutes = format(currentDate.getMinutes())
     let seconds = format(currentDate.getSeconds())
     let AM_PM = ''
     
     if(hours > 12){
         AM_PM = 'PM'
     }else{
         AM_PM = 'AM'
     }

     if(hours >= 18 || hours <= 6){
        body_html.classList.add('night-background')
        body_html.classList.remove('day-background')
     }else{
        body_html.classList.add('day-background')
        body_html.classList.remove('night-background')
     }
     
     hours_minutes.innerHTML = `${hours}:${minutes}:${seconds} ${AM_PM}`
     date_time.innerHTML = `${weekday}, ${month} ${date}`
     }
     setInterval(getTime, 1000)
     getTime()
}
});  
    
