window.addEventListener("load", function () {
  document.getElementById("work-area").setAttribute("contenteditable", "true");
});

function format(command, value) {
  document.execCommand(command, false, value);
}

function addDropdown(dropdownId) {
  let dropdown = document.getElementById(dropdownId),
    dropdowns = document.querySelectorAll("[class*=dropdown]");

  if (dropdowns.length > 0) {
    for (let i = 0; i <= dropdowns.length - 1; i++) {
      if (dropdowns[i] != dropdown) {
        dropdowns[i].className = "hidden";
      }
    }
  }

  if (dropdown.className == dropdownId) {
    dropdown.className = "hidden";
  } else {
    dropdown.className = dropdownId;
  }
}

rangy.init();

//Makes appliers with class name in ColorObject object
function makeColorAppliers(ColorObject, classesNumber, colorName) {
  let number = 0;
  while (number <= classesNumber) {
    let className = "text-" + colorName.toLowerCase() + number;
    ColorObject[colorName].Text[number] = rangy.createClassApplier(className);

    className = "background-" + colorName.toLowerCase() + number;
    ColorObject[colorName].Background[number] = rangy.createClassApplier(
      className
    );
    number++;
  }
}

let classesNumber = 4,
  ColorAppliers = {},
  colors = ["Black", "Red", "Orange", "Yellow", "Green", "Blue", "Violet"];

//Add Text and Background objects to all colors
for (let i = 0; i <= colors.length - 1; i++) {
  ColorAppliers[colors[i]] = {};
  ColorAppliers[colors[i]]["Text"] = {};
  ColorAppliers[colors[i]]["Background"] = {};
}

//Make color appliers for colors in array
for (let i = 0; i <= colors.length - 1; i++) {
  makeColorAppliers(ColorAppliers, classesNumber, colors[i]);
}

let capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

//Toggle class to selected text
function addColor(color, type, number) {
  color = capitalizeFirstLetter(color);
  type = capitalizeFirstLetter(type);
  ColorAppliers[color][type][number].toggleSelection();
  clearExtraClasses();
}

//Options to surround text with specific tag
let Options = {
  Strong: { elementTagName: "strong" },
  U: { elementTagName: "u" },
  Em: { elementTagName: "em" },
  Strike: { elementTagName: "strike" },
  A: { elementTagName: "a" },
  Sup: { elementTagName: "sup" },
  Sub: { elementTagName: "sub" },
};

let TagAppliers = {
  Strong: rangy.createClassApplier("strong", Options["Strong"]),
  U: rangy.createClassApplier("underlined", Options["U"]),
  Em: rangy.createClassApplier("emphasized", Options["Em"]),
  Strike: rangy.createClassApplier("strike", Options["Strike"]),
  A: rangy.createClassApplier("anchor", Options["A"]),
  Sup: rangy.createClassApplier("superscript", Options["Sup"]),
  Sub: rangy.createClassApplier("subscript", Options["Sub"]),
};

let backgroundHighlightApplier = rangy.createClassApplier("background-yellow0");

//Add tag to selected text
let time = 0;
function addTag(tagName, url) {
  tagName = capitalizeFirstLetter(tagName);
  TagAppliers[tagName].toggleSelection();
  if (url) {
    let anchors = document.querySelectorAll("[class=anchor]"),
      url = document.getElementById("url");
    for (let i = 0; i < anchors.length; i++) {
      anchors[i].href = url.value;
      anchors[i].className = anchors[i].className + time;
    }
    time++;
    url.value = "";
  }
}

function findChild(element, parent) {
  while (element.parentElement != parent) {
    element = element.parentElement;
  }

  child = element;
  return child;
}

