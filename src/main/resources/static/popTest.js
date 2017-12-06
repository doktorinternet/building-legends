//popAllItems()
//popAllChampions();
var selectedItemSlot;
var selectedChampion;

function popAllItems() {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/item.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        document.getElementById("list-container").innerHTML = "";
        var json = request.response;
        for (items in json["data"]) {
            let myDiv = document.createElement("div");
            myDiv.setAttribute("class", "item-container");
            let myImg = document.createElement("img");
            myImg.setAttribute("class", "item-thumb");
            myImg.setAttribute("id", items);
            myImg.src = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/item/" + json["data"][items]["image"]["full"];
            let myNameDiv = document.createElement("div");
            myNameDiv.setAttribute("class", "name-container");
            let myName = document.createElement("span");
            myName.innerText = json["data"][items]["name"];
            myDiv.appendChild(myImg);
            myNameDiv.appendChild(myName);
            myDiv.appendChild(myNameDiv);
            document.getElementById("list-container").appendChild(myDiv);
        }
    };
}
function popAllChampions() {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/champion.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        document.getElementById("list-container").innerHTML = "";
        var json = request.response;
        for (champion in json["data"]) {
            let myDiv = document.createElement("div");
            myDiv.setAttribute("class", "champion-container");
            let myImg = document.createElement("img");
            myImg.setAttribute("class", "champion-thumb");
            myImg.setAttribute("id", champion);
            myImg.setAttribute("onclick", "selectChampion(this.id)");
            myImg.src = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + json["data"][champion]["image"]["full"];
            let myNameDiv = document.createElement("div");
            myNameDiv.setAttribute("class", "name-container");
            let myName = document.createElement("span");
            myName.innerText = json["data"][champion]["name"];
            myDiv.appendChild(myImg);
            myNameDiv.appendChild(myName);
            myDiv.appendChild(myNameDiv);
            document.getElementById("list-container").appendChild(myDiv);
        }
    };
}

function selectChampion(champID){
    selectedChampion = champID;
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/champion.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var json = request.response;
        var backgroundImgSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + champID + "_0.jpg\")";
        var thumbSrc= "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + json["data"][champID]["image"]["full"];
        let myImg = document.getElementById("selected-champion-thumb");
        myImg.src = thumbSrc;
        document.getElementById("body").style.backgroundImage = backgroundImgSrc;
    }
}
function selectItemSlot(itemSlot){
    popAllItems()
    selectedItemSlot = itemslot;
}