var solr = require('solr-client') //for sending query to solr
var client = solr.createClient('localhost', '8983', 'gettingstarted'); //configure dolr client
var SolrQueryBuilder = require('solr-query-builder') //helping to build query string
var sw = require('stopword') //removing stopwords
var qb = new SolrQueryBuilder();


//if user presses enter in input field -> start search and prevent site reload:
document.getElementById("searchInput").addEventListener("keyup", function(event){
  event.preventDefault();
  if (event.keyCode === 13) {
    searchForMovies();
  }
});


//function is triggered when the user presses the search button or presses enter in search field:
window.searchForMovies = function(){
  let tmp = document.getElementById("prop"); //displayed suggestions
  if (tmp != null){ //if there are suggestions -> remove them
    tmp.remove()
  }
  let searchStringArrayOld = document.getElementById("searchInput").value //the user input
  searchStringArrayOld = searchStringArrayOld.split(' '); //splitting strin into array 
  let searchStringArrayNew = sw.removeStopwords(searchStringArrayOld); //removing stopwords like (the, of, a)...
  let searchString = searchStringArrayNew.join(' '); //join array back to a string

  //get checked genres:
  const checkBoxes = document.getElementsByName("genres");
  let genres = [];
  checkBoxes.forEach(box => { //get all checked genres
    if(box.checked == true){
      genres.push(box.value);
    }
  })

  if (searchString.length === 0 && checkBoxes.length === 0){ //when the user searches for nothing
    document.getElementById("errors").innerHTML = "<p class='error'> Please enter a search term!</p>";
  }

  else{ //user searches for something
    let proposals = getProposals(searchString) //get all the suggestions for the user input string
    proposals.then(function(value){
      displayProposals(value) //display those suggestions in html
    })

    document.getElementById("errors").innerHTML = ""; //get rid of any previous errors
    let results = getResults(searchString, genres); //gets results and triggers displayResults
  }
}

window.displayResults = function(results, searchString){ //display result in html
  let html = "";

  if (results.length == 0 ){ //nothing found
    html += `
      <div class="result">
        Couldn't find any results for <b> "${searchString}" </b>
      </div>`
  }
  else{ //something found -> display result
    for (var i = 0; i < results.length; i++){
      html += `
        <div class="result">
          <h2 class="resultTitle">${results[i].prim_txt_en}</h2>
          <h2 class="resultTitleOrig">"${results[i].orig_txt_en}"</h2>
          <p class="resultYear">${results[i].start_year_txt_en}</p>
          <hr>
          <div class="genreWrapper">`
            results[i].genres_txt_sort.forEach(function(genre) {
                html += `<p class="resultGenre">${genre}</p>`
            });
      html +=`</div></div>`;
    }
  }
  document.getElementById("results").innerHTML = html;
}

window.displayProposals = function(proposals){ //if suggestions where found -> display all of them
  if(proposals != null){
    let html = "<span id='prop'> Did you mean: ";
    for (let entry of proposals){
      html +=`<a href='#' onclick='proposedSearch("${entry.word}")'>${entry.word}</a> `;
    }
    html += "</span>"
    document.getElementById("proposals").innerHTML = html;
  }
}

window.proposedSearch = function(searchString){ //if user clicks on one of the suggestions on the website -> trigger search for this word
  document.getElementById("searchInput").value = searchString;
  searchForMovies();
}

window.getResults = function(searchString, genres){ //get results from solr
  var opt = { //options for solr query builder
    searchTerms: searchString.split(" ").filter(v=>v!=""), //each term
    genresTerms: genres
  };

  if (opt.searchTerms.length != 0) { //search terms not empty
    opt.searchTerms.forEach(term => { //each term has to be in one of the following fields:
      qb.begin()
            .where('prim_txt_en').in(term) //check if in this field
            .or()
            .begin()
              .where('orig_txt_en').in(term) //check if in this field
            .end()
            .or()
            .begin()
              .where('start_year_txt_en').in(term) //check if in this field
            .end()
            .or()
            .begin()
              .where('genres_txt_sort').in(term) //check if in this field
            .end()
          .end();
    })

    if(opt.genresTerms.length != 0) { //if the user has selected filter options
      opt.genresTerms.forEach(term => {
        qb.where('genres_txt_sort').equals(term) //the result must contain an entry in this field
      })
    }
  }
  else { //user searched for nothing
    qb.where('prim_txt_en').equals("")
  }

  var query = client.createQuery() //create complete query for solr
          .q(qb.build()) //query builded before
          .qf({ prim_txt_en: 0.8, orig_txt_en: 0.8, start_year_txt_en: 0.2}) //different field-weights
          .start(0)
          .rows(100); //display 100 rows

  qb = new SolrQueryBuilder(); //reset query

  client.search(query,function(err,obj){ //search in solr for the query
     if(err){
      console.log(err);
     }
     else{ //if solr is able to get connection and results:
        displayResults(obj.response.docs, searchString); //display results
     }
  });
}

window.getProposals = function(searchString) { //get suggestions for the user entered term
  return new Promise(function(resolve, reject){
    var query = client.createQuery()
            .q(searchString) //lookup suggestions for the user input
    client.spell(query,function(err,obj){ //.spell enables the spellcheck and /spell
       if(err){
         console.log(err);
       }
       else{ //if solr is able to get connection and results for the suggestions:
         if (obj.spellcheck.suggestions[1] != undefined){ //if results are found -> display them
          resolve(obj.spellcheck.suggestions[1].suggestion);
        }
        else{
          resolve(null);
        }
       }
    });
  })}

window.toggleFilterBox = function() { //diplay filter box on user click on filter
  let box = document.getElementById("genre")
  let boxState = box.style.display
  if(boxState == "none") {
    box.style.display = "block";
  }
  else {
    box.style.display = "none";
  }
}

window.toggleCheck = function(box) { //toggle checkboxes (switch checked on and off)
  if(box.checked == true) {
    box.setAttribute("checked", "checked");
    box.checked = true;
  }
  else {
    box.removeAttribute("checked");
    box.checked = false;
  }
}
