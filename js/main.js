window.addEventListener("load", function () {
  let mainContainer = document.getElementById("work-area"),
    nameOfAttribute = "contenteditable",
    valueOfAttribute = "true";

  mainContainer.setAttribute(nameOfAttribute, valueOfAttribute);
});

//Add dropdown class to element with dropdownId
function addDropdown(dropdownId) {
  let dropdown = document.getElementById(dropdownId),
    dropdowns = document.querySelectorAll("[class*=dropdown]"),
    amountOfDropdowns = dropdowns.length,
    dropdownsLastElementIndex = amountOfDropdowns - 1;

  if (amountOfDropdowns > 0) {
    for (let i = 0; i <= dropdownsLastElementIndex; i++) {
      let dropdownElement = dropdowns[i];

      if (dropdownElement !== dropdown) {
        dropdownElement.className = "hidden";
      }
    }
  }
  let classNameOfDropdown = dropdown.className;

  if (classNameOfDropdown === dropdownId) {
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
    let colorNameInLowerCase = colorName.toLowerCase(),
      colorNameWithNumber = colorNameInLowerCase + number,
      textBeginning = "text-",
      backgroundBeginning = "background-",
      className = textBeginning + colorNameWithNumber;

    ColorObject[colorName].Text[number] = rangy.createClassApplier(className);

    className = backgroundBeginning + colorNameWithNumber;

    ColorObject[colorName].Background[number] = rangy.createClassApplier(
      className
    );

    number++;
  }
}

let classesNumber = 4,
  ColorAppliers = {},
  colors = ["Black", "Red", "Orange", "Yellow", "Green", "Blue", "Violet"],
  colorsLastElementIndex = colors.length - 1;

//Add Text and Background objects to all colors
for (let i = 0; i <= colorsLastElementIndex; i++) {
  let color = colors[i],
    nameOfTextObject = "Text",
    nameOfBackgroundObject = "Background";

  ColorAppliers[color] = {};
  ColorAppliers[color][nameOfTextObject] = {};
  ColorAppliers[color][nameOfBackgroundObject] = {};
}

//Make color appliers for colors in array
for (let i = 0; i <= colorsLastElementIndex; i++) {
  let color = colors[i];

  makeColorAppliers(ColorAppliers, classesNumber, color);
}

//Makes first letter upper case
function capitalizeFirstLetter(string) {
  let firstCharacter = string.charAt(0),
    firstCharacterInUpperCase = firstCharacter.toUpperCase(),
    stringWithoutFirstCharacter = string.slice(1);

  string = firstCharacterInUpperCase + stringWithoutFirstCharacter;

  return string;
}

//Makes first letter lower case
function lowerFirstLetter(string) {
  let firstCharacter = string.charAt(0),
    firstCharacterInLowerCase = firstCharacter.toLowerCase(),
    stringWithoutFirstCharacter = string.slice(1);

  string = firstCharacterInLowerCase + stringWithoutFirstCharacter;

  return string;
}

//Clears spaces in the start and end of the text and also between words
var clearExtraSpaces = (string) => {
  let cleanedBetweenWords = string.replace(/\s+/g, " "),
    cleanedAtAll = cleanedBetweenWords.trim(),
    cleanedString = cleanedAtAll;

  return cleanedString;
};

//It deletes repeated classes (what starts with similar text)
function clearClasses(classNameBeginning) {
  let query = "[class*=" + classNameBeginning + "]",
    classes = document.querySelectorAll(query),
    classesAmount = classes.length;

  for (let i = 0; i < classesAmount; i++) {
    let classElement = () => classes[i],
      className = () => classElement().className,
      namesInClass = () => className().split(" "),
      lastNamesInClass = namesInClass();

    classElement.className = clearExtraSpaces(className());

    let length = classNameBeginning.length,
      classesAmount = 0,
      classesIndexes = [],
      k = 0;

    for (
      let j = 0, indexOfLastNameInClass = lastNamesInClass.length - 1;
      j <= indexOfLastNameInClass;
      j++
    ) {
      let name = lastNamesInClass[j],
        partOfName = name.substring(0, length);

      if (partOfName === classNameBeginning) {
        classesIndexes[k] = j;
        classesAmount++;
        k++;
      }
    }

    if (classesAmount !== 1) {
      for (let j = 0; j < classesAmount; j++) {
        let index = classesIndexes[j];

        lastNamesInClass.splice(index, 1);
        classesAmount--;
      }
    }

    let allClasses = lastNamesInClass.join(" ");

    classElement().className = allClasses;
  }
}

