/* PAGE INITIALIZATION FUNCTIONS */
var addEvent = function(obj, type, fn) { //http://www.ilfilosofo.com/blog/2008/04/14/addevent-preserving-this/
  if (obj.addEventListener) {
    obj.addEventListener(type, fn, false);
  } else if (obj.attachEvent) {
    obj.attachEvent('on' + type, function() { return fn.apply(obj, new Array(window.event));});
  }
}
addEvent(window, 'load', preProcessPage);


function preProcessPage() {
	if (!document.getElementsByTagName || (!document.getElementById || (!document.createElement || !document.createTextNode))) return false;
	processPage();
}

function processPage() {
  processLinks();
}

/* INDIVIDUAL ELEMENT INITIALIZATIONS */
function processLinks() {
  var allLinks = document.getElementsByTagName("a");
  var fixLink = function(theElement) {
    removeClass(theElement,"js_scriptHide");
    removeClass(theElement,"js_scriptShow");
    if (hasClassHook(theElement)) {
      if(/js_doPopup/.test(theElement.className)) {
        theElement.onclick = function() {
          var newWin = window.open(this.href);
          return false;
        }
      }
      if (/js_hoverSwap/.test(theElement.className)) {
        theElement.onmouseover = function() {
          hoverSwap(this,'over');
        }
        theElement.onmouseout = function() {
          hoverSwap(this,'out');
        }
        doSwapPreload(theElement);
      }
      if (/js_returnFalse/.test(theElement.className)) {
        theElement.onclick = function() {
          return false;
        }
      }
    }
  }
  forEach(allLinks,fixLink);
}

/* UTILITY FUNCTIONS */
function doSwapPreload(theLink) {
  var linkImage = theLink.getElementsByTagName('img')[0];
  if (linkImage.className && (/js_mouseOver/.test(linkImage.className))) {
    var currentFile = linkImage.src.split('/').pop();
    var toggleElements = currentFile.split('.');
    var currentName = toggleElements[0];
    var currentExtension = toggleElements[1];
    toggleName = getExtensionFromClass(linkImage,'js_mouseOver_');
    var preloadImage = new Image();
    var newSrc = linkImage.src.replace(currentFile,toggleName + '.' + currentExtension);
    preloadImage.src = newSrc;
  }
}

function hoverSwap(theLink,theEvent) {
  var linkImage = theLink.getElementsByTagName('img')[0];
  if (linkImage.className && ((/js_mouseOver/.test(linkImage.className)) && (/js_mouseOut/.test(linkImage.className)))) {
    var currentFile = linkImage.src.split('/').pop();
    var toggleElements = currentFile.split('.');
    var currentName = toggleElements[0];
    var currentExtension = toggleElements[1];
    var toggleName = false;
    if (theEvent == 'over') {
      toggleName = getExtensionFromClass(linkImage,'js_mouseOver_');
    } else if (theEvent == 'out') {
      toggleName = getExtensionFromClass(linkImage,'js_mouseOut_');
    }
    if (toggleName != false) {
      var newSrc = linkImage.src.replace(currentFile,toggleName + '.' + currentExtension);
      linkImage.src = newSrc;
    }
  }
}

function forEach(array, action) {
  for (var i=0; i < array.length; i++) {
    action(array[i]);
  }
}

function removeChildNodes(theElement) {
  while (theElement.hasChildNodes()) {
    theElement.removeChild(theElement.firstChild);
  }
}

function getParentElement(theElement, targetNodeName) {
  var bodyNode = document.getElementsByTagName("body")[0];
  var currentParent = theElement;
  var targetNodeName = targetNodeName.toLowerCase();
  while ((currentParent.nodeName.toLowerCase() != targetNodeName) && (currentParent != bodyNode)) {
    currentParent = currentParent.parentNode;
  }
  return currentParent;
}

function stripWhitespace(theString) {
	return theString.replace(/^\s*|\s*$/g,'');
}

function addClass(theElement,theClass) {
	if (!theElement.className) {
		theElement.className = theClass;
	} else if (theElement.className.indexOf(theClass) == -1) {
		theElement.className += (" " + theClass);
	}
}

function removeClass(theElement,theClass) {
  if (theElement.className && theElement.className.indexOf(theClass) != -1) {
    theElement.className = stripWhitespace(theElement.className.replace(theClass,""))
  }
}

function hasClassHook(theElement) {
  return (theElement.className && /js_/.test(theElement.className));
}


function getExtensionFromClass(theElement,theKey) {
	var theExtension = false;
	if (theElement.className) {
    var findExtension = function(thisClass) {
      if (thisClass.indexOf(theKey) == 0) {
        var tempName = thisClass.substring(theKey.length);
        if (tempName.length > 0) {
          theExtension = tempName;
        }
      }
    }
    forEach(theElement.className.split(' '),findExtension);
  }
	return theExtension;
}

function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }
  return [curleft,curtop];
}

function makeUniqueArray(theArray) {
  var cleanArray = new Array();
  for (var i=0; i<theArray.length; i++) {
    var oldItem = theArray[i];
    var matchFound = false;
    for (var j=0; j<cleanArray.length; j++) {
      if (oldItem == cleanArray[j]) {
        matchFound = true;
      }
    }
    if (matchFound == false) {
      cleanArray.push(oldItem);
    }
  }
  return cleanArray;
}

function insertAfter(newElement,targetElement) {
	var parent = targetElement.parentNode;
  if (parent.lastchild == targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}