var request = new XMLHttpRequest();
var requestURL = "http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/item.json";

request.open("GET", requestURL);

request.responseType = "json";
request.send();

request.onload = function () {
    var json = request.response;
    for (items in json["data"]) {
        let mySpan = document.createElement("span");
        let myImg = document.createElement("img");
        let myTitle = document.createElement("span");
        myImg.src = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/" + json["data"][items]["image"]["full"];
        myTitle.innerText = json["data"][items]["name"];
        mySpan.appendChild(myImg);
        mySpan.appendChild(myTitle);
        document.getElementById("searchRow").appendChild(mySpan);
    }


    // document.getElementById("items").innerText = json["data"]["1001"]["name"];
};
