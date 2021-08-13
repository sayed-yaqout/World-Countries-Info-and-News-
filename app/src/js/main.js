//============================================================Countries API================================================\\
//get fetched data from news API
let countries;
const COUNTRIES_API_KEY = "https://restcountries.eu/rest/v2/all";
fetch(COUNTRIES_API_KEY)
  .then((res) => res.json())
  .then((data) => initialize(data))
  .catch((err) => console.log("Error", err));

function initialize(countriesData) {
  countries = countriesData;
  let gallery = document.querySelector(".gallery");
  let template = document.getElementById("countriestemp").innerHTML;

  for (let i = 0; i < countries.length; i++) {
    var rendered = Mustache.render(template, {
      flag: countries[i].flag,
      name: countries[i].name,
      capital: countries[i].capital,
      alpha3Code: countries[i].alpha3Code,
    });

    gallery.innerHTML += rendered;
  }
}

// Delay in loading flickity plugin
setTimeout(load_js, 0);

function load_js() {
  // Get the head tag
  var head_ID = document.getElementsByTagName("head")[0];
  // Create script element
  var script_element = document.createElement("script");
  // Set the script type to JavaScript
  script_element.type = "text/javascript";
  // External JS file
  script_element.src = "https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js";
  head_ID.appendChild(script_element);
}

//country click event

function chooseCountry(event) {
  var template2 = document.getElementById("countryCardTemp").innerHTML;
  var countrysection = document.getElementById("forCountry");
  var parent = event.currentTarget;

  var alphaCode = parent.getAttribute("title");
  //find country
  var clickedCountry = countries.find((c) => c.alpha3Code === alphaCode);
  //get neighbors
  var neighborsAlphaCodes = clickedCountry.borders;
  var neighbors = [];
  for (let i = 0; i < neighborsAlphaCodes.length; i++) {
    neighbors[i] = countries.find(
      (c) => c.alpha3Code === neighborsAlphaCodes[i]
    ).name;
  }
  //render country card template
  var rendered = Mustache.render(template2, {
    name: clickedCountry.name,
    flag: clickedCountry.flag,
    capital: clickedCountry.capital,
    currency: clickedCountry.currencies[0].name,
    language: clickedCountry.languages[0].name,
    pop: numberWithCommas(clickedCountry.population),
    subreg: clickedCountry.subregion,
    timezone: clickedCountry.timezones[0],
    nibor: neighbors,
  });
  countrysection.innerHTML = "";
  countrysection.innerHTML += rendered;
  fetchNews(clickedCountry.alpha2Code);
}

//get popuation with comma
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//=================================================News API=======================================================\\
//fetching new API data
function fetchNews(alpha2Code) {
  fetch(
    `https://newsapi.org/v2/top-headlines?country=${alpha2Code}&apiKey=b5bd6df47c14464bb42f53a1fa3efa91`
  )
    .then((res) => res.json())
    .then((data) => {
      showNews(data);
      console.log(data);
    })
    .catch((err) => console.log("Error", err));
}
//showing News
function showNews(newsData) {
  var news = newsData;
  var newsTemplate = document.getElementById("newsTemplate").innerHTML;
  var forNews = document.querySelector(".newsSection");
  forNews.innerHTML = "";
  for (let i = 0; i < news.totalResults; i++) {
    var article = news.articles[i];
    //rendering News template
    var rendered = Mustache.render(newsTemplate, {
      Imgpath: article.urlToImage,
      header: article.title,
      details: article.description,
      source: article.source.name,
      date: article.publishedAt,
    });
    forNews.innerHTML += rendered;
  }
}
