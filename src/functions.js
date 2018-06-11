
var solr = require('solr-client')
var client = solr.createClient('localhost', '8983', 'gettingstarted');

window.searchForMovies = function(){

  let tmp = document.getElementById("prop");

  if (tmp != null){
    tmp.remove()
  }

  let searchString = document.getElementById("searchInput").value;
  if (searchString.length === 0){
    document.getElementById("errors").innerHTML = "<p class='error'> Please enter a search term!</p>";
  }
  else{
    document.getElementById("errors").innerHTML = "";
    let results = getResults(searchString);

    let proposals = getProposals(searchString)
    proposals.then(function(value){
      displayProposals(value)
    })

    results = ["hi", "nooo", "what"];
    displayResults(results, searchString);
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
  if(proposals != null){
    let html = "<span id='prop'> Did you mean: ";
    for (let entry of proposals){
      html +=`<a href='#' onclick='proposedSearch("${entry.word}")'>${entry.word}</a> `;
    }
    html += "</span>"
    document.getElementById("proposals").innerHTML = html;
  }
}

window.proposedSearch = function(searchString){
  document.getElementById("searchInput").value = searchString;
  searchForMovies();
}

window.getResults = function(searchString){

}

window.getProposals = function(searchString){
return new Promise(function(resolve, reject){
	var query = client.createQuery()
				  .q(searchString);
	client.spell(query,function(err,obj){
	   if(err){
	   	console.log(err);
	   }else{
       if (obj.spellcheck.suggestions[1] != undefined){
        resolve(obj.spellcheck.suggestions[1].suggestion);
      }
      else{
        resolve(null);
      }
	   }
	});
})}