//Toggle class to selected text
function addColor(color, type, number) {
  let capitalizedColor = capitalizeFirstLetter(color),
    capitalizedType = capitalizeFirstLetter(type);

  ColorAppliers[capitalizedColor][capitalizedType][number].toggleSelection();

  let sign = "-",
    loweredType = lowerFirstLetter(type),
    classNameBeginning = loweredType + sign;

  clearClasses(classNameBeginning);
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

//Tags
let TagAppliers = {
  Strong: rangy.createClassApplier("strong", Options["Strong"]),
  U: rangy.createClassApplier("underlined", Options["U"]),
  Em: rangy.createClassApplier("emphasized", Options["Em"]),
  Strike: rangy.createClassApplier("strike", Options["Strike"]),
  A: rangy.createClassApplier("anchor", Options["A"]),
  Sup: rangy.createClassApplier("superscript", Options["Sup"]),
  Sub: rangy.createClassApplier("subscript", Options["Sub"]),
  Selected: rangy.createClassApplier("selected", Options["Selected"]),
};

//It adds tag with (tagName) to selected text.
//If it passes url then it makes anchor tag with (url)
function addTag(tagName) {
  let capitalizedTagName = capitalizeFirstLetter(tagName);
  TagAppliers[capitalizedTagName].toggleSelection();
}

let urlSpan = document.getElementById("url-span"),
  urlSelection = rangy.saveSelection();

function moveAnchorSpanUnderCaret() {
  urlSelection = rangy.saveSelection();

  let selection = document.getSelection();
  selection.collapseToEnd();

  let range = selection.getRangeAt(0),
    span = urlSpan.cloneNode(true);

  span.setAttribute("id", "cloned-url-span");

  span.style.display = "block";

  range.insertNode(span);

  span.style.top = span.offsetTop + 5 + "px";
  span.style.left = span.offsetLeft - 30 + "px";

  let childrenOfSpan = span.children,
    inputWithURL = childrenOfSpan[1];

  inputWithURL.setAttribute("id", "cloned-url");

  inputWithURL.focus();

  inputWithURL.onblur = () => {
    window.setTimeout(() => {
      span.remove();
      rangy.removeMarkers(urlSelection);
    }, 30000);
  };

  inputWithURL.onkeydown = (event) => {
    if (event.keyCode === 13) {
      let saveButton = childrenOfSpan[2];

      saveButton.click();
    }
  };
}

let time = 0;
function makeAnchor() {
  rangy.restoreSelection(urlSelection);

  let capitalizedTagName = "A";
  TagAppliers[capitalizedTagName].toggleSelection();

  let selection = document.getSelection();
  selection.empty();

  let query = "[class=anchor]",
    anchors = document.querySelectorAll(query),
    anchorsLength = anchors.length,
    url = document.getElementById("cloned-url"),
    urlValue = url.value;

  for (let i = 0; i < anchorsLength; i++) {
    let anchor = anchors[i],
      anchorClassName = anchor.className,
      anchorClassNameWithTime = anchorClassName + time;

    anchor.href = urlValue;
    anchor.className = anchorClassNameWithTime;
  }

  time++;
  url.value = "";

  let someSpanWithURL = document.getElementById("cloned-url-span");
  someSpanWithURL.remove();
}

let FontAppliers = {
  Sofia: rangy.createClassApplier("sofia"),
  Slabo13px: rangy.createClassApplier("slabo-13px"),
  RobotoSlab: rangy.createClassApplier("roboto-slab"),
  Inconsolata: rangy.createClassApplier("inconsolata"),
  UbuntuMono: rangy.createClassApplier("ubuntu-mono"),
};

//It adds font class (sofia, ubuntu-mono, etc.) to selected text
function addFont(fontName) {
  let signIndex = fontName.indexOf("-"),
    capitalizedFontName = capitalizeFirstLetter(fontName),
    amountOfCharactersInFontName = capitalizedFontName.length;

  if (signIndex > 0) {
    let firstPart = capitalizedFontName.substring(0, signIndex),
      startIndexOfSecondPart = signIndex + 1,
      secondPart = capitalizedFontName.substring(
        startIndexOfSecondPart,
        amountOfCharactersInFontName
      );
    capitalizedSecondPart = capitalizeFirstLetter(secondPart);

    capitalizedFontName = firstPart + capitalizedSecondPart;
  }

  FontAppliers[capitalizedFontName].toggleSelection();

  if (signIndex > 0) {
    let startIndexOfFirstPart = 0,
      firstPart = capitalizedFontName.substring(
        startIndexOfFirstPart,
        signIndex
      ),
      secondPart = capitalizedFontName.substring(
        signIndex,
        amountOfCharactersInFontName
      ),
      loweredFirstPart = lowerFirstLetter(firstPart),
      loweredSecondPart = lowerFirstLetter(secondPart);

    capitalizedFontName = loweredFirstPart + "-" + loweredSecondPart;
  } else {
    capitalizedFontName = lowerFirstLetter(capitalizedFontName);
  }

  let querySelector = "[class*=" + capitalizedFontName + "]",
    elements = document.querySelectorAll(querySelector),
    amountOfElements = elements.length;

  if (capitalizedFontName === "sofia") {
    var i = 2;
  } else {
    var i = 1;
  }

  if (amountOfElements > 1) {
    let names = [
        "sofia",
        "slabo-13px",
        "roboto-slab",
        "inconsolata",
        "ubuntu-mono",
      ],
      amountOfNames = names.length;

    for (i; i < amountOfElements; i++) {
      let element = elements[i],
        classNameOfElement = element.className,
        splittedClassName = classNameOfElement.split(" "),
        amountOfClassesInClassName = splittedClassName.length;

      if (amountOfClassesInClassName > 1) {
        let classNamesList = splittedClassName,
          classNamesListAmount = classNamesList.length;

        for (let k = 0; k < classNamesListAmount; k++) {
          for (let j = 0; j < amountOfNames; j++) {
            let name = names[j];

            if (
              classNamesList[k] === name &&
              classNamesList[k] !== capitalizedFontName
            ) {
              classNamesList.splice(k, 1);
              classNamesListAmount--;
            }
          }
        }
        let allClasses = classNamesList.join(" ");

        element.className = allClasses;
      }
    }
  }
}

let SizeAppliers = {
  small: rangy.createClassApplier("small"),
  normal: rangy.createClassApplier("normal"),
  large: rangy.createClassApplier("large"),
  huge: rangy.createClassApplier("huge"),
};

//It adds size class (normal, small, etc.) to selected text
function addSize(sizeName) {
  SizeAppliers[sizeName].toggleSelection();

  let querySelector = "[class*=" + sizeName + "]",
    elements = document.querySelectorAll(querySelector),
    amountOfElements = elements.length;

  if (sizeName === "normal") {
    var i = 2;
  } else {
    var i = 1;
  }

  if (amountOfElements > 1) {
    let names = ["small", "normal", "large", "huge"],
      namesLength = names.length;

    for (i; i < amountOfElements; i++) {
      let element = elements[i],
        classNameOfElement = element.className;

      let splittedClassName = classNameOfElement.split(" "),
        amountOfClasses = splittedClassName.length;

      if (amountOfClasses > 1) {
        for (let k = 0; k < amountOfClasses; k++) {
          for (let j = 0; j < namesLength; j++) {
            let name = names[j],
              splittedClass = splittedClassName[k];

            if (splittedClass === name && splittedClass !== sizeName) {
              splittedClassName.splice(k, 1);
              amountOfClasses--;
            }
          }
        }

        let allClasses = splittedClassName.join(" ");

        element.className = allClasses;
      }
    }
  }
}

//It finds child of (parent) element from some (element)
//First Level Child
function getChild(element, parent) {
  if (element === undefined) {
    throw new Error("You didn't add child element");
  } else if (parent === undefined) {
    throw new Error("You didn't add parent element");
  } else {
    while (element.parentElement !== parent) {
      element = element.parentElement;
    }

    child = element;

    return child;
  }
}

function getChildOfMainContainer(element) {
  if (element === undefined) {
    throw new Error("You didn't add child element");
  } else {
    let parent = document.getElementById("work-area");

    while (element.parentElement !== parent) {
      element = element.parentElement;
    }

    child = element;

    return child;
  }
}

//Second Level Child
function getSecondChild(element, parent) {
  if (element === undefined) {
    throw new Error("You didn't add child element");
  } else if (parent === undefined) {
    throw new Error("You didn't add parent element");
  } else {
    let parentOfParent = (element) => element.parentElement.parentElement;

    while (parentOfParent(element) !== parent) {
      element = element.parentElement;
    }

    child = element;

    return child;
  }
}

function getSecondChildInMainContainer(element) {
  if (element === undefined) {
    throw new Error("You didn't add child element");
  } else {
    let parent = document.getElementById("work-area");
    let parentOfParent = (element) => element.parentElement.parentElement;

    while (parentOfParent(element) !== parent) {
      element = element.parentElement;
    }

    child = element;

    return child;
  }
}

//It replaces any tag with new tag
function replaceElement(source, newType) {
  let attributes = [];

  // Create the document fragment
  const frag = document.createDocumentFragment();

  let firstChildOfOldTag = () => source.firstChild;

  // Fill it with what's in the source element
  // Including attributes
  while (firstChildOfOldTag()) {
    let attributesOfOldTag = source.attributes,
      amountOfAttributesOfOldTag = attributesOfOldTag.length;

    for (let i = 0; i < amountOfAttributesOfOldTag; i++) {
      let attribute = attributesOfOldTag[i];

      attributes.push(attribute);
    }
    frag.appendChild(firstChildOfOldTag());
  }

  // Create the new element
  const newElement = document.createElement(newType);

  // Empty the document fragment into it
  newElement.appendChild(frag);

  // Add attributes of old element to new element
  let amountOfNewAttributes = attributes.length,
    indexOfLastAttribute = amountOfNewAttributes - 1;

  for (let i = 0; i <= indexOfLastAttribute; i++) {
    let attribute = attributes[i],
      attributeName = attribute.name,
      attributeValue = attribute.value;

    newElement.setAttribute(attributeName, attributeValue);
  }

  // Replace the source element with the new element on the page
  let parentNode = source.parentNode;

  parentNode.replaceChild(newElement, source);
}

//It replaces selected childs tag of <div class="work-area"> with (tag)
function replaceContainerTag(tag) {
  var tagInUpperCase = tag.toUpperCase();

  let mainContainer = document.getElementById("work-area"),
    selectedElements = getFirstSelectedChilds(mainContainer),
    firstSelectedElement = selectedElements[0],
    lastSelectedElement = selectedElements[1];

  if (firstSelectedElement !== undefined && lastSelectedElement !== undefined) {
    let p = [],
      pCounter = 0,
      tagData = {
        tagName: tagInUpperCase,
        tagCounter: 0,
        selectedTags: [],
      };

    do {
      let nameOfFirstSelectedElement = firstSelectedElement.tagName,
        nameOfTag = tagData.tagName;

      if (nameOfFirstSelectedElement === nameOfTag) {
        p[pCounter] = firstSelectedElement;
        pCounter++;
      } else {
        let amountOfTags = tagData.tagCounter;

        tagData.selectedTags[amountOfTags] = firstSelectedElement;
        tagData.tagCounter++;
      }

      let elementAfterFirstSelectedElement =
          firstSelectedElement.nextElementSibling,
        elementAfterLastSelectedElement =
          lastSelectedElement.nextElementSibling;

      if (
        elementAfterFirstSelectedElement === elementAfterLastSelectedElement
      ) {
        break;
      }

      firstSelectedElement = elementAfterFirstSelectedElement;
    } while (firstSelectedElement !== elementAfterLastSelectedElement);

    lastIndexOfElementInParagraph = pCounter - 1;

    if (pCounter !== 0) {
      for (let i = 0; i <= lastIndexOfElementInParagraph; i++) {
        let someTag = p[i];
        replaceElement(someTag, "p");
      }
    }

    let amountOfTags = tagData.tagCounter,
      indexOfLastTag = amountOfTags - 1;

    if (amountOfTags !== 0) {
      for (let i = 0; i <= indexOfLastTag; i++) {
        let selectedTags = tagData.selectedTags,
          selectedTag = selectedTags[i],
          nameOfSelectedTag = tagData.tagName;

        replaceElement(selectedTag, nameOfSelectedTag);
      }
    }

    if (tagInUpperCase === "PRE") {
      clearTagsAtPreContainer();
      // init();
      removeSpellcheck();
      highlightNumbers();
      highlightKeywords();
    }
  }

  let selection = document.getSelection();
  selection.empty();
}

//It highlights specific words + all numbers in <pre>
function highlightPre() {
  let savedSelection = rangy.saveSelection();
  highlightKeywords();
  highlightNumbers();
  rangy.restoreSelection(savedSelection);
  localStorage.clear();
}

function getFirstSelectedChilds(bigParent) {
  let selection = document.getSelection(),
    range = selection.getRangeAt(0),
    wrongContainer = document.getElementById("sample-toolbar"),
    firstNode = selection.anchorNode,
    lastNode = selection.focusNode,
    verific =
      firstNode.nodeName === "#text" &&
      range.commonAncestorContainer !== wrongContainer;

  if (bigParent !== undefined) {
    if (verific) {
      let firstSelectedElement = firstNode,
        lastSelectedElement = lastNode,
        startElement = range.startContainer,
        endElement = range.endContainer;

      if (
        firstSelectedElement !== startElement &&
        lastSelectedElement !== endElement
      ) {
        // firstSelectedElement = lastNode;
        // lastSelectedElement = firstNode;

        firstAndLastSelectedElements = swap(
          firstSelectedElement,
          lastSelectedElement
        );

        firstSelectedElement = firstAndLastSelectedElements[0];
        lastSelectedElement = firstAndLastSelectedElements[1];
      }

      firstElement = getChild(firstSelectedElement, bigParent);
      secondElement = getChild(lastSelectedElement, bigParent);

      return [firstElement, secondElement];
    } else {
      return [undefined, undefined];
    }
  } else {
    throw new Error("You didn't add parent element");
  }
}

//It toggles class with (className) to selected first childs of <div class="work-area">
function addContainerClass(className) {
  let mainContainer = document.getElementById("work-area"),
    firstSelectedElement = getFirstSelectedChilds(mainContainer)[0],
    lastSelectedElement = getFirstSelectedChilds(mainContainer)[1];

  if (firstSelectedElement !== undefined && lastSelectedElement !== undefined) {
    let classNameBeginning = className.substring(0, 6);

    if (classNameBeginning === "indent") {
      let sign = className.substring(6, 7),
        classBeginning = "indent";

      do {
        let nameOfFirstSelectedElement = firstSelectedElement.nodeName;

        if (nameOfFirstSelectedElement !== "#text") {
          let firstSelectedElementClassName = firstSelectedElement.className,
            attributesOfFirstSelectedElement = firstSelectedElement.attributes,
            dataValue = attributesOfFirstSelectedElement["data-value"];

          if (dataValue !== undefined) {
            let valueOfDataValue = dataValue.nodeValue,
              parsedDataValue = parseInt(valueOfDataValue);

            if (sign === "+") {
              if (parsedDataValue <= 7) {
                let className = firstSelectedElement.className;
                let cleanElement = clearExtraSpaces(className),
                  classes = cleanElement.split(" "),
                  amountOfClasses = classes.length;
                for (let j = 0; j < amountOfClasses; j++) {
                  let classBeginning = classes[j].substring(0, 6);
                  if (classBeginning === "indent") {
                    classes.splice(j, 1);
                    j--;
                    amountOfClasses--;
                  }
                }
                classes = classes.join(" ");

                parsedDataValue++;

                firstSelectedElement.attributes[
                  "data-value"
                ].nodeValue = parsedDataValue;

                firstSelectedElement.className = clearExtraSpaces(
                  classes + " " + classBeginning + "-" + parsedDataValue
                );
              }
            } else {
              if (parsedDataValue >= 1) {
                if (parsedDataValue === 1) {
                  let className = firstSelectedElement.className,
                    clearElement = clearExtraSpaces(className),
                    classes = clearElement.split(" "),
                    amountOfClasses = classes.length;

                  firstSelectedElement.removeAttribute("data-value");

                  if (amountOfClasses === 1) {
                    firstSelectedElement.removeAttribute("class");
                  } else {
                    for (let j = 0; j < amountOfClasses; j++) {
                      let someClass = classes[j],
                        classBeginning = someClass.substring(0, 6);

                      if (classBeginning === "indent") {
                        classes.splice(j, 1);

                        j--;
                        amountOfClasses--;
                      }
                    }
                    if (amountOfClasses === 0) {
                      firstSelectedElement.removeAttribute("class");
                    }
                    classes = classes.join(" ");
                    firstSelectedElement.className = clearExtraSpaces(classes);
                  }
                } else {
                  // repeated code too
                  //
                  let className = firstSelectedElement.className;
                  let classes = className.split(" "),
                    amountOfClasses = classes.length;

                  for (let j = 0; j < amountOfClasses; j++) {
                    let someClass = classes[j],
                      classBeginning = someClass.substring(0, 6);

                    if (classBeginning === "indent") {
                      classes.splice(j, 1);

                      j--;
                      amountOfClasses--;
                    }
                  }

                  classes = classes.join(" ");
                  parsedDataValue--;

                  firstSelectedElement.attributes[
                    "data-value"
                  ].nodeValue = parsedDataValue;

                  let classesWithClassBeginningAndParsedDataValue =
                      classes + " " + classBeginning + "-" + parsedDataValue,
                    classesWithoutExtraSpaces = clearExtraSpaces(
                      classesWithClassBeginningAndParsedDataValue
                    );

                  firstSelectedElement.className = classesWithoutExtraSpaces;
                  //
                  //
                }
              }
            }
          } else if (className === "indent+") {
            firstSelectedElement.setAttribute("data-value", 1);

            let attributesOfFirstSelectedElement =
                firstSelectedElement.attributes,
              parsedDataValue =
                attributesOfFirstSelectedElement["data-value"].value;

            firstSelectedElement.className = clearExtraSpaces(
              firstSelectedElementClassName +
                " " +
                classBeginning +
                "-" +
                parsedDataValue
            );
          }
        }

        firstSelectedElement = firstSelectedElement.nextSibling;
      } while (
        firstSelectedElement.nextSibling !==
        lastSelectedElement.nextElementSibling
      );
    } else {
      do {
        let classNameOfFirstSelectedElement = firstSelectedElement.className;

        if (classNameOfFirstSelectedElement === className) {
          firstSelectedElement.removeAttribute("class");
        } else if (classNameOfFirstSelectedElement !== undefined) {
          if (classNameOfFirstSelectedElement === "") {
            firstSelectedElement.className = className;
          } else {
            let classes = firstSelectedElement.className.split(" "),
              classesAmount = classes.length;

            if (classesAmount === 1) {
              let classNameIndex = className.indexOf("-"),
                classNameBeginning = className.substring(0, classNameIndex),
                classIndex = classNameOfFirstSelectedElement.indexOf("-"),
                classBeginning = classNameOfFirstSelectedElement.substring(
                  0,
                  classIndex
                );

              if (classNameBeginning === classBeginning) {
                firstSelectedElement.className = className;
              } else {
                firstSelectedElement.className =
                  classNameOfFirstSelectedElement + " " + className;
              }
            } else {
              // repeated code
              //
              let classNameIndex = className.indexOf("-"),
                classNameBeginning = className.substring(0, classNameIndex);

              for (let j = 0; j < classesAmount; j++) {
                let someClass = classes[j],
                  classIndex = someClass.indexOf("-"),
                  classBeginning = someClass.substring(0, classIndex);

                if (classBeginning === classNameBeginning) {
                  classes.splice(j, 1);
                  j--;
                  classesAmount--;
                }
              }

              classes = classes.join(" ");
              let allClasses = classes;
              firstSelectedElement.className = clearExtraSpaces(
                allClasses + " " + className
              );
              //
              //
            }
          }
        }
        firstSelectedElement = firstSelectedElement.nextSibling;
      } while (
        firstSelectedElement.nextSibling !==
        lastSelectedElement.nextElementSibling
      );
    }
  } else {
    throw new Error("You selected something wrong!");
  }
}

//It highlights specific words in <pre> tag
function highlightKeywords() {
  let words = ["for", "while", "var", "and", "is"],
    wordsLastElementIndex = words.length - 1;
  let preList = document.getElementsByTagName("PRE"),
    preListLastIndexElement = preList.length - 1;

  for (let i = 0; i <= preListLastIndexElement; i++) {
    let pre = preList[i];
    // preInner = pre.innerHTML;

    for (let j = 0; j <= wordsLastElementIndex; j++) {
      let word = words[j],
        regExp = new RegExp("\\b" + word + "\\b", "gi"),
        replacing = "<span class=pre-keyword>" + word + "</span>";
      replacedInner = pre.innerHTML.replace(regExp, replacing);
      pre.innerHTML = replacedInner;
    }
  }
  // }
}

//It highlights all numbers in <pre> tag
function highlightNumbers() {
  let preList = document.getElementsByTagName("PRE"),
    selection = document.getSelection(),
    preElement = selection.anchorNode;

  if (selection.type === "Caret") {
    while (preElement.tagName !== "PRE") {
      preElement = preElement.parentElement;
    }

    let regExp = new RegExp("\\b" + "\\d+" + "\\b", "gi"),
      matches = preElement.innerHTML.match(regExp),
      matchesAmount = matches.length,
      matchesLastElementIndex = matchesAmount - 1;

    if (matches !== null) {
      for (let j = 0; j <= matchesLastElementIndex; j++) {
        let match = matches[j],
          replacing = "<span class=pre-number>" + match + "</span>",
          regExp = new RegExp("\\b" + match + "\\b", "gi");

        replacedInner = preElement.innerHTML.replace(regExp, replacing);
        preElement.innerHTML = replacedInner;
      }
    }
  } else {
    for (
      let i = 0, indexOfLastPreElement = preList.length - 1;
      i <= indexOfLastPreElement;
      i++
    ) {
      let regExp = new RegExp("\\b" + "\\d+" + "\\b", "gi"),
        element = preList[i],
        matches = element.innerHTML.match(regExp);

      if (matches !== null) {
        for (
          let j = 0, indexOfLastMatch = matches.length - 1;
          j <= indexOfLastMatch;
          j++
        ) {
          let match = matches[j],
            replacing = "<span class=pre-number>" + match + "</span>",
            regExp = new RegExp("\\b" + match + "\\b", "gi");
          replacedInner = element.innerHTML.replace(regExp, replacing);
          element.innerHTML = replacedInner;
        }
      }
    }
  }
}

//It deletes all tags in <pre> tag
function clearTagsAtPreContainer() {
  let preList = document.getElementsByTagName("PRE");
  for (let i = 0; i <= preList.length - 1; i++) {
    let preListTextContent = preList[i].textContent;
    preList[i].innerHTML = preListTextContent;
  }
}

//It sets spellcheck attribute to false (spellcheck=false) to selected <pre> tags
function removeSpellcheck() {
  let pres = document.querySelectorAll("pre:not([spellcheck])");
  for (let i = 0; i <= pres.length - 1; i++) {
    let pre = pres[i];
    pre.setAttribute("spellcheck", "false");
  }
}

function replaceDivs() {
  let element = document.getElementById("work-area"),
    childNodes = element.childNodes,
    childNodesLength = childNodes.length;
  for (let i = 0; i < childNodesLength; i++) {
    if (
      childNodes[i].nodeName === "DIV" ||
      childNodes[i].nodeName === "#text"
    ) {
      replaceElement(childNodes[i], "p");
    }
  }
}

let element = document.getElementById("work-area");
element.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    let savedSelection = rangy.saveSelection();

    setTimeout(replaceDivs, 1);
    rangy.restoreSelection(savedSelection);
  }
});

