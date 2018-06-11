var solr = require('solr-client')
var client = solr.createClient('localhost', '8983', 'gettingstarted');

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
  console.log(genres)

  if (searchString.length === 0){
    document.getElementById("errors").innerHTML = "<p class='error'> Please enter a search term!</p>";
  }
  else{

    let proposals = getProposals(searchString)
    proposals.then(function(value){
      displayProposals(value)
    })
    
    document.getElementById("errors").innerHTML = "";
    let results = getResults(searchString);

  
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
  let box = document.getElementById("filterBox")
  let boxState = box.style.display
  if(boxState == "none") {
    box.style.display = "block";
  }
  else {
    box.style.display = "none";
  }
}

window.toggleCheck = function(box) {
  console.log(box.checked)
  if(box.checked == true) {
    box.setAttribute("checked", "checked");
    box.checked = true;
  }
  else {
    box.removeAttribute("checked");
    box.checked = false;
  }
}
