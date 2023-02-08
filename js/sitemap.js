window.addEventListener("load", function () {
    getRows();
});

function getRows() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("get", "../sitemap/sitemap.xml", true);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            showResult(this);
        }
    };
    xmlhttp.send(null);
}

function showResult(xmlhttp) {
    var xmlDoc = xmlhttp.responseXML.documentElement;
    removeWhitespace(xmlDoc);
    let ul = document.getElementById("sitemap");
    ul = ul.getElementsByTagName("ul")[0];
    var rowData = xmlDoc.getElementsByTagName("url");

    addTableRowsFromXmlDoc(rowData, ul);
}

function addTableRowsFromXmlDoc(xmlNodes, tableNode) {

    for (i = 0; i < xmlNodes.length; i++) {
        let li = document.createElement("li");
        let lnk = document.createElement("a");
        lnk.setAttribute("href", xmlNodes[i].firstChild.nodeValue);
        li.appendChild(lnk);
        tableNode.appendChild(li);
    }
}

function removeWhitespace(xml) {
    var loopIndex;
    for (loopIndex = 0; loopIndex < xml.childNodes.length; loopIndex++) {
        var currentNode = xml.childNodes[loopIndex];
        if (currentNode.nodeType == 1) {
            removeWhitespace(currentNode);
        }
        if (!(/\S/.test(currentNode.nodeValue)) && (currentNode.nodeType == 3)) {
            xml.removeChild(xml.childNodes[loopIndex--]);
        }
    }
}