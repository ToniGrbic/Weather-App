
window.addEventListener('load', ()=>{
const monthsArr = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
const weekdaysArr = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const description = document.querySelector('.temperature-description')
const location = document.querySelector('.location-timezone')
const temperature = document.querySelector('.temperature')
const temp_unit = document.querySelector('.temperature-unit')
const date_time = document.querySelector('.date-time')
const hours_minutes = document.querySelector('.hours-minutes')
const weather_img = document.querySelector('.location-section > .weather > img') 
const body_html = document.querySelector('body')
const humidity = document.querySelector('#humidity')
const pressure = document.querySelector('#pressure')
const wind = document.querySelector("#wind")

const windDirection = (windDeg)=>{
    let windDirection = ''
      if(windDeg === 90){
            windDirection = 'North';
        }else if(windDeg === 0){
            windDirection = 'East';
        }else if(windDeg === 180){
            windDirection = 'West';
        }else if(windDeg === 270){
            windDirection = 'South';
        }else if( windDeg > 0 && windDeg < 90){
            windDirection = 'North East';
        }else if( windDeg > 90 && windDeg < 180){
            windDirection = 'North West';
        }else if( windDeg > 180 && windDeg < 270){
            windDirection = 'South West';
        }else{
            windDirection = 'South East';
        }
     return windDirection
}

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
        const {longitude:long, latitude:lat} = position.coords
        
        //FETCH DATA
        fetch(`/.netlify/functions/fetchWeather?lat=${lat}&long=${long}`)
        .then(res => res.json())
        .then(data => {
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
            let windDeg = data.wind.deg;
            let direction = windDirection(windDeg)
            let windSpeed = data.wind.speed
            wind.textContent = `wind: ${windSpeed} m/s from ${direction}`

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
     
     AM_PM = hours > 12 ? 'PM' : 'AM'
     

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
    