function clearEmptyContainers() {
  let mainContainer = document.getElementById("work-area"),
    mainChildren = mainContainer.children,
    childrenAmount = mainChildren.length;

  for (let i = 0; i < childrenAmount; i++) {
    let child = mainChildren[i],
      textContent = child.textContent;

    textContent = clearExtraSpaces(textContent);
    if (textContent === "") {
      mainContainer.removeChild(child);
      childrenAmount--;
    }
  }
}

function makeList(type) {
  type = type.toUpperCase();

  function getSelectedParents(mainContainer) {
    let selection = document.getSelection(),
      firstSelectedElement = selection.anchorNode,
      lastSelectedElement = selection.focusNode,
      parentOfFirstElement = getChildOfMainContainer(firstSelectedElement),
      parentOfLastElement = getChildOfMainContainer(lastSelectedElement);
    return [parentOfFirstElement, parentOfLastElement];
  }

  let mainContainer = document.getElementById("work-area"),
    parentOfFirstElement = getSelectedParents(mainContainer)[0],
    parentOfLastElement = getSelectedParents(mainContainer)[1];

  //Find indexes of parent of first selected element and last selected element
  function getParentsIndexes(
    mainChildren,
    parentOfFirstElement,
    parentOfLastElement
  ) {
    let childrenAmount = mainChildren.length,
      firstParentIndex = -1,
      lastParentIndex = -1;

    for (let i = 0; i < childrenAmount; i++) {
      let child = mainChildren[i];
      if (child === parentOfFirstElement) {
        firstParentIndex = i;
      }
      if (child === parentOfLastElement) {
        lastParentIndex = i;
      }
    }
    return [firstParentIndex, lastParentIndex];
  }

  let mainChildren = mainContainer.children,
    firstAndLastParentIndexes = getParentsIndexes(
      mainChildren,
      parentOfFirstElement,
      parentOfLastElement
    ),
    firstParentIndex = firstAndLastParentIndexes[0],
    lastParentIndex = firstAndLastParentIndexes[1];

  //Change indexes if selection was from the end
  function swapIndexes(firstParentIndex, lastParentIndex) {
    if (firstParentIndex > lastParentIndex) {
      [firstParentIndex, lastParentIndex] = [lastParentIndex, firstParentIndex];
    }
    return [firstParentIndex, lastParentIndex];
  }

  let parentsIndexes = swapIndexes(firstParentIndex, lastParentIndex);
  firstParentIndex = parentsIndexes[0];
  lastParentIndex = parentsIndexes[1];

  //Count how much list tags was selected
  function getAmountOfLists(firstParentIndex, lastParentIndex) {
    let count = 0,
      index = lastParentIndex + 1;

    for (let i = firstParentIndex; i < index; i++) {
      let mainChild = mainChildren[i],
        mainChildName = mainChild.nodeName;

      if (mainChildName === type) {
        count++;
      }
    }
    return count;
  }

  let amountOfLists = getAmountOfLists(firstParentIndex, lastParentIndex);

  // If we selected only list tags then turn them into <p> tags
  //
  //Think about condition!
  let index = lastParentIndex + 1;
  if (amountOfLists === index - firstParentIndex) {
    //
    //
    let selection = document.getSelection(),
      firstSelectedElement = selection.anchorNode,
      lastSelectedElement = selection.focusNode;

    function makeOnlyLists(
      firstSelectedElement,
      lastSelectedElement,
      firstParentIndex,
      mainContainer
    ) {
      function swapSelectionNodes() {
        function getSelectionIndexes() {
          //Get Selected <list> tag
          function getList() {
            let List = firstSelectedElement,
              getParent = (element) => element.parentElement;

            while (getParent(List) !== mainContainer) {
              List = getParent(List);
            }
            return List;
          }

          //Get Selected <li> tags (first and last one)
          function getFirstLiAndLastLi() {
            let firstLi = firstSelectedElement,
              lastLi = lastSelectedElement,
              getParent = (element) => element.parentElement,
              getParentName = (element) => getParent(element).nodeName;

            while (getParentName(firstLi) !== type) {
              firstLi = getParent(firstLi);
            }

            while (getParentName(lastLi) !== type) {
              lastLi = getParent(lastLi);
            }

            return [firstLi, lastLi];
          }

          let parentNode = getList(),
            childs = parentNode.children,
            childrenAmount = childs.length,
            firstSelectedLi = getFirstLiAndLastLi()[0],
            lastSelectedLi = getFirstLiAndLastLi()[1],
            indexOfFirstSelectedLi = -1,
            indexOfLastSelectedLi = -1;

          for (let i = 0; i < childrenAmount; i++) {
            let child = childs[i];

            if (child === firstSelectedLi) {
              indexOfFirstSelectedLi = i;
            } else if (child === lastSelectedLi) {
              indexOfLastSelectedLi = i;
            }
          }

          return [indexOfFirstSelectedLi, indexOfLastSelectedLi];
        }

        let firstIndex = getSelectionIndexes()[0],
          lastIndex = getSelectionIndexes()[1];

        if (firstIndex > lastIndex) {
          [firstSelectedElement, lastSelectedElement] = [
            lastSelectedElement,
            firstSelectedElement,
          ];
        }

        return [firstSelectedElement, lastSelectedElement];
      }

      let selectedElements = swapSelectionNodes();
      firstSelectedElement = selectedElements[0];
      lastSelectedElement = selectedElements[1];

      function getFirstLiAndLastLi() {
        let firstLi = firstSelectedElement,
          lastLi = lastSelectedElement,
          getParent = (someElement) => someElement.parentElement,
          getParentName = (someElement) => getParent(someElement).nodeName;

        while (getParentName(firstLi) !== type) {
          firstLi = getParent(firstLi);
        }

        while (getParentName(lastLi) !== type) {
          lastLi = getParent(lastLi);
        }

        return [firstLi, lastLi];
      }

      function getList() {
        let List = firstSelectedElement,
          workAreaContainer = document.getElementById("work-area"),
          getParent = (element) => element.parentElement;

        while (getParent(List) !== workAreaContainer) {
          List = getParent(List);
        }

        return List;
      }

      let firstLi = getFirstLiAndLastLi()[0],
        lastLi = getFirstLiAndLastLi()[1],
        List = getList(),
        ListIndex = firstParentIndex,
        children = List.children,
        childrenAmount = children.length;

      //Get indexes of first and last selected <li> elements in <list> tag
      function getFirstLiAndLastLiIndexes(
        listChildren,
        listChildrenAmount,
        firstLi,
        lastLi
      ) {
        let indexOfFirstSelectedLi = -1,
          lastLiIndex = -1;

        for (let i = 0; i < listChildrenAmount; i++) {
          let child = listChildren[i];

          if (child === firstLi) {
            indexOfFirstSelectedLi = i;
          } else if (child === lastLi) {
            lastLiIndex = i;
          }
        }

        if (lastLiIndex === -1) {
          lastLiIndex = indexOfFirstSelectedLi;
        }

        return [indexOfFirstSelectedLi, lastLiIndex];
      }

      let firstAndLastLiIndexes = getFirstLiAndLastLiIndexes(
          children,
          childrenAmount,
          firstLi,
          lastLi
        ),
        indexOfFirstSelectedLi = firstAndLastLiIndexes[0],
        indexOfLastSelectedLi = firstAndLastLiIndexes[1];

      let fragment = document.createDocumentFragment();

      //If selected only one <li> then remove only the <li> element
      //and add <p> tag with content of the <li> after selected <list> tag
      if (indexOfLastSelectedLi === indexOfFirstSelectedLi) {
        let p = document.createElement("p"),
          firstSelectedLi = children[indexOfFirstSelectedLi],
          liContent = firstSelectedLi.innerHTML;

        firstSelectedLi.remove();

        p.innerHTML = liContent;
        fragment.appendChild(p);
      } else {
        //Else remove all selected <li> elements and add <p> tags
        let index = indexOfLastSelectedLi + 1;

        while (indexOfFirstSelectedLi !== index) {
          let p = document.createElement("p"),
            firstSelectedLi = children[indexOfFirstSelectedLi],
            liContent = firstSelectedLi.innerHTML;

          firstSelectedLi.remove();
          index--;

          p.innerHTML = liContent;
          fragment.appendChild(p);
        }
      }

      let indexOfLastLi = childrenAmount - 1;

      //If selection started from the start of the list, then append <p> tags before the list
      if (indexOfFirstSelectedLi === 0) {
        let mainContainerChildren = mainContainer.children,
          list = mainContainerChildren[ListIndex];

        mainContainer.insertBefore(fragment, list);
      } else if (
        indexOfLastSelectedLi === indexOfLastLi ||
        indexOfFirstSelectedLi === indexOfLastLi
      ) {
        //Else if selection ends in the end of list append after this list
        mainContainer.insertBefore(
          fragment,
          mainContainer.children[ListIndex + 1]
        );
      } else {
        //Else if selection starts and ends in the middle of list append in the middle
        let indexOfLastLiInFirstPart = indexOfFirstSelectedLi - 1,
          firstPart = document.createDocumentFragment(),
          lastPart = document.createDocumentFragment(),
          mainContainer = document.getElementById("work-area"),
          childrenOfMainContainer = mainContainer.children,
          list = childrenOfMainContainer[ListIndex],
          listChildren = list.children;

        while (indexOfLastLiInFirstPart >= 0) {
          let listChildren = list.children,
            firstChild = listChildren[0];

          firstPart.appendChild(firstChild);
          indexOfLastLiInFirstPart--;
        }

        let amountOfChildrenOfList = listChildren.length;

        while (amountOfChildrenOfList !== 0) {
          let listChildren = list.children,
            firstChildOfList = listChildren[0];

          lastPart.appendChild(firstChildOfList);
          amountOfChildrenOfList--;
        }

        list.remove();

        let firstUl = document.createElement(type),
          lastUl = document.createElement(type),
          childOfMainContainer = childrenOfMainContainer[ListIndex];

        firstUl.appendChild(firstPart);
        lastUl.appendChild(lastPart);

        mainContainer.insertBefore(firstUl, childOfMainContainer);
        mainContainer.insertBefore(fragment, childOfMainContainer);
        mainContainer.insertBefore(lastUl, childOfMainContainer);
      }

      //If <list> is empty then delete it.
      let childrenOfList = List.children,
        amountOfChildren = childrenOfList.length;
      if (amountOfChildren === 0) {
        List.remove();
      }
    }

    makeOnlyLists(
      firstSelectedElement,
      lastSelectedElement,
      firstParentIndex,
      mainContainer
    );
  } else {
    //If selected not just <list> tags then turn selected tags into <list> (if they're not already)
    function replaceNotList(firstParentIndex, lastParentIndex, mainChildren) {
      for (
        let i = firstParentIndex, amountOfParents = lastParentIndex + 1;
        i < amountOfParents;
        i++
      ) {
        let child = mainChildren[i],
          nodeName = child.nodeName;

        if (nodeName !== type) {
          replaceElement(child, type);
        }
      }
    }
    replaceNotList(firstParentIndex, lastParentIndex, mainChildren);

    //Remove all tags what don't have any content
    function clearEmptyContainers() {
      let mainContainer = document.getElementById("work-area"),
        mainChildren = mainContainer.children,
        childrenAmount = mainChildren.length;

      for (let i = 0; i < childrenAmount; i++) {
        let child = mainChildren[i],
          textContent = child.textContent;

        textContent = clearExtraSpaces(textContent);
        if (textContent === "") {
          mainContainer.removeChild(child);
          childrenAmount--;
        }
      }
    }
    clearEmptyContainers();

    // let fragment = document.createDocumentFragment(),
    let editor = document.getElementById("work-area"),
      editorChildren = editor.children,
      childrenAmount = editorChildren.length,
      elementsToTurnIntoLi = [],
      count = 0;

    function turnIntoLi(elementsToTurnIntoLi) {
      let fragment = document.createDocumentFragment(),
        elementsAmount = elementsToTurnIntoLi.length,
        index = 0;

      for (i = 0; i < elementsAmount; i++) {
        let element = elementsToTurnIntoLi[i],
          children = element.childNodes,
          length = children.length,
          innerFragment = document.createDocumentFragment(),
          isWithLI = false;

        function hasLi(element) {
          let children = element.childNodes,
            childAmount = children.length;

          for (let i = 0; i < childAmount; i++) {
            let child = children[i],
              childName = child.nodeName;

            if (childName === "LI") {
              return true;
            }
          }
          return false;
        }

        while (length !== 0) {
          let child = children[0],
            childName = child.nodeName,
            firstChild = children[0];

          if (childName === "LI") {
            isWithLI = true;
            break;
          }

          innerFragment.appendChild(firstChild);
          length--;
        }

        if (isWithLI) {
        } else {
          let li = document.createElement("li");

          li.appendChild(innerFragment);
          fragment.appendChild(li);

          //If the next element is already done (turned into <list> tag with <li> elements)
          //Then append the element to the previous element
          let nextElement = elementsToTurnIntoLi[i + 1];
          if (nextElement !== undefined) {
            if (hasLi(nextElement)) {
              let listForMerging = elementsToTurnIntoLi[index],
                elementAfterNextElement = elementsToTurnIntoLi[i + 2];

              listForMerging.appendChild(fragment);

              if (elementAfterNextElement !== undefined) {
                index = i + 2;
              }
            }
          }
        }
      }

      let listForMerging = elementsToTurnIntoLi[index];
      listForMerging.appendChild(fragment);

      //Merge separated <list> tags
      let secondList = elementsToTurnIntoLi[1];
      while (secondList !== undefined) {
        let firstList = elementsToTurnIntoLi[0],
          secondList = elementsToTurnIntoLi[1];

        if (secondList === undefined) {
          break;
        }

        let childrenOfSecondList = secondList.children,
          firstChildOfsecondList = () => childrenOfSecondList[0];

        while (firstChildOfsecondList() !== undefined)
          firstList.appendChild(firstChildOfsecondList());

        elementsToTurnIntoLi.splice(1, 1);
        clearEmptyContainers();
      }
    }

    for (let i = 0; i < childrenAmount; i++) {
      let child = editorChildren[i],
        childName = child.nodeName;

      if (childName === type) {
        elementsToTurnIntoLi[count] = child;
        count++;
      } else if (count > 0) {
        turnIntoLi(elementsToTurnIntoLi);
        elementsToTurnIntoLi = [];

        if (count !== 1) {
          childrenAmount -= count;
        }
        count = 0;
      }
    }

    //If stopped on last element and it didn't turned it into li
    if (count > 0) {
      turnIntoLi(elementsToTurnIntoLi);
      elementsToTurnIntoLi = [];
    }
  }

  elementsToTurnIntoLi = [];

  let selection = document.getSelection();
  selection.empty();
}

