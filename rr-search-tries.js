/*
Copyright 2022 Rairye
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
function isWhiteSpace(char) {
    var charCodes = new Set([9, 10, 11, 12, 13, 28, 29, 30, 31, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288]);
    return charCodes.has(char.charCodeAt(0));
}
var node = /** @class */ (function () {
    function node(name) {
        this.name = name;
        this.wordEnd = false;
        this.children = {};
    }
    node.prototype.addChild = function (child) {
        this.children[child] = new node(child);
    };
    node.prototype.hasChild = function (child) {
        return this.children.hasOwnProperty(child);
    };
    node.prototype.hasChildren = function () {
        return Object.keys(this.children).length > 0;
    };
    node.prototype.getName = function () {
        return this.name;
    };
    return node;
}());
var trie = /** @class */ (function () {
    function trie() {
        this.trieDict = {};
    }
    trie.prototype.addString = function (word) {
        if (typeof word != "string" || (typeof word == "string" && word.length == 0)) {
            return false;
        }
        var currentNode;
        var wordLength = word.length;
        var startChar = word.charAt(0);
        if (this.trieDict.hasOwnProperty(startChar) == false) {
            this.trieDict[startChar] = new node(startChar);
        }
        currentNode = this.trieDict[startChar];
        if (wordLength == 1) {
            currentNode.wordEnd = true;
            currentNode.targetWord = word;
            return true;
        }
        var i = 1;
        var currentChar;
        while (i < wordLength - 1) {
            currentChar = word.charAt(i);
            if (currentNode.hasChild(currentChar) == false) {
                currentNode.addChild(currentChar);
            }
            currentNode = currentNode.children[currentChar];
            i++;
        }
        currentChar = word.charAt(i);
        if (currentNode.hasChild(currentChar) == false) {
            currentNode.addChild(currentChar);
        }
        currentNode = currentNode.children[currentChar];
        currentNode.wordEnd = true;
        currentNode.targetWord = word;
        return true;
    };
    trie.prototype.deleteString = function (word) {
        if (typeof word != "string" || (typeof word == "string" && word.length == 0)) {
            return false;
        }
        var currentNode;
        var wordLength = word.length;
        var nodeList = [];
        var startChar = word.charAt(0);
        if (this.trieDict.hasOwnProperty(startChar) == false) {
            return false;
        }
        currentNode = this.trieDict[startChar];
        if (wordLength == 1 && currentNode.wordEnd == true) {
            if (currentNode.hasChildren() == true) {
                try {
                    delete this.trieDict[word];
                }
                catch (e) {
                    return false;
                }
                return true;
            }
        }
        else {
            nodeList.push(currentNode);
            var i = 1;
            while (i < wordLength - 1) {
                var nextChar = word.charAt(i);
                if (currentNode.hasChild(nextChar) == false) {
                    return false;
                }
                currentNode = currentNode.children[nextChar];
                nodeList.push(currentNode);
                i++;
            }
            try {
                currentNode = currentNode.children[word.charAt(i)];
            }
            catch (e) {
                return false;
            }
            if (currentNode.wordEnd == true && currentNode.hasChildren() == false) {
                currentNode.wordEnd = false;
                currentNode.targetWord = undefined;
                var deleteLast = null;
                var lastNode = currentNode.getName();
                var nodeCount = nodeList.length;
                while (nodeCount >= 0) {
                    if (deleteLast == true) {
                        try {
                            delete currentNode.children[lastNode];
                        }
                        catch (e) {
                        }
                    }
                    if (currentNode.wordEnd == true) {
                        return true;
                    }
                    deleteLast = currentNode.hasChildren() == false ? true : false;
                    lastNode = currentNode.getName();
                    nodeCount--;
                    currentNode = nodeList[nodeCount];
                }
                if (deleteLast == true) {
                    try {
                        delete this.trieDict[lastNode];
                    }
                    catch (e) {
                        return false;
                    }
                    return true;
                }
            }
            else if (currentNode.wordEnd == true && currentNode.hasChildren() == true) {
                currentNode.wordEnd = false;
                currentNode.targetWord = undefined;
                return true;
            }
            else {
                return false;
            }
            return false;
        }
    };
    trie.prototype.searchKey = function (key) {
        if (this.trieDict.hasOwnProperty(key)) {
            var currentNode = this.trieDict[key];
            return currentNode;
        }
        return false;
    };
    trie.prototype.searchNextKey = function (currentNode, key) {
        if (currentNode.children.hasOwnProperty(key)) {
            currentNode = currentNode.children[key];
            return currentNode;
        }
        return false;
    };
    return trie;
}());
var searcher = /** @class */ (function () {
    function searcher() {
        this.searcherTrie = new trie();
    }
    searcher.prototype.addWord = function (word) {
        return this.searcherTrie.addString(word);
    };
    searcher.prototype.deleteWord = function (word) {
        return this.searcherTrie.deleteString(word);
    };
    searcher.prototype.getSearchResults = function (searchString, wholeWordsOnly) {
        if (wholeWordsOnly === void 0) { wholeWordsOnly = false; }
        var results = {};
        if (typeof searchString != "string" || (typeof searchString == "string" && searchString.length == 0)) {
            return results;
        }
        var start = 0;
        var end = 0;
        var strLength = searchString.length;
        var result = null;
        while (start <= strLength - 1) {
            var key = searchString.charAt(start);
            var nextNode = this.searcherTrie.searchKey(key);
            if (nextNode != false) {
                end = start + 1;
                if (this.searcherTrie.trieDict[key].wordEnd == true) {
                    result = key;
                }
                while (true) {
                    var nextSearchKey = end <= strLength - 1 ? searchString.charAt(end) : null;
                    nextNode = this.searcherTrie.searchNextKey(nextNode, nextSearchKey);
                    if (nextNode != false) {
                        end++;
                        if (nextNode.wordEnd == true) {
                            result = nextNode.targetWord;
                        }
                    }
                    else {
                        var addable = false;
                        var resultEndIndex = null;
                        if (result != null) {
                            resultEndIndex = start + result.length;
                            if (wholeWordsOnly == false) {
                                addable = true;
                            }
                            else {
                                var validStartBoundary = start == 0 ? true : isWhiteSpace(searchString.charAt(start - 1));
                                var validEndBoundary = resultEndIndex == strLength ? true : isWhiteSpace(searchString.charAt(resultEndIndex));
                                if (validStartBoundary == true && validEndBoundary == true) {
                                    addable = true;
                                }
                            }
                        }
                        if (addable == true) {
                            if (results.hasOwnProperty(result) == false) {
                                results[result] = [[start, resultEndIndex]];
                            }
                            else {
                                results[result].push([start, resultEndIndex]);
                            }
                            start = resultEndIndex;
                        }
                        else {
                            start++;
                        }
                        result = null;
                        break;
                    }
                }
            }
            else {
                start++;
            }
        }
        return results;
    };
    searcher.prototype.getSearchResultsAsSequence = function (searchString, wholeWordsOnly) {
        if (wholeWordsOnly === void 0) { wholeWordsOnly = false; }
        var results = [];
        if (typeof searchString != "string" || (typeof searchString == "string" && searchString.length == 0)) {
            return results;
        }
        var start = 0;
        var end = 0;
        var strLength = searchString.length;
        var result = null;
        while (start <= strLength - 1) {
            var key = searchString.charAt(start);
            var nextNode = this.searcherTrie.searchKey(key);
            if (nextNode != false) {
                end = start + 1;
                if (this.searcherTrie.trieDict[key].wordEnd == true) {
                    result = key;
                }
                while (true) {
                    var nextSearchKey = end <= strLength - 1 ? searchString.charAt(end) : null;
                    nextNode = this.searcherTrie.searchNextKey(nextNode, nextSearchKey);
                    if (nextNode != false) {
                        end++;
                        if (nextNode.wordEnd == true) {
                            result = nextNode.targetWord;
                        }
                    }
                    else {
                        var addable = false;
                        var resultEndIndex = null;
                        if (result != null) {
                            resultEndIndex = start + result.length;
                            if (wholeWordsOnly == false) {
                                addable = true;
                            }
                            else {
                                var validStartBoundary = start == 0 ? true : isWhiteSpace(searchString.charAt(start - 1));
                                var validEndBoundary = resultEndIndex == strLength ? true : isWhiteSpace(searchString.charAt(resultEndIndex));
                                if (validStartBoundary == true && validEndBoundary == true) {
                                    addable = true;
                                }
                            }
                        }
                        if (addable == true) {
                            var resultObj = new Object;
                            resultObj[result] = [start, resultEndIndex];
                            results.push(resultObj);
                            start = resultEndIndex;
                        }
                        else {
                            start++;
                        }
                        result = null;
                        break;
                    }
                }
            }
            else {
                start++;
            }
        }
        return results;
    };
    searcher.prototype.getSearchResultsAsCounts = function (searchString, wholeWordsOnly) {
        if (wholeWordsOnly === void 0) { wholeWordsOnly = false; }
        var results = {};
        if (typeof searchString != "string" || (typeof searchString == "string" && searchString.length == 0)) {
            return results;
        }
        var start = 0;
        var end = 0;
        var strLength = searchString.length;
        var result = null;
        while (start <= strLength - 1) {
            var key = searchString.charAt(start);
            var nextNode = this.searcherTrie.searchKey(key);
            if (nextNode != false) {
                end = start + 1;
                if (this.searcherTrie.trieDict[key].wordEnd == true) {
                    result = key;
                }
                while (true) {
                    var nextSearchKey = end <= strLength - 1 ? searchString.charAt(end) : null;
                    nextNode = this.searcherTrie.searchNextKey(nextNode, nextSearchKey);
                    if (nextNode != false) {
                        end++;
                        if (nextNode.wordEnd == true) {
                            result = nextNode.targetWord;
                        }
                    }
                    else {
                        var addable = false;
                        var resultEndIndex = null;
                        if (result != null) {
                            resultEndIndex = start + result.length;
                            if (wholeWordsOnly == false) {
                                addable = true;
                            }
                            else {
                                var validStartBoundary = start == 0 ? true : isWhiteSpace(searchString.charAt(start - 1));
                                var validEndBoundary = resultEndIndex == strLength ? true : isWhiteSpace(searchString.charAt(resultEndIndex));
                                if (validStartBoundary == true && validEndBoundary == true) {
                                    addable = true;
                                }
                            }
                        }
                        if (addable == true) {
                            if (results.hasOwnProperty(result) == false) {
                                results[result] = 1;
                            }
                            else {
                                var currentCount = results[result];
                                results[result] = currentCount + 1;
                            }
                            start = resultEndIndex;
                        }
                        else {
                            start++;
                        }
                        result = null;
                        break;
                    }
                }
            }
            else {
                start++;
            }
        }
        return results;
    };
    searcher.prototype.hasAtLeastOne = function (searchString, wholeWordsOnly) {
        if (wholeWordsOnly === void 0) { wholeWordsOnly = false; }
        if (typeof searchString != "string" || (typeof searchString == "string" && searchString.length == 0)) {
            return false;
        }
        var start = 0;
        var end = 0;
        var strLength = searchString.length;
        var result = null;
        while (start <= strLength - 1) {
            var key = searchString.charAt(start);
            var nextNode = this.searcherTrie.searchKey(key);
            if (nextNode != false) {
                end = start + 1;
                if (this.searcherTrie.trieDict[key].wordEnd == true) {
                    result = key;
                }
                while (true) {
                    var nextSearchKey = end <= strLength - 1 ? searchString.charAt(end) : null;
                    nextNode = this.searcherTrie.searchNextKey(nextNode, nextSearchKey);
                    if (nextNode != false) {
                        end++;
                        if (nextNode.wordEnd == true) {
                            result = nextNode.targetWord;
                        }
                    }
                    else {
                        var returnable = false;
                        var resultEndIndex = null;
                        if (result != null) {
                            resultEndIndex = start + result.length;
                            if (wholeWordsOnly == false) {
                                returnable = true;
                            }
                            else {
                                var validStartBoundary = start == 0 ? true : isWhiteSpace(searchString.charAt(start - 1));
                                var validEndBoundary = resultEndIndex == strLength ? true : isWhiteSpace(searchString.charAt(resultEndIndex));
                                if (validStartBoundary == true && validEndBoundary == true) {
                                    returnable = true;
                                }
                            }
                        }
                        if (returnable == true) {
                            return true;
                        }
                        else {
                            start++;
                        }
                        result = null;
                        break;
                    }
                }
            }
            else {
                start++;
            }
        }
        return false;
    };
    return searcher;
}());
