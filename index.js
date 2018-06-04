tsv = require("node-tsv-json")
const fs = require('fs')
const readline = require('readline')
const stream = require('stream')
const request = require('sync-request')

//parse json
// tsv({
//   input: "source/name.basics.tsv", 
//   output: "movies.json"
//   //array of arrays, 1st array is column names
//   ,parseRows: false
// }, function(err, result) {
//   if(err) {
//     console.error(err);
//   }else {
//     console.log("fertig");
//   }
// });

let documents = []

// read file through fs readstream
const instream = fs.createReadStream('source/movies.json') // video file has to be named 'simplewiki.json'
const outstream = new stream
const rl = readline.createInterface(instream, outstream)

// do this for every line in the stream
rl.on('line', function(line) {
    // only every second line is interesting -> lines starting with index are not interesting
    if(line.substring(0, 8) == '{"index"') return
    else {
        // extract only the relevant properties of the input JSON file
        const lineJson = JSON.parse(line);
        const outJson = []
        
        lineJson.forEach(entry => {
          //console.log(entry)
          console.log("\n")
          const outEntry = {}
          // write relevant properties to output JSON file
          outEntry["prim_txt_en"] = entry.primaryTitle
          outEntry["orig_txt_en"] = entry.originalTitle
          outEntry["adult_txt_en"] = entry.isAdult
          outEntry["start_year_txt_en"] = entry.startYear
          outEntry["end_year_txt_en"] = entry.endYear
          outEntry["genres_txt_sort"] = entry.genres
          //outJson["genres_txt_sort"] = outJson["genres_txt_sort"].split(",")
          // opening_text is optional
          // if(lineJson.opening_text) outJson["opening_txt_en"] = lineJson.opening_text
          // else outJson["opening_txt_en"] = ""
          
          //accumulate JSON objects before they are sent
          outJson.push(outEntry)
        })
        // console.log(outJson)
        outJson.forEach(entry => {
          accumData(entry)
        })
    }
})

// send rest of Data when filestream is over
// otherwise the last <10k Objects are not sent
rl.on('close', function() {
    sendData(documents)
    documents = []
});

// accumulates JSON objects in array until 10k before they are sent
function accumData(postData) {
    documents.push(postData)
    if(documents.length == 1){
        // send array of JSON objects to solr server
        console.log('sending')
        sendData(documents)
        documents = []
    }
}

// sends data to solr server
function sendData(postData){
    var clientServerOptions = {
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    // on response from server, log response
    let response = request('POST', 'http://localhost:8983/solr/gettingstarted/update/json/docs?commit=true&overwrite=true', clientServerOptions);
    if (response.statusCode !== 200) {
      throw(response.body)
    } else {
      console.log('sent')
    }
}