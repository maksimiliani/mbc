var DEFAULT_SITEMAP_URL = '/sitemap/sitemap.xml';
var DEFAULT_TARGET_ID = 'sitemap_content';

window.addEventListener('load', function () {
    buildSitemap();
});

window.buildSitemap = function (options) {
    var opts = options || {};
    var sitemapUrl = opts.sitemapUrl || DEFAULT_SITEMAP_URL;
    var targetId = opts.targetId || DEFAULT_TARGET_ID;
    getRows(sitemapUrl, targetId);
};

function getRows(sitemapUrl, targetId) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('get', sitemapUrl, true);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status === 200) {
            showResult(this, targetId);
            return;
        }
        if (sitemapUrl !== '../sitemap/sitemap.xml') {
            getRows('../sitemap/sitemap.xml', targetId);
        }
    };
    xmlhttp.send(null);
}

function showResult(xmlhttp, targetId) {
    var xmlDoc = xmlhttp.responseXML && xmlhttp.responseXML.documentElement;
    if (!xmlDoc) return;
    removeWhitespace(xmlDoc);
    var target = document.getElementById(targetId);
    if (!target) return;
    var list = target.querySelector('ul');
    if (!list) {
        list = document.createElement('ul');
        target.appendChild(list);
    }
    var rowData = xmlDoc.getElementsByTagName('url');
    list.innerHTML = '';
    addListItemsFromXmlDoc(rowData, list);
}

function addListItemsFromXmlDoc(xmlNodes, listNode) {
    for (var i = 0; i < xmlNodes.length; i++) {
        var loc = xmlNodes[i].getElementsByTagName('loc')[0];
        if (!loc || !loc.textContent) continue;
        var url = loc.textContent.trim();
        var li = document.createElement('li');
        var lnk = document.createElement('a');
        lnk.setAttribute('href', url);
        lnk.appendChild(document.createTextNode(prettyLabel(url)));
        li.appendChild(lnk);
        listNode.appendChild(li);
    }
}

function prettyLabel(url) {
    try {
        var parsed = new URL(url, window.location.origin);
        var path = parsed.pathname.replace(/\/$/, '');
        if (!path || path === '/') return parsed.origin;
        return path.split('/').pop();
    } catch (_) {
        return url;
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