// Make function of it smhw
//
let fileTag = document.getElementById("filetag");
fileTag.addEventListener("change", function () {
  changeImage(this);
});

function changeImage(input) {
  let reader,
    files = input.files,
    file = files[0],
    querySelector = "img[src='']";
  image = document.querySelector(querySelector);

  if (files && file) {
    reader = new FileReader();

    reader.onload = function (event) {
      let newReader = event.target,
        photoURL = newReader.result;

      image.setAttribute("src", photoURL);
    };

    reader.readAsDataURL(file);
  }
}

function addImage() {
  let getElement = (id) => document.getElementById(id),
    fileTag = getElement("filetag"),
    selection = document.getSelection(),
    range = selection.getRangeAt(0),
    image = document.createElement("img");

  selection.deleteFromDocument();
  image.setAttribute("src", "");
  range.insertNode(image);

  fileTag.click();
}

function addVideoByURL() {
  let selection = document.getSelection(),
    range = selection.getRangeAt(0),
    iframe = document.createElement("iframe"),
    input = document.getElementById("url-input"),
    URL = input.value;

  selection.deleteFromDocument();
  iframe.setAttribute("src", URL);
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowfullscreen", "true");
  range.insertNode(iframe);

  input.value = "";
}

tests = () => {
  function performanceTest(someFunction) {
    const t0 = performance.now();
    console.time();
    someFunction();
    const t1 = performance.now();
    console.timeEnd();
    console.log(
      `Clear formatting function completed in: ${t1 - t0} milleseconds`
    );
  }

  // performanceTest(undo);
};

