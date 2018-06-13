# Search engine for movies - Semantic Web Technologies

Team: Denise Buder, Martina Neureiter, Alexander Tischhart, Lukas Seiwald

Verwendung von IMDb Datasets - title.basics: https://www.imdb.com/interfaces/

## Start Vagrant + SOLR

```vagrant up```

```vagrant ssh```

```cd solr-7.3.0```

```bin/solr -e schemaless```

```http://localhost:8983/solr/#/ ```

```falls spellcheck nicht funktionieren sollte (sollte jedoch eigentlich standartmässig funktionieren) - in solr einmal spellcheck.build ausführen (zB in Query spellcheck und spellcheck.build aktivieren und ausführen)```


## CORS in SOLR aktivieren

```solr-7.3.0/server/solr-webapp/webapp/WEB-INF/web.xml mit im Repo enthaltenem web.xml ersetzen```

```SOLR neustarten: wiederhole Schritt "Start Vagrant + SOLR"```

## Load movies-data into SOLR

```npm install```

```node index.js (einfach abbrechen sobald genug filme in SOLR importiert wurden - sonst dauert es ewig)```

## Start Frontend with Server

```npm start```

## nur für development
bundle:
```npm install -g browserify```

für neues bundle ->
bundle.js inhalt löschen

dann: ```browserify src/functions.js > bundle.js```
