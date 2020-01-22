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


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }



// Function to get searched country flag and name

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
        `<h3>${responseJson[0].name}</h3>
         <img src="${responseJson[0].flag}" alt="spain flag">`
        );

        $('#js-country-results').removeClass('hidden');

}





    function displaySongs(responseJson) {
        $('#js-top-songs').empty();
      
        for(let i = 0; i < responseJson.tracks.track.length; i++) {

          $('#js-top-songs').append(
            `<li><h3>${responseJson.tracks.track[i].name} by 
            ${responseJson.tracks.track[i].artist.name}
            </h3></li>`)};

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