function replaceContainerTag(tag) {
  var tag = tag.toUpperCase();
  let selection = document.getSelection(),
    range = selection.getRangeAt(0),
    mainContainer = document.getElementById("work-area"),
    wrongContainer = document.getElementById("sample-toolbar"),
    firstNode = selection.anchorNode,
    lastNode = selection.focusNode;
  if (
    firstNode.nodeName == "#text" &&
    range.commonAncestorContainer != wrongContainer
    // && lastNode != mainContainer
  ) {
    let firstSelectedElement = firstNode,
      lastSelectedElement = lastNode,
      startElement = range.startContainer,
      endElement = range.endContainer;

    if (
      firstSelectedElement != startElement &&
      lastSelectedElement != endElement
    ) {
      firstSelectedElement = lastNode;
      lastSelectedElement = firstNode;
    }

    lastSelectedElement = findChild(lastSelectedElement, mainContainer);
    firstSelectedElement = findChild(firstSelectedElement, mainContainer);

    let p = [],
      pCounter = 0,
      tagData = {
        tagName: tag,
        tagCounter: 0,
        selectedTags: [],
      };

    do {
      if (firstSelectedElement.tagName == tagData.tagName) {
        p[pCounter] = firstSelectedElement;
        pCounter++;
      } else {
        tagData.selectedTags[tagData.tagCounter] = firstSelectedElement;
        tagData.tagCounter++;
      }
      firstSelectedElement = firstSelectedElement.nextSibling;
    } while (
      firstSelectedElement.nextSibling != lastSelectedElement.nextElementSibling
    );

    if (pCounter != 0) {
      for (let i = 0; i <= pCounter - 1; i++) {
        replaceElement(p[i], "p");
      }
    }
    if (tagData.tagCounter != 0) {
      for (let i = 0; i <= tagData.tagCounter - 1; i++) {
        replaceElement(tagData.selectedTags[i], tagData.tagName);
      }
    }

    selection.empty();

    if (tag == "PRE") {
      clearTagsAtPreContainer();
      init();
      removeSpellcheck();
      highlightNumbers();
      highlightKeywords();
    }
  }
}

function highlightPre() {
  setTimeout(function() {
    highlightNumbers();
    highlightKeywords();
    console.log("Hi!");
    // this.selectionStart = this.selectionEnd = this.value.length;
  }, 1000);
}

function init() {
  var elements = document.querySelectorAll("pre:not([spellcheck])");
  document.addEventListener("keydown", highlightPre, true);
  for (var i = 0; i <= elements.length - 1; i++) {
    var element = elements[i];
    element.addEventListener("keydown", highlightPre, true);
    console.log(element);
  }
}


function addContainerClass(className) {
  let selection = document.getSelection(),
    range = selection.getRangeAt(0),
    wrongContainer = document.getElementById("sample-toolbar"),
    firstNode = selection.anchorNode,
    lastNode = selection.focusNode;
  if (
    firstNode.nodeName == "#text" &&
    range.commonAncestorContainer != wrongContainer
  ) {
    let mainContainer = document.getElementById("work-area"),
      firstSelectedElement = firstNode,
      lastSelectedElement = lastNode,
      startElement = range.startContainer,
      endElement = range.endContainer;

    if (
      firstSelectedElement != startElement &&
      lastSelectedElement != endElement
    ) {
      firstSelectedElement = lastNode;
      lastSelectedElement = firstNode;
    }

    lastSelectedElement = findChild(lastSelectedElement, mainContainer);
    firstSelectedElement = findChild(firstSelectedElement, mainContainer);

    do {
      if (firstSelectedElement.className == className) {
        firstSelectedElement.className = "";
      } else {
        firstSelectedElement.className = className;
      }
      firstSelectedElement = firstSelectedElement.nextSibling;
    } while (
      firstSelectedElement.nextSibling != lastSelectedElement.nextElementSibling
    );
  }
}

clearExtraSpaces = (string) => string.replace(/\s+/g, " ");

