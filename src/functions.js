var solr = require('solr-client')
var client = solr.createClient('localhost', '8983', 'gettingstarted');
var count = require('word-count')
var SolrQueryBuilder = require('solr-query-builder')
var qb = new SolrQueryBuilder();

document.getElementById("searchInput").addEventListener("keyup", function(event){
  console.log("key click")
  event.preventDefault();
  if (event.keyCode === 13) {
    searchForMovies();
  }
});


window.searchForMovies = function(){
  let tmp = document.getElementById("prop");

  if (tmp != null){
    tmp.remove()
  }

  let searchString = document.getElementById("searchInput").value;
  //get checked genres
  const checkBoxes = document.getElementsByName("genres");
  let genres = [];
  checkBoxes.forEach(box => {
    if(box.checked == true){
      genres.push(box.value);
    }
  })

  if (searchString.length === 0 && checkBoxes.length === 0){
    document.getElementById("errors").innerHTML = "<p class='error'> Please enter a search term!</p>";
  }
  else{
    let proposals = getProposals(searchString)
    proposals.then(function(value){
      displayProposals(value)
    })

    document.getElementById("errors").innerHTML = "";
    let results = getResults(searchString, genres);
  }
}

window.displayResults = function(results, searchString){
  console.log(results)

  let html = "";

  if (results.length == 0 ){
    html += `
      <div class="result">
        Couldn't find any results for <b> "${searchString}" </b>
      </div>`
  }
  else{
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
  console.log(html);
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

window.getResults = function(searchString, genres){
  var opt = {
    searchTerms: searchString.split(" ").filter(v=>v!=""),
    genresTerms: genres
  };

  console.log(opt.searchTerms)
  if (opt.searchTerms.length != 0) {
    opt.searchTerms.forEach(term => {
      qb.where('prim_txt_en').equals(term)
      qb.where('orig_txt_en').equals(term)
    })
    if(opt.genresTerms.length != 0) {
      opt.genresTerms.forEach(term => {
        qb.where('genres_txt_sort').equals(term)
      })
    }
  }
  else {
    qb.where('prim_txt_en').equals("")
  }


  console.log(qb.build())

  var query = client.createQuery()
          .q(qb.build())
          .qf({ prim_txt_en: 0.8, orig_txt_en: 0.8, start_year_txt_en: 0.2, genres_txt_sort: 0.2 })
          .start(0)
          .rows(100);

  qb = new SolrQueryBuilder();
  
          // .q({prim_txt_en : searchString , orig_txt_en : searchString})
          // .qf({ prim_txt_en: 0.8, orig_txt_en: 0.8, start_year_txt_en: 0.2, genres_txt_sort: 0.2 })
          // .start(0)
          // .rows(100);
  client.search(query,function(err,obj){
     if(err){
      console.log(err);
     }else{
       console.log(obj.response.docs)
        displayResults(obj.response.docs, searchString);
        return obj.response.docs;
     }
  });
}

window.getProposals = function(searchString) {
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

window.toggleFilterBox = function() {
  let box = document.getElementById("genre")
  let boxState = box.style.display
  if(boxState == "none") {
    box.style.display = "block";
  }
  else {
    box.style.display = "none";
  }
}

window.toggleCheck = function(box) {
  if(box.checked == true) {
    box.setAttribute("checked", "checked");
    box.checked = true;
  }
  else {
    box.removeAttribute("checked");
    box.checked = false;
  }
}