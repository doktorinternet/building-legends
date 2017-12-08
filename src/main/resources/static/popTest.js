//popAllItems()
//popAllChampions();
var selectedItemSlotID;
var selectedChampion;
var selectedItemsArr = [];
var allItems = {};
var stats = {
    "FlatHPPoolMod": 0,
    // "PercentHPRegen": 0,
    "FlatMPPoolMod": 0,
    // "PercentMPRegen": 0,
    "rFlatArmorPenetrationMod": 0,
    // "PercentArmorPenetrationMod": 0,
    "rFlatMagicPenetrationMod": 0,
    // "PercentMagicPenetrationMod": 0,
    "PercentLifeStealMod": 0,
    "PercentSpellVampMod": 0,
    "FlatCritChanceMod": 0,
    "PercentMovementImpedementResistance": 0,
    "FlatPhysicalDamageMod": 0,
    "FlatMagicDamageMod": 0,
    "FlatArmorMod": 0,
    "FlatSpellBlockMod": 0,
    "PercentAttackSpeedMod": 0,
    "rPercentCooldownMod": 0,
    "attack-range": 0,
    "PercentMovementSpeedMod": 0,
};
// var stats = {};

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

function selectChampion(champID) {
    selectedChampion = champID;
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/champion.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var json = request.response;
        // let coefficient = Math.random();
        // let skin;
        // if (coefficient < 0.34) {
        //     skin = 0;
        // } else if (coefficient > 0.34 && coefficient < 0.67) {
        //     skin = 1;
        // } else if (coefficient > 0.67 && coefficient < 1) {
        //     skin = 2;
        // }
        var backgroundImgSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + champID + "_0.jpg\")";
        var thumbSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + json["data"][champID]["image"]["full"] + "\")";
        var passivename = json["data"][champID]
        var passiveSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/7.24.1/img/passive/" + champID + "_P.png\")";
        document.getElementById("selected-champion").style.backgroundImage = thumbSrc;
        document.getElementById("body").style.backgroundImage = backgroundImgSrc;
        setAbilityImage(champID);
    }
}

function setAbilityImage(champID) {
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

function popAllItems() {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/item.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        document.getElementById("list-container").innerHTML = "";
        var json = request.response;
        // stats = json["basic"]["stats"];
        allItems = json["data"]; // FIXME: kanske ta bort
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


function selectItemSlot(slot, slotID) {
    popAllItems()
    slot.style.backgroundImage = "url(\"./images/SelectItem" + slotID + ".png\")";
    selectedItemSlotID = slotID;
    selectedItemsArr[selectedItemSlotID - 1] = undefined;
    setupItemStats();
    $(".item-slot").each(function () {
        this.style.boxShadow = "";
    })
    slot.style.boxShadow = "inset 0px 0px 100px cyan";
}

function selectItem(itemID) {
    selectedItemsArr[selectedItemSlotID - 1] = itemID;
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/item.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var json = request.response;
        var thumbSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/7.24.1/img/item/" + json["data"][itemID]["image"]["full"] + "\")";
        var selectedSlotString = "item-slot-" + selectedItemSlotID;
        document.getElementById(selectedSlotString).style.backgroundImage = thumbSrc;
        setupItemStats();
    }
}

function setupItemStats() {
    resetStats();
    selectedItemsArr.forEach(item => {
        if (item != undefined || item != null) {
            extractItemStats(item);
        }
    })
    updateStatsUI();

}

function extractItemStats(itemID) {
    var item = {};
    if (allItems.hasOwnProperty(itemID)) {
        item = allItems[itemID];
    }

    if (item["description"].indexOf("Regen") > -1 ||
        item["description"].indexOf("Cooldown Reduction") > -1) {
        let description = parseDescription(item);
        for (let key in description) {

            stats[key] += description[key];
            console.log("Extract " + stats[key] + " as " + key);

            if (stats["rPercentCooldownMod"] > 0.4) {
                stats["rPercentCooldownMod"] = 0.4;
            }
        }
    }

    for (let key in item["stats"]) {

        // for (let i = 0; i < item["tags"].length(); i+=1)

        if (stats.hasOwnProperty(key)) {
            stats[key] += item["stats"][key];
            console.log("Extract " + stats[key] + " as " + key);
        }
    }

}

function parseDescription(item) {

    // let start = description.indexOf("<stats>");
    // let end = description.indexOf("</stats>");
    // let regens = description.substring(start, end);
    // let stats = regens.match(/\d+/g);
    // let tags = item["tags"];
    // let hpregen = 0;
    // let mpregen = 0;

    // for (let i = 0; i < tags.length(); i++) {
    //     if (tags[i].equals("HealthRegen")) {
    //         hpregen = stats[i];
    //     } else if (tags[i].equals("ManaRegen")) {
    //         mpregen = stats[i];
    //     }
    // }

    let description = item["description"];
    let cdr;
    let cdrString = "% Cooldown Reduction";
    let endIndex = description.indexOf(cdrString);
    let startIndex = endIndex - 2;
    if (endIndex > -1) {

        let value = "";
        value = description.substring(startIndex, endIndex);

        if (value.indexOf("+") > -1) {
            value = value.charAt(1);
        }
        cdr = (parseInt(value)) / 100;
    }

    return {
        // "PercentHPRegenMod": hpregen,
        // "PercentMPRegenMod": mpregen,
        "rPercentCooldownMod": cdr
    };
}

function updateStatsUI() {

    for (let stat in stats) {
        console.log(stats[stat]);
        console.log(stat);
        if (document.getElementById(stat) != null) {
            document.getElementById(stat).innerText = stats[stat];
        }
    }
}

function resetStats() {
    for (let stat in stats) {
        stats[stat] = 0;
    }
}