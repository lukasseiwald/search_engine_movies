var solr = require('solr-client')

var client = solr.createClient('localhost', '8983', 'gettingstarted');

var query = client.createQuery()
				  .q('1902')
				  .dismax()
				  .qf({ prim_txt_en: 0.8, start_year_txt_en: 0.2})
				  .mm(2)
				  .start(0)
				  .rows(100);

client.search(query,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);
   }
});


var query2 = client.createQuery()
				  .q('clwn')


client.spell(query2,function(err,obj){
   if(err){
   	console.log(err);
   }else{
   	console.log(obj);
   }
});


function createClient(host, port, core){
  var options = (typeof host === 'object') ? host : {
      host : host,
      port : port,
      core : core
   };
  return new Client(options);
}