function clearExtraClasses() {
  let classes = document.querySelectorAll("[class*=text-]");

  for (let i = 0; i < classes.length; i++) {
    let classElement = classes[i],
      className = () => classes[i].className,
      namesInClass = () => className().split(" "),
      lastNamesInClass = namesInClass();

    (function ClearText() {
      classElement.className = className().trim();
      classElement.className = clearExtraSpaces(className());
    })();

    let textClassesAmount = 0,
      backgroundClassesAmount = 0,
      textBeginning = "text-",
      backgroundBeginning = "background-";
    for (let j = 0; j <= lastNamesInClass.length - 1; j++) {
      if (
        lastNamesInClass[j].substring(0, textBeginning.length) == textBeginning
      ) {
        textClassesAmount++;
      } else if (
        lastNamesInClass[j].substring(0, backgroundBeginning.length) ==
        backgroundBeginning
      ) {
        backgroundClassesAmount++;
      }
    }

    deleteExtraClasses(textClassesAmount, "text-");
    deleteExtraClasses(backgroundClassesAmount, "background-");

    classElement.className = lastNamesInClass.join(" ");
  }
}

function deleteExtraClasses(classesAmount, classBeginning) {
  for (let j = 0; j <= classesAmount - 2; j++) {
    if (
      lastNamesInClass[j].substring(0, classBeginning.length) == classBeginning
    ) {
      lastNamesInClass.splice(j, 1);
      classesAmount--;
      j--;
    }
  }
}

function replaceElement(source, newType) {
  // Create the document fragment
  const frag = document.createDocumentFragment();
  // Fill it with what's in the source element
  while (source.firstChild) {
    frag.appendChild(source.firstChild);
  }
  // Create the new element
  const newElem = document.createElement(newType);
  // Empty the document fragment into it
  newElem.appendChild(frag);
  // Replace the source element with the new element on the page
  let parentNode = source.parentNode;

  parentNode.replaceChild(newElem, source);
}

function highlightKeywords() {
  let preList = document.getElementsByTagName("PRE"),
    words = ["for", "while", "var", "and", "is"];

  for (let i = 0; i <= preList.length - 1; i++) {
    let pre = preList[i];
    // preInner = pre.innerHTML;
    for (let j = 0; j <= words.length - 1; j++) {
      let word = words[j],
        regExp = new RegExp('\\b' + word + '\\b', "gi"),
        replacing = "<span class=pre-keyword>" + word + "</span>";
      replacedInner = pre.innerHTML.replace(regExp, replacing);
      pre.innerHTML = replacedInner;
    }
  }
  
}

function clearTagsAtPreContainer() {
  let preList = document.getElementsByTagName("PRE");
  for (let i = 0; i <= preList.length - 1; i++) {
    let preListTextContent = preList[i].textContent;
    preList[i].innerHTML = preListTextContent;
  }
}

function highlightNumbers() {
  let pres = document.getElementsByTagName("PRE");

  for (let i = 0; i <= pres.length - 1; i++) {
    let pre = pres[i],
      preInnerHTML = pre.innerHTML,
      matches = preInnerHTML.match(/(\b\d+\b)/g),
      whole = "";

    if (matches != null) {
      for (let j = 0; j <= matches.length - 1; j++) {
        let match = matches[j],
          startIndexOfMatch = preInnerHTML.indexOf(match),
          endIndexOfMatch = startIndexOfMatch + match.length,
          partOfInner = preInnerHTML.slice(0, endIndexOfMatch),
          restOfInner = preInnerHTML.slice(
            endIndexOfMatch,
            preInnerHTML.length
          ),
          replacing = "<span class=pre-number>" + match + "</span>",
          replacedPartOfInner = "";

        preInnerHTML = restOfInner;
        replacedPartOfInner = partOfInner.replace(match, replacing);
        whole = whole.concat(replacedPartOfInner);
      }
      pre.innerHTML = whole.concat(preInnerHTML);
    }
  }
}

function removeSpellcheck() {
  let pres = document.querySelectorAll("pre:not([spellcheck])");
  for (let i = 0; i <= pres.length - 1; i++) {
    let pre = pres[i];
    pre.setAttribute("spellcheck", "false");
  }
}

tests = () => {
  // console.log(document.getSelection());
  // console.log(document.getSelection().getRangeAt(0));
};

// function eventTest() {
//   console.log("hiii!");
// }

// element = document.getElementById("butt");
// element.addEventListener("click", eventTest, false);
