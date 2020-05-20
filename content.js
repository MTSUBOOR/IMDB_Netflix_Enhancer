/*chrome.tabs.executeScript(tab.id, {code:
    "document.body.appendChild(document.createElement('script')).src = 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js.map';"
});*/
//manipulates the DOM to extract the title and year of a video, then calls appropriate function
function fetchMovieNameYear() {
  
    var synopsis = document.querySelectorAll('.jawBone .jawbone-title-link');
    //console.log(synopsis);
    // If synopsis is null returns undefined
    if (synopsis === null) {
        console.log('Synopsis not found');
        return;
    }
    //returns a nodelist containing the appropriate div
    var logoElement = document.querySelectorAll('.jawBone .jawbone-title-link .title');
    //if logoElement has no memebers, returns undefined

    if (logoElement.length === 0){
     //console.log('logoElement Not found');
     return;
 }
    //logoElement is now just the div containing the img that has the title
    logoElement = logoElement[logoElement.length - 1];
    //Extract the actual Title of the Film or TV Show
    var title = logoElement.querySelector(".logo").getAttribute("alt");
    //console.log(title);
    //Nodelist containing year of the video
    var yearElement = document.querySelectorAll('.jawBone .jawbone-overview-info .meta .year');

    //if yearElement has no members, returns undefined
    if (yearElement.length === 0){
        console.log('YearElement Not found');
        return;
    }
    var year = yearElement[yearElement.length - 1].textContent;
        console.log(year + ":" + title);
    /*var divId = getDivId(title, year);
    var divEl = document.getElementById(divId);
    If rating has already been added for this element, it exits the function
    if (divEl && (divEl.offsetWidth || divEl.offsetHeight || divEl.getClientRects().length)) {
        console.log(title + "I exist, so I exited");
        return;
    }*/

    var existingImdbRating = window.sessionStorage.getItem(title + ":" + year);
    //console.log(existingImdbRating);

    if ((existingImdbRating !== "undefined") && (existingImdbRating !== null)) {    
        addIMDBRating(existingImdbRating, title, year);
    } else {
        makeRequestAndAddRating(title, year)
    }
};

//parses imdbMetaDeta, creates a div with rating and votecount info, and adds it to the DOM
function addIMDBRating(imdbMetaData, name, year) {
    var divId = getDivId(name, year);
    //console.log(divId);
    var divEl = document.getElementById(divId);
    //If rating has already been added for this element, it exits the function
    if (divEl && divEl.getClientRects().length) {
        return;
    }

    var synopsises = document.querySelectorAll('.jawBone .synopsis');
    if (synopsises.length) {
        var synopsis = synopsises[synopsises.length - 1];
        var div = document.createElement('div');

        var imdbRatingPresent = imdbMetaData && (imdbMetaData !== 'undefined') && (imdbMetaData !== "N/A");

        var imdbVoteCount = null;
        var imdbRating = null;
        var imdbId = null;
        if (imdbRatingPresent) {
            var imdbMetaDataArr = imdbMetaData.split(":");
            imdbRating = imdbMetaDataArr[0];
            imdbVoteCount = imdbMetaDataArr[1];
            imdbId = imdbMetaDataArr[2];
        }

        var imdbHtml = null;
        if((imdbRating!=="undefined")||(imdbVoteCount!=="undefined")){
           imdbHtml = 'IMDb rating : ' + "<strong>" + (imdbRatingPresent  ? imdbRating : "N/A")+"</strong>" +"<br>" + "Vote Count : " +"<strong>" + (imdbVoteCount ?  imdbVoteCount : "N/A")+"</strong>";
       }else{
        imdbHtml = "IMDb rating : <strong>Rare_Issue</strong> <br> Vote Count : <strong>Rare_issue</strong> ";
    }

    if (imdbId !== null && (imdbId !== 'undefined')) {
        imdbHtml = "<a style='color:#f3ce13;' target='_blank' href='https://www.imdb.com/title/" + imdbId + "'>" + imdbHtml + "</a>";
    }
    div.style.color = "#f3ce13";
    div.innerHTML = imdbHtml;
    div.className = 'imdbRating';
    div.id = divId;
    synopsis.parentNode.insertBefore(div, synopsis);
}
}//Creates an Id for the Div that will contain the rating information. Used later on to reduce multiple rating inputs
function getDivId(name, year) {
    name = name.replace(/[^a-z0-9\s]/gi, '');
    name = name.replace(/ /g, '');
    return "aaa" + name + "_" + year;
}

//Makes API call, gets metadata about move/show and calls addImdbRating
function makeRequestAndAddRating(name, year) {

    var url = "https://www.omdbapi.com/?i=tt3896198&apikey=70106a0a" + "&t=" +encodeURI(name)
    + "&y=" + year + "tomatoes=true";


    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.withCredentials = true;
    //xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var apiResponse = JSON.parse(xhr.responseText);
            //var metaScore= apiResponse["metaScore"];  
            var imdbRating = apiResponse["imdbRating"];
            var imdbVoteCount = apiResponse["imdbVotes"];
            var imdbId = apiResponse["imdbID"];
            var imdbMetaData = imdbRating + ":" + imdbVoteCount + ":" + imdbId;
            window.sessionStorage.setItem(name + ":" + year, imdbMetaData);
           // window.sessionStorage.setItem("metaScore:" + name + ":" + year, metaScore)
            //window.sessionStorage.setItem("rotten:" + name + ":" + year, rottenRating);
            addIMDBRating(imdbMetaData, name, year);
           // addRottenRating(rottenRating, name, year);
           // addMetaScore(metaScore, name, year);
       }
   };
   xhr.send();
}
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
var myEfficientFn = debounce(fetchMovieNameYear, 0);
window.addEventListener('MutationEvent', myEfficientFn);
//Calls fetchMovieNameYear when the user clicks the chevron on the video thumbnail
if (window.sessionStorage !== "undefined") {
    var target = document.body;
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {

        myEfficientFn();

    });
    // configuration of the observer:
    var config = {
        attributes: true,
        childList: true,
        characterData: true
    };
    observer.observe(target, config);
}
