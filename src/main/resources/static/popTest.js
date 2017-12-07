//popAllItems()
//popAllChampions();
var selectedItemSlotID;
var selectedChampion;
var selectedItemsArr = []

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
            myImg.setAttribute("onclick", "selectItem(this.id)");
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
        var thumbSrc= "url(\"http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + json["data"][champID]["image"]["full"] + "\")";
        var passivename = json["data"][champID]
        var passiveSrc= "url(\"http://ddragon.leagueoflegends.com/cdn/7.24.1/img/passive/" + champID + "_P.png\")";
        document.getElementById("selected-champion").style.backgroundImage = thumbSrc;
        document.getElementById("body").style.backgroundImage = backgroundImgSrc;
        setAbilityImage(champID);
    }
}
function selectItemSlot(slot, slotID){
    popAllItems()
    slot.style.backgroundImage = "url(\"./images/SelectItem" + slotID + ".png\")";
    selectedItemSlotID = slotID;
    selectedItemsArr[selectedItemSlotID-1] = undefined;
    $(".item-slot").each(function(){
        this.style.boxShadow = "";
    })
    slot.style.boxShadow = "inset 0px 0px 100px cyan";
}
function selectItem(itemID){
    selectedItemsArr[selectedItemSlotID-1] = itemID;
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/item.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var json = request.response;
        var thumbSrc= "url(\"http://ddragon.leagueoflegends.com/cdn/7.24.1/img/item/" + json["data"][itemID]["image"]["full"] + "\")";
        var selectedSlotString = "item-slot-" + selectedItemSlotID;
        document.getElementById(selectedSlotString).style.backgroundImage = thumbSrc;
    }
}
function setAbilityImage(champID){
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/champion/" + champID + ".json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var json = request.response;
        var passiveName = json["data"][champID]["passive"]["image"]["full"];
        var passiveSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/7.24.1/img/passive/" + passiveName + "\")";
        var qName = json["data"][champID]["spells"][0]["image"]["full"];
        var qSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/7.24.1/img/spell/" + qName + "\")";
        var wName = json["data"][champID]["spells"][1]["image"]["full"];
        var wSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/7.24.1/img/spell/" + wName + "\")";
        var eName = json["data"][champID]["spells"][2]["image"]["full"];
        var eSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/7.24.1/img/spell/" + eName + "\")";
        var rName = json["data"][champID]["spells"][3]["image"]["full"];
        var rSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/7.24.1/img/spell/" + rName + "\")";
        document.getElementById("ability-passive").style.backgroundImage = passiveSrc;
        document.getElementById("ability-q").style.backgroundImage = qSrc;
        document.getElementById("ability-w").style.backgroundImage = wSrc;
        document.getElementById("ability-e").style.backgroundImage = eSrc;
        document.getElementById("ability-r").style.backgroundImage = rSrc;
        
    }
}