function getChildIndex(child, parent) {
  let children = parent.children,
    childrenAmount = children.length,
    indexOfChild = undefined;

  for (let i = 0; i < childrenAmount; i++) {
    let childOfParent = children[i];

    if (child === childOfParent) {
      indexOfChild = i;
      break;
    }
  }

  return indexOfChild;
}

function getChildIndexInMainContainer(child) {
  let mainContainer = document.getElementById("work-area"),
    children = mainContainer.children,
    childrenAmount = children.length,
    indexOfChild = undefined;

  for (let i = 0; i < childrenAmount; i++) {
    let childOfParent = children[i];

    if (child === childOfParent) {
      indexOfChild = i;
      break;
    }
  }

  return indexOfChild;
}

function swap(firstThing, secondThing) {
  [firstThing, secondThing] = [secondThing, firstThing];

  return [firstThing, secondThing];
}

function removeFormatting() {
  clearEmptyContainers();

  let selection = document.getSelection(),
    anchorNode = selection.anchorNode,
    focusNode = selection.focusNode,
    range = selection.getRangeAt(0),
    fragment = range.cloneContents(),
    fragmentChildren = fragment.children,
    fragmentChildrenAmount = fragmentChildren.length,
    strippedContent = fragment.textContent,
    mainContainer = document.getElementById("work-area"),
    createTextNode = (text) => document.createTextNode(text),
    firstSelectedChild = getChildOfMainContainer(anchorNode),
    lastSelectedChild = getChildOfMainContainer(focusNode),
    indexOfFirstSelectedChild = getChildIndex(
      firstSelectedChild,
      mainContainer
    ),
    indexOfLastSelectedChild = getChildIndexInMainContainer(lastSelectedChild);

  // Swap start and end nodes and their indexes of the selection, if it's started from the end
  if (indexOfFirstSelectedChild > indexOfLastSelectedChild) {
    let indexes = swap(indexOfFirstSelectedChild, indexOfLastSelectedChild),
      childs = swap(firstSelectedChild, lastSelectedChild),
      anchorAndFocusNode = swap(anchorNode, focusNode);

    indexOfFirstSelectedChild = indexes[0];
    indexOfLastSelectedChild = indexes[1];

    firstSelectedChild = childs[0];
    lastSelectedChild = childs[1];

    anchorNode = anchorAndFocusNode[0];
    focusNode = anchorAndFocusNode[1];
    // fragmentChildren.reverse();
  }

  let nameOfFirstSelectedChild = firstSelectedChild.nodeName,
    nameOfLastSelectedChild = lastSelectedChild.nodeName,
    distance = indexOfLastSelectedChild - indexOfFirstSelectedChild + 1;

  function clearElement(element) {
    let strippedContent = element.textContent;
    element.innerHTML = strippedContent;

    return element;
  }

  //
  // Fix this one
  function clearElementsFromPToList() {
    addTag("selected");
    let ul = getChildOfMainContainer(focusNode);

    function getFragmentOfSelectedLiElements() {
      let lastLi = getSecondChildInMainContainer(focusNode),
        ul = getChildOfMainContainer(focusNode),
        ulChildren = ul.children;

      let fragmentWithLi = document.createDocumentFragment(),
        indexOfLastLi = getChildIndex(lastLi, ul),
        getFirstLi = () => ulChildren[0],
        getLiAfterLastLi = () => ulChildren[indexOfLastLi + 1];

      while (getFirstLi() !== getLiAfterLastLi()) {
        fragmentWithLi.append(getFirstLi());
        indexOfLastLi--;
      }
      return fragmentWithLi;
    }

    let fragmentWithLi = getFragmentOfSelectedLiElements();

    function getLiTurnedIntoP() {
      let childrenOfFragmentWithLi = fragmentWithLi.children,
        amountOfChildrenOfFragmentWithLi = childrenOfFragmentWithLi.length;

      for (let i = 0; i < amountOfChildrenOfFragmentWithLi; i++) {
        let child = childrenOfFragmentWithLi[i],
          innerHTMLOfChild = child.innerHTML,
          p = document.createElement("P");

        p.innerHTML = innerHTMLOfChild;
        fragmentWithLi.replaceChild(p, child);
      }

      let fragmentWithP = fragmentWithLi;

      return fragmentWithP;
    }

    let fragmentWithP = getLiTurnedIntoP();

    ul.before(fragmentWithP);

    let querySelector = "[class*=selected]",
      selectedParts = document.querySelectorAll(querySelector),
      selectedPartsInFirstP = [],
      selectedPartsInLastP = [],
      i = 0,
      firstPart = selectedParts[0],
      amountOfSelectedParts = selectedParts.length,
      indexOfLastSelectedPart = amountOfSelectedParts - 1,
      lastPart = selectedParts[indexOfLastSelectedPart],
      part = selectedParts[i];

    for (
      let i = 0;
      getChildOfMainContainer(firstPart) === getChildOfMainContainer(part);
      i++
    ) {
      part = selectedParts[i];

      if (
        getChildOfMainContainer(firstPart) !== getChildOfMainContainer(part)
      ) {
        break;
      }

      selectedPartsInFirstP.push(part);
    }

    let amountOfSelectedPartsInFirstP = selectedPartsInFirstP.length,
      indexOfLastPartInSelectedPartsInFirstP =
        amountOfSelectedPartsInFirstP - 1;

    let isInTheSameContainer = (index) => {
      return (
        getChildOfMainContainer(lastPart) ===
        getChildOfMainContainer(selectedParts[index])
      );
    };

    for (let j = indexOfLastSelectedPart; isInTheSameContainer(j); j--) {
      selectedPartsInLastP.push(selectedParts[j]);
    }

    amountOfSelectedParts = selectedParts.length;
    let amountOfSelectedPartsInLastP = selectedPartsInLastP.length,
      indexOfFirstPartInSelectedPartsInLastP =
        amountOfSelectedParts - amountOfSelectedPartsInLastP;

    selectedPartsInLastP.reverse();

    let bigFirstContent = "",
      bigLastContent = "",
      lastSelectedP = lastSelectedChild.previousSibling;

    function makeBigContent(someParts) {
      let bigContent = "",
        amountOfParts = someParts.length;

      for (let i = 0; i < amountOfParts; i++) {
        let part = someParts[i],
          contentOfPart = part.textContent;

        bigContent = bigContent.concat(contentOfPart);
        part.remove();
      }

      return bigContent;
    }

    bigFirstContent = makeBigContent(selectedPartsInFirstP);

    for (let i = 0; i < selectedPartsInLastP.length; i++) {
      bigLastContent = bigLastContent.concat(
        selectedPartsInLastP[i].textContent
      );

      selectedPartsInLastP[i].remove();
    }

    let textNodeWithBigFirstContent = createTextNode(bigFirstContent),
      textNodeWithBigLastContent = createTextNode(bigLastContent);

    firstSelectedChild.append(textNodeWithBigFirstContent);
    lastSelectedP.prepend(textNodeWithBigLastContent);

    amountOfSelectedParts = selectedParts.length;

    // Clean format of remaining parts if there are such
    if (
      amountOfSelectedParts !==
      amountOfSelectedPartsInFirstP + amountOfSelectedPartsInLastP
    ) {
      let arrayWithRemainingFragmentParts = [];

      for (
        let i = indexOfLastPartInSelectedPartsInFirstP + 1;
        i < indexOfFirstPartInSelectedPartsInLastP;
        i++
      ) {
        arrayWithRemainingFragmentParts.push(selectedParts[i]);
      }

      let fragmentWithRemainingParts = document.createDocumentFragment();

      while (arrayWithRemainingFragmentParts.length !== 0) {
        let commonParent = getChildOfMainContainer(
            arrayWithRemainingFragmentParts[0]
          ),
          p = document.createElement("P");

        while (
          commonParent ===
          getChildOfMainContainer(arrayWithRemainingFragmentParts[0])
        ) {
          let part = arrayWithRemainingFragmentParts[0],
            strippedContent = part.textContent,
            textNodeWithStrippedContent = createTextNode(strippedContent);

          p.append(textNodeWithStrippedContent);
          part.remove();
          arrayWithRemainingFragmentParts.shift();

          if (arrayWithRemainingFragmentParts[0] === undefined) {
            break;
          }
        }

        commonParent.remove();
        fragmentWithRemainingParts.append(p);
      }

      firstSelectedChild.after(fragmentWithRemainingParts);
    }
  }
  //
  //

  function clearElementsFromListToP() {
    addTag("selected");

    function getFragmentWithLiFromSelectedText() {
      let fragmentWithLi = document.createDocumentFragment(),
        firstSelectedLi = getSecondChildInMainContainer(anchorNode),
        ul = getChildOfMainContainer(anchorNode),
        ulChildren = ul.children,
        indexOfFirstSelectedLi = getChildIndex(firstSelectedLi, ul),
        getFirstSelectedLi = () => ulChildren[indexOfFirstSelectedLi];

      while (getFirstSelectedLi()) {
        fragmentWithLi.append(getFirstSelectedLi());
      }

      return fragmentWithLi;
    }

    let ul = getChildOfMainContainer(anchorNode),
      fragmentWithLi = getFragmentWithLiFromSelectedText();

    function replaceLiToP(fragmentWithLi) {
      let childrenOfFragmentWithLi = fragmentWithLi.children,
        amountOfChildrenOfFragmentWithLi = childrenOfFragmentWithLi.length;

      for (let i = 0; i < amountOfChildrenOfFragmentWithLi; i++) {
        let child = childrenOfFragmentWithLi[i],
          innerHTMLOfChild = child.innerHTML,
          p = document.createElement("P");

        p.innerHTML = innerHTMLOfChild;
        fragmentWithLi.replaceChild(p, child);
      }

      return fragmentWithLi;
    }

    let fragmentWithP = replaceLiToP(fragmentWithLi);

    ul.after(fragmentWithP);

    function getSelectedPartsInFirstP() {
      let querySelector = "[class*=selected]",
        selectedParts = document.querySelectorAll(querySelector),
        selectedPartsInFirstP = [],
        firstPart = selectedParts[0],
        isInTheSameContainer = (index) => {
          let currentPart = selectedParts[index];

          return (
            getChildOfMainContainer(firstPart) ===
            getChildOfMainContainer(currentPart)
          );
        };

      for (let i = 0; isInTheSameContainer(i); i++) {
        let currentPart = selectedParts[i];

        selectedPartsInFirstP.push(currentPart);
      }

      return selectedPartsInFirstP;
    }

    function getSelectedPartsInLastP() {
      let querySelector = "[class*=selected]",
        selectedParts = document.querySelectorAll(querySelector);

      let amountOfSelectedParts = selectedParts.length,
        indexOfLastSelectedPart = amountOfSelectedParts - 1,
        j = indexOfLastSelectedPart,
        lastPart = selectedParts[indexOfLastSelectedPart],
        selectedPartsInLastP = [],
        isInTheSameContainer = () =>
          getChildOfMainContainer(lastPart) ===
          getChildOfMainContainer(selectedParts[j]),
        getCurrentPart = () => selectedParts[j];

      while (isInTheSameContainer()) {
        selectedPartsInLastP.push(getCurrentPart());
        j--;
      }

      return selectedPartsInLastP;
    }

    let querySelector = "[class*=selected]",
      selectedParts = document.querySelectorAll(querySelector),
      amountOfSelectedParts = selectedParts.length;

    let selectedPartsInFirstP = getSelectedPartsInFirstP(),
      amountOfSelectedPartsInFirstP = selectedPartsInFirstP.length,
      indexOfLastPartInSelectedPartsInFirstP =
        amountOfSelectedPartsInFirstP - 1;

    let selectedPartsInLastP = getSelectedPartsInLastP(),
      amountOfSelectedPartsInLastP = selectedPartsInLastP.length,
      indexOfFirstPartInSelectedPartsInLastP =
        amountOfSelectedParts - amountOfSelectedPartsInLastP;

    selectedPartsInLastP.reverse();

    let bigFirstContent = "",
      bigLastContent = "",
      lastSelectedP = lastSelectedChild;

    function makeBigContent(someParts) {
      let bigContent = "",
        amountOfParts = someParts.length;

      for (let i = 0; i < amountOfParts; i++) {
        let part = someParts[i],
          contentOfPart = part.textContent;

        bigContent = bigContent.concat(contentOfPart);
        part.remove();
      }

      return bigContent;
    }

    bigFirstContent = makeBigContent(selectedPartsInFirstP);
    bigLastContent = makeBigContent(selectedPartsInLastP);

    let textNodeWithBigFirstContent = createTextNode(bigFirstContent),
      textNodeWithBigLastContent = createTextNode(bigLastContent);

    // Add parts what removed from formating to first and last selected nodes
    let firstSelectedP = firstSelectedChild.nextElementSibling;

    firstSelectedP.append(textNodeWithBigFirstContent);
    lastSelectedP.prepend(textNodeWithBigLastContent);

    let isSumOfTwoSelectedPartsEqualToAmountOfAllSelectedParts =
      amountOfSelectedParts !==
      amountOfSelectedPartsInFirstP + amountOfSelectedPartsInLastP;

    // Clean format of remaining parts if there are such
    if (isSumOfTwoSelectedPartsEqualToAmountOfAllSelectedParts) {
      function getRemainingFragmentParts() {
        let arrayWithRemainingFragmentParts = [];

        for (
          let i = indexOfLastPartInSelectedPartsInFirstP + 1;
          i < indexOfFirstPartInSelectedPartsInLastP;
          i++
        ) {
          let currentPart = selectedParts[i];

          arrayWithRemainingFragmentParts.push(currentPart);
        }
        return arrayWithRemainingFragmentParts;
      }

      let arrayWithRemainingFragmentParts = getRemainingFragmentParts(),
        getAmountOfRemainingParts = () =>
          arrayWithRemainingFragmentParts.length;

      let fragmentWithRemainingParts = document.createDocumentFragment();

      while (getAmountOfRemainingParts() !== 0) {
        let firstPart = arrayWithRemainingFragmentParts[0],
          commonParent = getChildOfMainContainer(firstPart),
          p = document.createElement("P");

        while (
          commonParent ===
          getChildOfMainContainer(arrayWithRemainingFragmentParts[0])
        ) {
          let firstPart = arrayWithRemainingFragmentParts[0],
            textOfFirstPart = firstPart.textContent,
            textNodeWithTextOfFirstPart = createTextNode(textOfFirstPart);

          p.append(textNodeWithTextOfFirstPart);
          firstPart.remove();
          arrayWithRemainingFragmentParts.shift();

          let newFirstPart = arrayWithRemainingFragmentParts[0];

          if (newFirstPart === undefined) {
            break;
          }
        }

        commonParent.remove();
        fragmentWithRemainingParts.append(p);
      }

      firstSelectedP.after(fragmentWithRemainingParts);
    }
  }

  let isFirstChildUL = nameOfFirstSelectedChild === "UL",
    isFirstChildOL = nameOfFirstSelectedChild === "OL",
    isFirstChildParagraph = nameOfFirstSelectedChild === "P",
    isLastChildUL = nameOfLastSelectedChild === "UL",
    isLastChildOL = nameOfLastSelectedChild === "OL",
    isLastChildParapgraph = nameOfLastSelectedChild === "P";

  let isFirstChildList = isFirstChildUL || isFirstChildOL,
    isLastChildList = isLastChildUL || isLastChildOL;

  let isFirstListAndLastParagraph = isFirstChildList && isLastChildParapgraph,
    isFirstParagraphAndLastList = isFirstChildParagraph && isLastChildList,
    isBothParagraphs = isFirstChildParagraph && isLastChildParapgraph,
    isBothLists = isFirstChildList && isLastChildList,
    isThereListBetween = false;

  function checkListBetween() {
    let mainContainer = document.getElementById("work-area"),
      mainContainerChildren = mainContainer.children,
      indexOfFirstUnselectedChild = indexOfFirstSelectedChild + 1,
      indexOfLastUnselectedChild = indexOfLastSelectedChild - 1;

    for (
      let i = indexOfFirstUnselectedChild;
      i <= indexOfLastUnselectedChild;
      i++
    ) {
      let child = mainContainerChildren[i],
        childName = child.nodeName;

      if (childName === "UL" || childName === "OL") {
        return true;
      }
    }
  }
  isThereListBetween = checkListBetween();

  let mainContainerChildren = mainContainer.children;

  function formatBothP() {
    addTag("selected");

    function getSelectedPartsInFirstP() {
      let querySelector = "[class*=selected]",
        selectedParts = document.querySelectorAll(querySelector),
        selectedPartsInFirstP = [],
        amountOfSelectedPartsInFirstP = 0,
        firstPart = selectedParts[0],
        part = selectedParts[amountOfSelectedPartsInFirstP];

      while (
        getChildOfMainContainer(firstPart) === getChildOfMainContainer(part)
      ) {
        amountOfSelectedPartsInFirstP = selectedPartsInFirstP.length;

        selectedPartsInFirstP.push(part);

        part = selectedParts[++amountOfSelectedPartsInFirstP];
      }

      return selectedPartsInFirstP;
    }

    let selectedPartsInFirstP = getSelectedPartsInFirstP();

    function getSelectedPartsInLastP() {
      let querySelector = "[class*=selected]",
        selectedParts = document.querySelectorAll(querySelector),
        selectedPartsInLastP = [],
        amountOfSelectedParts = selectedParts.length,
        indexOfLastSelectedPart = amountOfSelectedParts - 1,
        lastPart = selectedParts[indexOfLastSelectedPart];

      while (
        getChildOfMainContainer(lastPart) ===
        getChildOfMainContainer(selectedParts[indexOfLastSelectedPart])
      ) {
        selectedPartsInLastP.push(selectedParts[indexOfLastSelectedPart]);
        indexOfLastSelectedPart--;
      }

      return selectedPartsInLastP;
    }

    let selectedPartsInLastP = getSelectedPartsInLastP();

    selectedPartsInLastP.reverse();

    let querySelector = "[class*=selected]",
      selectedParts = document.querySelectorAll(querySelector),
      amountOfSelectedParts = selectedParts.length;

    let amountOfSelectedPartsInFirstP = selectedPartsInFirstP.length,
      indexOfLastPartInSelectedPartsInFirstP =
        amountOfSelectedPartsInFirstP - 1;

    let insteadOfJ = amountOfSelectedParts - selectedPartsInLastP.length - 1;
    indexOfLastSelectedPart = amountOfSelectedParts - 1;

    let amountOfSelectedPartsInLastP = indexOfLastSelectedPart - insteadOfJ,
      indexOfFirstPartInSelectedPartsInLastP =
        amountOfSelectedParts - selectedPartsInLastP.length;
    amountOfSelectedParts = selectedParts.length;

    let bigFirstContent = "",
      bigLastContent = "",
      firstSelectedP = firstSelectedChild,
      lastSelectedP = lastSelectedChild;

    function makeBigContent(someParts) {
      let bigContent = "",
        amountOfParts = someParts.length;

      for (let i = 0; i < amountOfParts; i++) {
        let part = someParts[i],
          contentOfPart = part.textContent;

        bigContent = bigContent.concat(contentOfPart);
        part.remove();
      }

      return bigContent;
    }

    bigFirstContent = makeBigContent(selectedPartsInFirstP);
    bigLastContent = makeBigContent(selectedPartsInLastP);

    let textNodeWithBigFirstContent = createTextNode(bigFirstContent),
      textNodeWithBigLastContent = createTextNode(bigLastContent);

    firstSelectedP.append(textNodeWithBigFirstContent);
    lastSelectedP.prepend(textNodeWithBigLastContent);

    // Clean format of remaining parts if there are such
    if (
      amountOfSelectedParts !==
      amountOfSelectedPartsInFirstP + amountOfSelectedPartsInLastP
    ) {
      let arrayWithRemainingFragmentParts = [];

      for (
        let i = indexOfLastPartInSelectedPartsInFirstP + 1;
        i < indexOfFirstPartInSelectedPartsInLastP;
        i++
      ) {
        let currentPart = selectedParts[i];

        arrayWithRemainingFragmentParts.push(currentPart);
      }

      let fragmentWithRemainingParts = document.createDocumentFragment(),
        amountOfRemainingParts = arrayWithRemainingFragmentParts.length;

      while (amountOfRemainingParts !== 0) {
        let firstRemainingPart = arrayWithRemainingFragmentParts[0],
          commonParent = getChildOfMainContainer(firstRemainingPart),
          p = document.createElement("P");

        while (commonParent === getChildOfMainContainer(firstRemainingPart)) {
          let strippedContent = firstRemainingPart.textContent,
            textNodeWithStrippedContent = createTextNode(strippedContent);

          p.append(textNodeWithStrippedContent);
          firstRemainingPart.remove();
          arrayWithRemainingFragmentParts.shift();

          firstRemainingPart = arrayWithRemainingFragmentParts[0];

          if (firstRemainingPart === undefined) {
            break;
          }
        }

        commonParent.remove();
        fragmentWithRemainingParts.append(p);
        amountOfRemainingParts = arrayWithRemainingFragmentParts.length;
      }

      firstSelectedP.after(fragmentWithRemainingParts);
    }
  }

  function formatBothLists() {
    addTag("selected");

    function clearSelectedTags() {
      function turnFirstAndLastListElementsIntoParagraphs() {
        function getFragmentOfFirstSelectedLiElements(firstLi, firstUL) {
          let fragmentWithFirstLi = document.createDocumentFragment(),
            indexOfFirstSelectedLi = getChildIndex(firstLi, firstUL),
            firstULChildren = firstUL.children,
            getFirstSelectedLi = () => firstULChildren[indexOfFirstSelectedLi];

          while (getFirstSelectedLi()) {
            fragmentWithFirstLi.append(getFirstSelectedLi());
          }

          return fragmentWithFirstLi;
        }

        function getFragmentOfLastSelectedLiElements(lastLi, lastUL) {
          let fragmentWithLastLi = document.createDocumentFragment(),
            lastULChildren = lastUL.children,
            indexOfLastLi = getChildIndex(lastLi, lastUL),
            getFirstLi = () => lastULChildren[0],
            getLiAfterLastSelectedLi = () => lastULChildren[indexOfLastLi + 1];

          while (getFirstLi() !== getLiAfterLastSelectedLi()) {
            fragmentWithLastLi.append(getFirstLi());
            indexOfLastLi--;
          }

          return fragmentWithLastLi;
        }

        function getLiTurnedIntoP(fragment) {
          let childrenOfFragmentWithLi = fragment.children,
            amountOfChildrenOfFragmentWithLi = childrenOfFragmentWithLi.length;

          for (let i = 0; i < amountOfChildrenOfFragmentWithLi; i++) {
            let child = childrenOfFragmentWithLi[i],
              innerHTMLOfChild = child.innerHTML,
              p = document.createElement("P");

            p.innerHTML = innerHTMLOfChild;
            fragment.replaceChild(p, child);
          }

          let fragmentWithP = fragment;

          return fragmentWithP;
        }

        function insertClearedFirstAndLastP() {
          let firstLi = getSecondChildInMainContainer(anchorNode),
            firstUL = getChildOfMainContainer(anchorNode),
            fragmentWithFirstLi = getFragmentOfFirstSelectedLiElements(
              firstLi,
              firstUL
            ),
            fragmentWithFirstP = getLiTurnedIntoP(fragmentWithFirstLi);

          let lastLi = getSecondChildInMainContainer(focusNode),
            lastUL = getChildOfMainContainer(focusNode),
            fragmentWithLastLi = getFragmentOfLastSelectedLiElements(
              lastLi,
              lastUL
            ),
            fragmentWithLastP = getLiTurnedIntoP(fragmentWithLastLi);

          firstUL.after(fragmentWithFirstP);
          lastUL.before(fragmentWithLastP);
        }

        insertClearedFirstAndLastP();
      }

      turnFirstAndLastListElementsIntoParagraphs();

      function getSelectedPartsInFirstP() {
        let querySelector = "[class*=selected]",
          selectedParts = document.querySelectorAll(querySelector),
          selectedPartsInFirstP = [],
          indexOfCurrentPart = 0,
          firstPart = selectedParts[0],
          part = selectedParts[indexOfCurrentPart];

        while (
          getChildOfMainContainer(firstPart) === getChildOfMainContainer(part)
        ) {
          part = selectedParts[indexOfCurrentPart];

          selectedPartsInFirstP.push(part);
          indexOfCurrentPart++;

          part = selectedParts[indexOfCurrentPart];
        }

        return selectedPartsInFirstP;
      }

      let selectedPartsInFirstP = getSelectedPartsInFirstP();

      function getSelectedPartsInLastP() {
        let querySelector = "[class*=selected]",
          selectedParts = document.querySelectorAll(querySelector),
          selectedPartsInLastP = [],
          amountOfSelectedParts = selectedParts.length,
          indexOfLastSelectedPart = amountOfSelectedParts - 1,
          lastPart = selectedParts[indexOfLastSelectedPart];

        let indexOfCurrentPartInLastP = indexOfLastSelectedPart;

        while (
          getChildOfMainContainer(lastPart) ===
          getChildOfMainContainer(selectedParts[indexOfCurrentPartInLastP])
        ) {
          selectedPartsInLastP.push(selectedParts[indexOfCurrentPartInLastP]);
          indexOfCurrentPartInLastP--;
        }

        return selectedPartsInLastP;
      }

      let selectedPartsInLastP = getSelectedPartsInLastP(),
        amountOfSelectedPartsInLastP = selectedPartsInLastP.length;
      selectedPartsInLastP.reverse();

      let querySelector = "[class*=selected]",
        selectedParts = document.querySelectorAll(querySelector),
        amountOfSelectedParts = selectedParts.length,
        indexOfLastSelectedPart = amountOfSelectedParts - 1;

      let indexOfCurrentPartInLastP =
        amountOfSelectedParts - amountOfSelectedPartsInLastP - 1;

      let indexOfFirstPartInSelectedPartsInLastP =
        indexOfCurrentPartInLastP + 1;
      amountOfSelectedParts = selectedParts.length;

      function makeBigContent(someParts) {
        let bigContent = "",
          amountOfParts = someParts.length;

        for (let i = 0; i < amountOfParts; i++) {
          let part = someParts[i],
            contentOfPart = part.textContent;

          bigContent = bigContent.concat(contentOfPart);
          part.remove();
        }

        return bigContent;
      }

      function removeFormattingInFirstSelectedElement(selectedPartsInFirstP) {
        let bigFirstContent = makeBigContent(selectedPartsInFirstP),
          textNodeWithBigFirstContent = createTextNode(bigFirstContent);

        //Append and prepend clear parts
        //
        let firstSelectedP = firstSelectedChild.nextElementSibling;
        firstSelectedP.append(textNodeWithBigFirstContent);

        return firstSelectedP;
      }
      let firstSelectedP = removeFormattingInFirstSelectedElement(
        selectedPartsInFirstP
      );

      function removeFormattingInLastSelectedElement(selectedPartsInLastP) {
        let bigLastContent = makeBigContent(selectedPartsInLastP),
          textNodeWithBigLastContent = createTextNode(bigLastContent);

        //Append and prepend clear parts
        //
        let lastSelectedP = lastSelectedChild.previousSibling;
        lastSelectedP.prepend(textNodeWithBigLastContent);
      }
      removeFormattingInLastSelectedElement(selectedPartsInLastP);

      let someAmount = indexOfLastSelectedPart - indexOfCurrentPartInLastP;

      let indexOfCurrentPart = selectedPartsInFirstP.length,
        amountOfSelectedPartsInFirstP = indexOfCurrentPart;

      let summaOfFirstAndLastSelectedParts =
          amountOfSelectedPartsInFirstP + someAmount,
        isThereExtraParts =
          amountOfSelectedParts !== summaOfFirstAndLastSelectedParts;

      // Clean format of remaining parts if there are such
      if (isThereExtraParts) {
        function clearRemainingParts() {
          let arrayWithRemainingFragmentParts = [],
            indexOfCurrentPart = selectedPartsInFirstP.length,
            indexOfLastPartInSelectedPartsInFirstP = indexOfCurrentPart - 1;

          for (
            let i = indexOfLastPartInSelectedPartsInFirstP + 1;
            i < indexOfFirstPartInSelectedPartsInLastP;
            i++
          ) {
            arrayWithRemainingFragmentParts.push(selectedParts[i]);
          }

          let fragmentWithRemainingParts = document.createDocumentFragment();

          while (arrayWithRemainingFragmentParts.length !== 0) {
            let commonParent = getChildOfMainContainer(
                arrayWithRemainingFragmentParts[0]
              ),
              p = document.createElement("P");

            while (
              commonParent ===
              getChildOfMainContainer(arrayWithRemainingFragmentParts[0])
            ) {
              let part = arrayWithRemainingFragmentParts[0],
                strippedContent = part.textContent,
                textNodeWithStrippedContent = createTextNode(strippedContent);

              p.append(textNodeWithStrippedContent);
              part.remove();
              arrayWithRemainingFragmentParts.shift();

              if (arrayWithRemainingFragmentParts[0] === undefined) {
                break;
              }
            }

            commonParent.remove();
            fragmentWithRemainingParts.append(p);
          }

          firstSelectedP.after(fragmentWithRemainingParts);
        }

        clearRemainingParts();
      }
    }

    clearSelectedTags();
  }

  if (distance > 2) {
    if (isThereListBetween) {
      function replaceBetweenLists() {
        let listsBetween = [],
          numberOfIndex = 0;

        for (
          let index = indexOfFirstSelectedChild + 1,
            someIndex = indexOfLastSelectedChild - 1;
          index <= someIndex;
          index++
        ) {
          let child = mainContainerChildren[index],
            childName = child.nodeName,
            isList = childName === "UL" || childName === "OL";

          if (isList) {
            listsBetween[numberOfIndex] = child;
            numberOfIndex++;
          }
        }

        let fragment = document.createDocumentFragment();

        for (let index = 0; index < numberOfIndex; index++) {
          let list = listsBetween[index];

          while (list.firstChild) {
            let p = document.createElement("P"),
              firstChild = list.firstChild,
              textOfFirstChild = firstChild.textContent;

            p.textContent = textOfFirstChild;
            fragment.append(p);
            firstChild.remove();
          }

          list.before(fragment);
          list.remove();
        }
      }

      replaceBetweenLists();
    }
    if (isBothParagraphs) {
      formatBothP();
    } else if (isFirstParagraphAndLastList) {
      clearElementsFromPToList();
    } else if (isFirstListAndLastParagraph) {
      clearElementsFromListToP();
    } else if (isBothLists) {
      formatBothLists();
    }
  } else if (distance === 2) {
    if (isBothParagraphs) {
      formatBothP();
    } else if (isFirstParagraphAndLastList) {
      clearElementsFromPToList();
    } else if (isFirstListAndLastParagraph) {
      clearElementsFromListToP();
    }
  } else if (distance === 1) {
    let firstLevelChildOfMainContainer = getChildOfMainContainer(anchorNode),
      nameOfFirstLevelChildOfMainContainer =
        firstLevelChildOfMainContainer.nodeName;
    if (
      nameOfFirstLevelChildOfMainContainer === "UL" ||
      nameOfFirstLevelChildOfMainContainer === "OL"
    ) {
      var firstSelectedLi = getSecondChildInMainContainer(anchorNode),
        lastSelectedLi = getSecondChildInMainContainer(focusNode),
        ul = getChildOfMainContainer(anchorNode),
        ulChildren = ul.children,
        indexOfFirstSelectedLi = getChildIndex(firstSelectedLi, ul),
        indexOfLastSelectedLi = getChildIndex(lastSelectedLi, ul),
        fragmentAfterUL = document.createDocumentFragment();

      if (indexOfFirstSelectedLi > indexOfLastSelectedLi) {
        [indexOfFirstSelectedLi, indexOfLastSelectedLi] = [
          indexOfLastSelectedLi,
          indexOfFirstSelectedLi,
        ];
        [firstSelectedLi, lastSelectedLi] = [lastSelectedLi, firstSelectedLi];
      }

      let distanceBetweenSelectedLiElements =
        indexOfLastSelectedLi - indexOfFirstSelectedLi + 1;

      if (distanceBetweenSelectedLiElements >= 2) {
        let someFragment = document.createDocumentFragment(),
          elementsBetweenFirstAndLastSelectedLiElements = [],
          i = 0;

        while (ulChildren[indexOfFirstSelectedLi + 1] !== lastSelectedLi) {
          let child = ulChildren[indexOfFirstSelectedLi + 1];

          elementsBetweenFirstAndLastSelectedLiElements[i] = child;

          someFragment.appendChild(clearElement(child));
          i++;
        }

        selection.deleteFromDocument();

        let firstFragmentChild = fragmentChildren[0],
          lastFragmentChild = fragmentChildren[fragmentChildrenAmount - 1],
          textOfFirstSelectedLi = firstFragmentChild.textContent,
          textOfLastSelectedLi = lastFragmentChild.textContent;

        if (indexOfFirstSelectedLi !== indexOfLastSelectedLi) {
          firstSelectedLi.append(textOfFirstSelectedLi);
          lastSelectedLi.prepend(textOfLastSelectedLi);
          firstSelectedLi.after(someFragment);
        } else {
          firstSelectedLi.append(textOfFirstSelectedLi);
        }

        let indexBeginning = indexOfFirstSelectedLi,
          indexEnd = indexOfLastSelectedLi,
          amountOfLi = indexEnd + 1;
        ulChildrenAmount = ulChildren.length;

        while (indexBeginning !== amountOfLi) {
          let firstChild = ulChildren[indexBeginning];

          fragmentAfterUL.append(firstChild);
          amountOfLi--;
        }

        let childrenOfFragmentAfterUL = fragmentAfterUL.children,
          amountOfChildrenOfFragmentAfterUL = childrenOfFragmentAfterUL.length;

        for (let i = 0; i < amountOfChildrenOfFragmentAfterUL; i++) {
          let child = fragmentAfterUL.children[i],
            innerHTMLOfChild = child.innerHTML,
            p = document.createElement("P");

          p.innerHTML = innerHTMLOfChild;
          fragmentAfterUL.replaceChild(p, child);
        }

        ulChildrenAmount = ulChildren.length;

        let indexOfEnd = ulChildrenAmount - 1;

        if (indexOfFirstSelectedLi === 0) {
          ul.before(fragmentAfterUL);
        } else if (indexOfLastSelectedLi === indexOfEnd) {
          ul.after(fragmentAfterUL);
        } else {
          let indexOfLastLiInFirstPart = indexOfFirstSelectedLi - 1,
            firstPart = document.createDocumentFragment(),
            lastPart = document.createDocumentFragment(),
            mainContainer = document.getElementById("work-area"),
            childrenOfMainContainer = mainContainer.children,
            ulIndex = getChildIndexInMainContainer(ul),
            ulName = ul.nodeName,
            ulChildren = ul.children,
            amountOfChildrenOfUl = ulChildren.length;

          while (indexOfLastLiInFirstPart >= 0) {
            let firstChild = ulChildren[0];

            firstPart.appendChild(firstChild);
            indexOfLastLiInFirstPart--;
          }

          amountOfChildrenOfUl = ulChildren.length;
          while (amountOfChildrenOfUl !== 0) {
            let firstChildOfUl = ulChildren[0];

            lastPart.appendChild(firstChildOfUl);
            amountOfChildrenOfUl--;
          }

          ul.remove();

          let firstUl = document.createElement(ulName),
            lastUl = document.createElement(ulName),
            childOfMainContainer = childrenOfMainContainer[ulIndex];

          firstUl.appendChild(firstPart);
          lastUl.appendChild(lastPart);

          mainContainer.insertBefore(firstUl, childOfMainContainer);
          mainContainer.insertBefore(fragmentAfterUL, childOfMainContainer);
          mainContainer.insertBefore(lastUl, childOfMainContainer);
        }
      } else if (distanceBetweenSelectedLiElements === 1) {
        //Fix this function
        //
        function clearSelectedTags() {
          let secondFirstParent = getSecondChildInMainContainer(anchorNode)
              .parentElement,
            secondLastParent = getSecondChildInMainContainer(focusNode)
              .parentElement;

          if (secondFirstParent === secondLastParent) {
            let tags = [],
              tag = anchorNode,
              tagParent = tag.parentElement,
              i = 0,
              ul = getChildOfMainContainer(anchorNode),
              li = getChild(anchorNode, ul);

            while (tagParent !== li) {
              tags[i] = tagParent;
              i++;
              tagParent = tagParent.parentElement;
            }

            for (let g = 0; g < i; g++) {
              let tag = tags[g],
                nameOfTag = tag.nodeName,
                nameOfTagInLowerCase = nameOfTag.toLowerCase();

              addTag(nameOfTagInLowerCase);
            }
            range = selection.getRangeAt(0);

            let newFragmentt = range.cloneContents(),
              textOfNewFragmentt = newFragmentt.textContent,
              textNodeFromNewFragmentt = createTextNode(textOfNewFragmentt);

            selection.deleteFromDocument();
            range.insertNode(textNodeFromNewFragmentt);
          } else {
            let ul = getChildOfMainContainer(anchorNode),
              li = getChild(anchorNode, ul),
              parentTag = getChild(anchorNode, li);

            selection.deleteFromDocument();
            parentTag.after(createTextNode(strippedContent));
          }
        }
        //
        //
        clearSelectedTags();

        function turnLiElementIntoParagraph() {
          let indexBeginning = indexOfFirstSelectedLi,
            indexEnd = indexOfLastSelectedLi,
            amountOfLi = indexEnd + 1,
            mainContainer = document.getElementById("work-area");

          var indexOfLastLiInFirstPart = indexOfFirstSelectedLi - 1,
            firstPart = document.createDocumentFragment(),
            lastPart = document.createDocumentFragment(),
            childrenOfMainContainer = mainContainer.children,
            ulIndex = getChildIndexInMainContainer(ul),
            ulName = ul.nodeName,
            ulChildren = ul.children,
            amountOfChildrenOfUl = ulChildren.length;

          while (indexBeginning !== amountOfLi) {
            let firstChild = ulChildren[indexBeginning];

            fragmentAfterUL.append(firstChild);
            amountOfLi--;
          }

          for (
            let i = 0,
              childrenOfFragmentAfterUL = fragmentAfterUL.children,
              amountOfChildren = childrenOfFragmentAfterUL.length;
            i < amountOfChildren;
            i++
          ) {
            let child = fragmentAfterUL.children[i],
              innerHTMLOfChild = child.innerHTML,
              p = document.createElement("P");

            p.innerHTML = innerHTMLOfChild;
            fragmentAfterUL.replaceChild(p, child);
          }

          while (indexOfLastLiInFirstPart >= 0) {
            let firstChild = ulChildren[0];

            firstPart.appendChild(firstChild);
            indexOfLastLiInFirstPart--;
          }

          amountOfChildrenOfUl = ulChildren.length;
          while (amountOfChildrenOfUl !== 0) {
            let firstChildOfUl = ulChildren[0];

            lastPart.appendChild(firstChildOfUl);
            amountOfChildrenOfUl--;
          }

          ul.remove();

          let firstUl = document.createElement(ulName),
            lastUl = document.createElement(ulName),
            childOfMainContainer = childrenOfMainContainer[ulIndex];

          firstUl.appendChild(firstPart);
          lastUl.appendChild(lastPart);

          mainContainer.insertBefore(firstUl, childOfMainContainer);
          mainContainer.insertBefore(fragmentAfterUL, childOfMainContainer);
          mainContainer.insertBefore(lastUl, childOfMainContainer);
        }

        turnLiElementIntoParagraph();
      }
    } else {
      function clearTagsInParagraph() {
        let secondFirstParent = getSecondChildInMainContainer(anchorNode),
          secondLastParent = getSecondChildInMainContainer(focusNode);

        if (secondFirstParent === secondLastParent) {
          let tags = [],
            tag = anchorNode,
            tagParent = tag.parentElement,
            i = 0;
          fragmentChildren;

          while (tagParent !== firstSelectedChild) {
            tags[i] = tagParent;
            i++;
            tagParent = tagParent.parentElement;
          }

          for (let g = 0; g < i; g++) {
            let tag = tags[g],
              nameOfTag = tag.nodeName,
              nameOfTagInLowerCase = nameOfTag.toLowerCase();

            addTag(nameOfTagInLowerCase);
          }
          range = selection.getRangeAt(0);

          let newFragmentt = range.cloneContents(),
            textOfNewFragmentt = newFragmentt.textContent,
            textNodeFromNewFragmentt = createTextNode(textOfNewFragmentt);

          selection.deleteFromDocument();
          range.insertNode(textNodeFromNewFragmentt);
        } else {
          let p = getChildOfMainContainer(anchorNode),
            parentTag = getChild(anchorNode, p);

          selection.deleteFromDocument();
          parentTag.after(createTextNode(strippedContent));
        }
      }

      clearTagsInParagraph();
    }
  }

  selection.empty();
  clearEmptyContainers();
}

