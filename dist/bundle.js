/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	__webpack_require__(3);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var fs = __webpack_require__(4);

	window.searchForMovies = function () {
	  var searchString = document.getElementById("searchInput").value;
	  if (searchString.length === 0) {
	    document.getElementById("errors").innerHTML = "<p class='error'> Please enter a search term!</p>";
	  } else {
	    document.getElementById("errors").innerHTML = "";
	    var results = getResults(searchString);
	    var proposals = getProposals(searchString);

	    results = ["hi", "nooo", "what"];
	    proposals = ["oder das", "oder das"];

	    displayResults(results, searchString);
	    displayProposals(proposals);
	  }
	};

	window.displayResults = function (results, searchString) {

	  var html = "";
	  html += "<p>" + results.length + " results found </p>";

	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var entry = _step.value;

	      html += "<div class=\"result\"> Title: " + entry + " </div>";
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  document.getElementById("results").innerHTML = html;
	};

	window.displayProposals = function (proposals) {
	  var html = "Did you mean: ";
	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = proposals[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var entry = _step2.value;

	      html += "<a href='#' onclick='proposedSearch(\"" + entry + "\")'>" + entry + "</a> ";
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }

	  document.getElementById("proposals").innerHTML = html;
	};

	window.proposedSearch = function (searchString) {
	  document.getElementById("searchInput").value = searchString;
	  searchForMovies();
	};

	window.getResults = function (searchString) {};

	window.getProposals = function (searchString) {};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	

/***/ })
/******/ ]);