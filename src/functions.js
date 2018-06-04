function searchForMovies(){
  let searchString = document.getElementById("searchInput").value;
  if (searchString.length === 0){
    document.getElementById("errors").innerHTML = "<p class='error'> Please enter a search term!</p>";
  }
  else{
    let results = getResults(searchString);
  }
}

function getResults(searchString){

}
