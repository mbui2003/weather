// Selecting DOM elements
const form = document.querySelector('form');
const submitBtn = document.querySelector('.submit-btn');
const error = document.querySelector('.error-msg');

// Event listeners for form submission and button click
form.addEventListener('submit', handleSubmit);
submitBtn.addEventListener('click', handleSubmit);

// Function to handle form submission
function handleSubmit(e) {
  e.preventDefault(); // Prevents default form submission
  fetchWeather(); // Calls function to fetch weather data
}

// Asynchronous function to get weather data from the API
async function getWeatherData(location) {
  // Fetch weather data from the API
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=1986480656ec490d950204923202611&q=${location}`,
    {
      mode: 'cors',
    }
  );

  // Check if the response status is 400 (Bad Request)
  if (response.status === 400) {
    throwErrorMsg(); // Display error message
  } else {
    // Hide error message
    error.style.display = 'none';

    // Process weather data, display it, and reset the form
    const weatherData = await response.json();
    const newData = processData(weatherData);
    displayData(newData);
    reset();
  }
}

// Function to handle error message display
function throwErrorMsg() {
  // Display error message with a fade-in effect
  error.style.display = 'block';

  if (error.classList.contains('fade-in')) {
    error.style.display = 'none';
    error.classList.remove('fade-in2');
    error.offsetWidth;
    error.classList.add('fade-in');
    error.style.display = 'block';
  } else {
    error.classList.add('fade-in');
  }
}

// Function to process raw weather data into a simplified format
function processData(weatherData) {
  const myData = {
    condition: weatherData.current.condition.text,
    feelsLike: {
      f: Math.round(weatherData.current.feelslike_f),
      c: Math.round(weatherData.current.feelslike_c),
    },
    currentTemp: {
      f: Math.round(weatherData.current.temp_f),
      c: Math.round(weatherData.current.temp_c),
    },
    wind: Math.round(weatherData.current.wind_mph),
    humidity: weatherData.current.humidity,
    location: weatherData.location.name.toUpperCase(),
  };

  // Determine whether to use region or country as part of the location
  if (weatherData.location.country === 'United States of America') {
    myData['region'] = weatherData.location.region.toUpperCase();
  } else {
    myData['region'] = weatherData.location.country.toUpperCase();
  }

  return myData;
}

// Function to display weather data on the webpage
function displayData(newData) {
  // Apply fade-in effect to weather info elements
  const weatherInfo = document.getElementsByClassName('info');
  Array.from(weatherInfo).forEach((div) => {
    if (div.classList.contains('fade-in2')) {
      div.classList.remove('fade-in2');
      div.offsetWidth;
      div.classList.add('fade-in2');
    } else {
      div.classList.add('fade-in2');
    }
  });

  // Update text content of weather information elements
  document.querySelector('.condition').textContent = newData.condition;
  document.querySelector('.location').textContent = `${newData.location}, ${newData.region}`;
  document.querySelector('.degrees').textContent = newData.currentTemp.f;
  document.querySelector('.feels-like').textContent = `FEELS LIKE: ${newData.feelsLike.f}`;
  document.querySelector('.wind-mph').textContent = `WIND: ${newData.wind} MPH`;
  document.querySelector('.humidity').textContent = `HUMIDITY: ${newData.humidity}`;
}

// Function to reset the form
function reset() {
  form.reset();
}

// Function to fetch weather data when called
function fetchWeather() {
  // Get user input location and call the getWeatherData function
  const input = document.querySelector('input[type="text"]');
  const userLocation = input.value;
  getWeatherData(userLocation);
}