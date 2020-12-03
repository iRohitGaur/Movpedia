var mainContent = '<div class="container container-center-main"><div class="title">Movpedia</div><div class="sub-title">Get information on movies</div><div class="input-div"><input id="input-text" class="container" type="text" placeholder="Enter the name of a movie" autofocus></div><div class="input-div"><button id="movie-search">GET DETAILS&emsp;<i class="fa fa-film"></i></button></div></div>';

var arrayContent = '<div class="container container-center"><div id="mov-info" class="container container-center row">';

var detailContent = '<div id="mov-data" class="container container-center movie-detail"><div class="back"><button id="back">< Back</button></div>';

var endContent = '</div></div></div>';

var state1 = mainContent + arrayContent + endContent;

var html = state1;

var movieArray;

document.getElementById("main-content-holder").innerHTML = html;

var body = document.getElementsByTagName('body')[0];

var searchBtn = document.querySelector("#movie-search")
searchBtn.addEventListener("click", searchHandler);

var input = document.querySelector("#input-text");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchBtn.click();
    }
});

let serverURL;

fetch(".netlify/functions/api")
.then(response => response.json())
.then(json => {
    serverURL = json.api;
})

function closeHandler() {
    document.getElementById("main-content-holder").innerHTML = state1;

    searchBtn = document.querySelector("#movie-search")
    searchBtn.addEventListener("click", searchHandler);
    
    input = document.querySelector("#input-text");
    input.focus();
    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchBtn.click();
        }
    });
}

function backHandler() {
    displayMovies(movieArray);
}

function searchHandler() {
    if (input.value == "") {
        alert("Please enter a name of movie to continue!");
    } else {
        let reqURL = serverURL + "&s=" + input.value
        searchMovie(reqURL);
    }
}

function searchMovie(reqURL) {
    body.classList.add("running");
    fetch(reqURL)
    .then(response => response.json())
    .then(json => {
        body.classList.remove("running");
        if (json.Response == "False") {
            alert("Sorry! Could not find a movie with that name. Please try again.")
        } else {
            movieArray = json.Search;
            displayMovies(json.Search);
        }
    })
}

function movieHandler() {
    let reqURL = serverURL + "&i=" + this.value
    body.classList.add("running");
    fetch(reqURL)
    .then(response => response.json())
    .then(json => {
        body.classList.remove("running");
        displayMovieData(json);
    })
}

function displayMovies(movies) {
    html = '<div class="close"><button id="close">X</button></div>';
    for (var i = 0; i < movies.length; i++) {
        html+='<button id="open-movie-detail" value="';
        html+=movies[i].imdbID;
        html+='"><div class="column"><div class="movie-info"><div class="movie-info-p">';
        html+=movies[i].Title + ' - ' +movies[i].Year;
        html+='</div></div><div class="movie-img-div"><img class="movie-img" src=';
        if (movies[i].Poster == "N/A") {
            html+="images/no-image.jpg"
        } else {
            html+=movies[i].Poster;
        }
        html+='></div></div></button>';
    }
    html+="</div></div>";
    document.getElementById("main-content-holder").innerHTML = arrayContent + html;

    var closeBtn = document.querySelector("#close")
    closeBtn.addEventListener("click", closeHandler);
    
    var detailBtns = document.querySelectorAll("#open-movie-detail");

    for (btn of detailBtns) {
        btn.addEventListener("click", this.movieHandler);
    }
}

function displayMovieData(movie) {
    html = '<div class="movie-poster"><img class="movie-img" src="';
    if (movie.Poster == "N/A") {
        html+="images/no-image.jpg"
    } else {
        html+= movie.Poster;
    }
    html+= '"></div><div class="movie-data-texts"><div class="movie-data-text"><div class="header">Title:</div><div class="info">';
    html+= movie.Title;
    html+= '</div></div><div class="movie-data-text"><div class="header">Year:</div><div class="info">';
    html+= movie.Year;
    html+= '</div></div><div class="movie-data-text"><div class="header">Runtime:</div><div class="info">';
    html+= movie.Runtime;
    html+= '</div></div><div class="movie-data-text"><div class="header">Genre:</div><div class="info">';
    html+= movie.Genre;
    html+= '</div></div><div class="movie-data-text"><div class="header">Director:</div><div class="info">';
    html+= movie.Director;
    html+= '</div></div><div class="movie-data-text"><div class="header">Actors:</div><div class="info">';
    html+= movie.Actors;
    html+= '</div></div><div class="movie-data-text"><div class="header">Plot:</div><div class="info">';
    html+= movie.Plot;
    html+= '</div></div><div class="movie-data-text"><div class="header">IMDB:</div><div class="info">';
    html+= movie.imdbRating;
    html+= ' / 10</div>&nbsp;</div></div></div>';
    document.getElementById("main-content-holder").innerHTML = detailContent + html;

    var backBtn = document.querySelector("#back")
    backBtn.addEventListener("click", backHandler);
}