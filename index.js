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

//Takes all key/value pairs from query items and maps them using encodeURI components
// Once a key is placed, it adds proper %20 url syntax to spaces and places = signs between keys and values.
// Finally, we return the structured keys and values all joined by the & symbol to the Get Music Function


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }





// *** Get Country Flag Function ***

// Creates the url variable using the restcountiresURL variable and the CountrySearchTerm.
// Then we use fetch to get the JSON data from our URL and call the displayCountry function.

function getCountryDetails(countrySearchTerm) {

  const url = restCountryURL + countrySearchTerm;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    
    .then(responseJson => displayCountry(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}


// *** Get Music Function ***

// Takes in the countryterm/limit number and structures the query.
// Once parameters are set, it takes the url and adds the new sanitized query string.
// Finally, we use fetch to get the JSON data from our URL and call the displaySongs function.

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
        throw new Error(response.statusText);
      })
      
      .then(responseJson => displaySongs(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
  }
  



  function displayCountry(responseJson) {
    $('#js-country-results').empty();

      $('#js-country-results').append(
         `<img src="${responseJson[0].flag}" alt="spain flag">`
        );

        $('#js-country-results').removeClass('hidden');

}





    function displaySongs(responseJson) {
        $('#js-top-songs').empty();
        console.log(responseJson);
        for(let i = 0; i < responseJson.tracks.track.length; i++) {

          $('#js-top-songs').append(
            `<a href="${responseJson.tracks.track[i].url}" target="_blank"><li><p>${responseJson.tracks.track[i].name} by 
            ${responseJson.tracks.track[i].artist.name}
            </p></li></a>`)};

            $('.top-songs-container').removeClass('hidden');

    }




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