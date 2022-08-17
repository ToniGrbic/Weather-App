const axios = require('axios')
require('dotenv')
const handler = async (event) => {
  const { lat, long } = event.queryStringParameters
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.API_KEY}`

  try{
    const {data} = await axios.get(url)
    console.log(data)
    return{
      statusCode:200,
      body: JSON.stringify(data)
    }
  }catch(error){
    const { status, statusText, headers, data} = error.response
    return {
      statusCode: status,
      body: JSON.stringify({ status, statusText, headers, data})
    }
  }
}

module.exports = { handler }
