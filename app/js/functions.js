var curl = require('curl')


window.searchForMovies = function(){
  let searchString = document.getElementById("searchInput").value;
  if (searchString.length === 0){
    document.getElementById("errors").innerHTML = "<p class='error'> Please enter a search term!</p>";
  }
  else{
    document.getElementById("errors").innerHTML = "";
    let results = getResults(searchString);
    let proposals = getProposals(searchString);

    results = ["hi", "nooo", "what"];
    proposals = ["oder das", "oder das"];

    displayResults(results, searchString);
    displayProposals(proposals);

  }
}

window.displayResults = function(results, searchString){

  let html = "";
  html += `<p>${results.length} results found </p>`

  for (let entry of results){
    html += `<div class="result"> Title: ${entry} </div>`;
  }
  document.getElementById("results").innerHTML = html;
}

window.displayProposals = function(proposals){
  let html = "Did you mean: ";
  for (let entry of proposals){
    html +=`<a href='#' onclick='proposedSearch("${entry}")'>${entry}</a> `;
  }
  document.getElementById("proposals").innerHTML = html;

}

window.proposedSearch = function(searchString){
  document.getElementById("searchInput").value = searchString;
  searchForMovies();
}

window.getResults = function(searchString){

}

window.getProposals = function(searchString){

}
