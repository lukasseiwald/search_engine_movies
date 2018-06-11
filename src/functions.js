var solr = require('solr-client')
var client = solr.createClient('localhost', '8983', 'gettingstarted');

window.searchForMovies = function(){
  let searchString = document.getElementById("searchInput").value;
  if (searchString.length === 0){
    document.getElementById("errors").innerHTML = "<p class='error'> Please enter a search term!</p>";
  }
  else{
    document.getElementById("errors").innerHTML = "";
    let results = getResults(searchString);
    let proposals = getProposals(searchString);

    console.log("results1 : " + results);

    proposals = ["oder das", "oder das"];

    //displayResults(results, searchString);
    displayProposals(proposals);
  }
}

window.displayResults = function(results, searchString){
  console.log("results2 : " + results);
  let html = "";

  for (var i = 0; i < results.length; i++){
    html += `
      <div class="result"> 
        <h2 class="resultTitle">${results[i].orig_txt_en}</h2>
        <p class="resultYear">${results[i].start_year_txt_en}</p>
        <hr>
        <div class="genreWrapper">`
          results[i].genres_txt_sort.forEach(function(genre) {
              html += `<p class="resultGenre">${genre}</p>`
          });
    html +=`</div></div>`;
      console.log(results[i].genres_txt_sort[0]);
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
  var query = client.createQuery()
          .q(searchString)
          .dismax()
          .qf({ prim_txt_en: 0.8, start_year_txt_en: 0.2})
          .mm(2)
          .start(0)
          .rows(100);

  client.search(query,function(err,obj){
     if(err){
      console.log(err);
     }else{
        console.log(obj.response.docs);
        displayResults(obj.response.docs, searchString);
        return obj.response.docs;      
     }
  });
}

window.getProposals = function(searchString){

}