var copies = [],
  currentCopy = -1;

function makeCopyOfMainContainer() {
  let amountOfCopies = () => copies.length,
    indexOfLastCopy = () => amountOfCopies() - 1;

  if (currentCopy < indexOfLastCopy() && amountOfCopies() >= 1) {
    while (indexOfLastCopy() > currentCopy) {
      copies.pop();
    }
  }

  let mainContainer = document.getElementById("work-area"),
    clonedMainContainer = mainContainer.cloneNode(true);

  copies.push(clonedMainContainer);
  currentCopy++;
}

function undo() {
  let previousCopy = currentCopy - 1;

  if (previousCopy > -1) {
    let copyOfMainContainer = copies[previousCopy],
      mainContainer = document.getElementById("work-area"),
      toolbar = document.getElementById("sample-toolbar");

    mainContainer.remove();
    toolbar.after(copyOfMainContainer);

    currentCopy -= 2;
  }
}

function redo() {
  let amountOfCopies = copies.length,
    indexOfLastCopy = amountOfCopies - 1;

  if (currentCopy !== indexOfLastCopy && amountOfCopies !== 0) {
    if (currentCopy === -1) {
      currentCopy += 2;
    } else {
      currentCopy++;
    }

    let copyOfMainContainer = copies[currentCopy],
      mainContainer = document.getElementById("work-area"),
      toolbar = document.getElementById("sample-toolbar");

    mainContainer.remove();
    toolbar.after(copyOfMainContainer);

    if (currentCopy < indexOfLastCopy) {
      currentCopy++;
    }
  }
}

