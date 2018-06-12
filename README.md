# Search engine for movies - Semantic Web Technologies

Team: Denise Buder, Martina Neureiter, Alexander Tischhart, Lukas Seiwald

## Start Vagrant

```vagrant up```

```vagrant ssh```

```cd solr-7.3.0```

```bin/solr -e schemaless```

```in solr einmal spellcheck.build ausführen```

```http://localhost:8983/solr/#/ ```

## Install Chrome Plugin: Allow Controll Allow Origin

https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi

## Start Frontend

```npm install```


```npm start```


## für development:
```npm install -g browserify```

für neues bundle ->
bundle.js inhalt löschen

dann: ```browserify src/functions.js > bundle.js```
