'use strict'

//Example of proper full URLs

// const lastFmURL = "http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=spain&api_key=1f5f7a9370642b804d81da8dc68d5cfe&format=json";
// const restCountryURL = "https://restcountries.eu/rest/v2/name/{name}";

// API and URL variables
const lastFmApiKey = "1f5f7a9370642b804d81da8dc68d5cfe";

//geo lastFM endpoint
const lastFmURL = "http://ws.audioscrobbler.com/2.0/";
const format = "json";
let lastFmMethod = "geo.gettoptracks"; 

//REST countries endpoint
const restCountryURL = "https://restcountries.eu/rest/v2/name/";


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }




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
  
    console.log(url);
  
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


    function displaySongs(responseJson) {
        $('js-top-songs').empty();
      
        for(let i = 0; i < responseJson.tracks[i].length; i++) {

            $('js-top-songs').append(
                `<li><h3>${responseJson.track[i].name}</h3></li>`
            )};

    }




function watchForm() {
    $('form').submit(event => {
    console.log('I am firing');
      event.preventDefault();
      const countrySearchTerm = $('#js-search-country').val();
      const limit = $('#js-limit-results').val();
      getMusic(countrySearchTerm, limit);
    //   getCountryDetails(countrySearchTerm);
    });
  }
  
  $(watchForm);