var spanWithFormula = document.getElementById("span-formula"),
  savedSelection;

function moveSpanUnderCaret() {
  let selection = document.getSelection(),
    range = selection.getRangeAt(0),
    span = spanWithFormula.cloneNode(true);

  savedSelection = rangy.saveSelection();

  span.setAttribute("id", "cloned-span-with-formula");

  span.style.display = "block";

  range.insertNode(span);

  span.style.top = span.offsetTop + 5 + "px";
  span.style.left = span.offsetLeft - 30 + "px";

  let childrenOfSpan = span.children,
    inputWithFormula = childrenOfSpan[1];

  inputWithFormula.setAttribute("id", "cloned-formula");

  inputWithFormula.focus();

  inputWithFormula.onblur = () => {
    window.setTimeout(() => {
      span.remove();
      rangy.removeMarkers(savedSelection);
    }, 300);
  };

  let saveButton = childrenOfSpan[2];
  console.log(saveButton);

  inputWithFormula.onkeydown = (event) => {
    if (event.keyCode === 13) {
      saveButton.click();
    }
  };
}

function makeFormula() {
  rangy.restoreSelection(savedSelection);

  let selection = document.getSelection();
  selection.collapseToEnd();

  let span = document.createElement("span");

  let range = selection.getRangeAt(0);
  range.insertNode(span);

  let inputWithFormula = document.getElementById("cloned-formula"),
    formula = inputWithFormula.value;

  katex.render(formula, span, {
    throwOnError: false,
  });

  selection.empty();
  inputWithFormula.value = "";

  let someSpanWithFormula = document.getElementById("cloned-span-with-formula");

  someSpanWithFormula.remove();
}
