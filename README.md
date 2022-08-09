# rr-search-tries
Trie-based search methods for JavaScript.

## Sample Code

Using rr-search-tries.js


```javascript
// Create instance of the searcher class.
var mysearcher = new searcher();

//Add search target words.
mysearcher.addWord("fox");
mysearcher.addWord("foxes");
mysearcher.addWord("cat");

//The search target senence.
var source = "Is there a fox? No, there are no foxes, but there is a cat.";

//Returns an object of the words found and a list of indicies where they exist in the source string.
console.log(mysearcher.getSearchResults(source));

//Returns an array of the search results and their indicies, in the order in which they appear in the source string.
console.log(mysearcher.getSearchResultsAsSequence(source));

//Returns an object of the words found and the number of times that they occur in the source string.
console.log(mysearcher.getSearchResultsAsCounts(source));

//Returns true if at least one of the target words exists in the source string. Otherwise, returns false.
console.log(mysearcher.hasAtLeastOne(source));

//Note: Despite "fox" being a substring of "foxes", only foxes is returned as a result in this case.

//wholeWordsOnly 
//By default, the wholeWordsOnly argument is false (as in the above examples)

//Here are some examples in which wholeWordsOnly is set to true. In these cases, target words that are substrings of other words are ignored.

source = "There is a cat. There are no categories. Does the fox dance the foxtrot? Do the cats dance the foxtrot?";

//Returns an object of the words found and a list of indicies where they exist in the source string.
console.log("\nwholeWordsOnly = false");
console.log(mysearcher.getSearchResults(source));
console.log("\nwholeWordsOnly = true");
console.log(mysearcher.getSearchResults(source, true));

//Returns an array of the search results and their indicies, in the order in which they appear in the source string.
console.log("\nwholeWordsOnly = false");
console.log(mysearcher.getSearchResultsAsSequence(source));
console.log("\nwholeWordsOnly = true");
console.log(mysearcher.getSearchResultsAsSequence(source, true));

//Returns an object of the words found and the number of times that they occur in the source string.
console.log("\nwholeWordsOnly = false");
console.log(mysearcher.getSearchResultsAsCounts(source));
console.log("\nwholeWordsOnly = true");
console.log(mysearcher.getSearchResultsAsCounts(source, true));

//Returns true if at least one of the target words exists in the source string. Otherwise, returns false.
console.log("\nwholeWordsOnly = false");
console.log(mysearcher.hasAtLeastOne(source));
console.log("\nwholeWordsOnly = true");
console.log(mysearcher.hasAtLeastOne(source, true));



```
