'use strict'

//Example of proper full URLs

// const lastFmURL = "http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=spain&api_key=1f5f7a9370642b804d81da8dc68d5cfe&format=json";
// const restCountryURL = "https://restcountries.eu/rest/v2/name/{name}";

// API and URL variables
const lastFmApiKey = "1f5f7a9370642b804d81da8dc68d5cfe";

//geo lastFM endpoint
const lastFmURL = "http://ws.audioscrobbler.com/2.0/";
const format = "json";
const lastFmMethod = "geo.gettoptracks";

//REST countries endpoint
let restCountryURL = "https://restcountries.eu/rest/v2/name/";


// *** Format Music Query Function ***

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}





// *** Get Country Flag Function ***

function getCountryDetails(countrySearchTerm) {

  const url = restCountryURL + countrySearchTerm;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert("Country not found");
      throw new Error(response.statusText);
    })

    .then(responseJson => displayCountry(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}


// *** Get Music Function ***

function getMusic(query, limit) {
  const params = {
    method: lastFmMethod,
    country: query,
    api_key: lastFmApiKey,
    limit,
    format: format,
  };

  const queryString = formatQueryParams(params)
  const url = lastFmURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert("Couldn't find songlist. Please Try again");
      throw new Error(response.statusText);
    })

    .then(responseJson => displaySongs(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}


// *** Display Country Flag ***
function displayCountry(responseJson) {
  $('#js-country-results').empty();

  $('#js-country-results').append(
    `<img src="${responseJson[0].flag}" alt="spain flag">`
  );

  $('#js-country-results').removeClass('hidden');

}




// *** Display Top Song List ***
function displaySongs(responseJson) {
  $('#js-top-songs').empty();

  for (let i = 0; i < responseJson.tracks.track.length; i++) {

    $('#js-top-songs').append(
      `<a href="${responseJson.tracks.track[i].url}" target="_blank"><li><p>${responseJson.tracks.track[i].name} by 
    ${responseJson.tracks.track[i].artist.name}
    </p></li></a>`)
  };

  $('.top-songs-container').removeClass('hidden');

}


// *** Watch for user form submisson ***

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const countrySearchTerm = $('#js-search-country').val();
    const limit = $('#js-limit-results').val();
    getMusic(countrySearchTerm, limit);
    getCountryDetails(countrySearchTerm);
  });
}


$(watchForm);