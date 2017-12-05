

function getAllItems() {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/item.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var json = request.response;
        for (items in json["data"]) {
            let mySpan = document.createElement("span");
            let myImg = document.createElement("img");
            let myTitle = document.createElement("span");
            myImg.src = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/item/" + json["data"][items]["image"]["full"];
            myTitle.innerText = json["data"][items]["name"];
            mySpan.appendChild(myImg);
            mySpan.appendChild(myTitle);
            document.getElementById("searchRow").appendChild(mySpan);
        }
    };
}

function getAllChampions() {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/champion.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var json = request.response;
        for (champion in json["data"]) {
            let mySpan = document.createElement("span");
            let myImg = document.createElement("img");
            let myTitle = document.createElement("span");
            myImg.src = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + json["data"][champion]["image"]["full"];
            myTitle.innerText = json["data"][champion]["name"];
            mySpan.appendChild(myImg);
            mySpan.appendChild(myTitle);
            document.getElementById("searchRow").appendChild(mySpan);
        }
    };
}

// function getRunes() {
//     var json = JSON.parse(runeData);
//     console.log(json);
// }

function loadJSON(callback) {
    let runeData = ".\\json\\perks.json"

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', runeData, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {

            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);

        }
    }
    xobj.send(null);

}

// Call to function with anonymous callback
loadJSON(function (response) {
    // Do Something with the response e.g.
    jsonresponse = JSON.parse(response);
    console.log(jsonresponse);
});
