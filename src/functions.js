function searchForMovies(){
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

function displayResults(results, searchString){

  let html = "";

  html += `${results.length} results found for ${searchString}`;

  document.getElementById("results").innerHTML = html;
}

function displayProposals(proposals){
  let html = "Did you mean: ";

  for (let entry of proposals){
    html +=`<a href='#'>${entry}</a> `;
  }

  document.getElementById("proposals").innerHTML = html;

}

function getResults(searchString){

}

function getProposals(searchString){

}
