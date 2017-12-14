
var version = "7.24.1";

var curLevel = 18;
var selectedItemSlotID;
var selectedChampion;
var selectedChampionKey;
var selectedItemsArr = [];
var allItems = {};
var buildsArray = [];

var partypeColors = {
    "Blood Well": "grey",
    "Mana": "blue",
    "Flow": "white",
    "Energy": "rgba(255, 200, 0, 1)",
    "Crimson Rush": "grey",
    "Fury": "red",
    "Heat": "white",
    "None": "transparent",
    "Ferocity": "orange",
    "Shield": "grey",
    "Courage": "white",
    "Rage": "Red",
};
var championStats = {
    "FlatHPPoolMod": 0,
    "PercentHPRegen": 0,
    "FlatMPPoolMod": 0,
    "PercentMPRegen": 0,
    "rFlatArmorPenetrationMod": 0,
    "PercentArmorPenetrationMod": 0,
    "rFlatMagicPenetrationMod": 0,
    "PercentMagicPenetrationMod": 0,
    "PercentLifeStealMod": 0,
    "PercentSpellVampMod": 0,
    "FlatCritChanceMod": 0,
    "PercentMovementImpedementResistance": 0,
    "FlatPhysicalDamageMod": 0,
    "FlatMagicDamageMod": 0,
    "FlatArmorMod": 0,
    "FlatSpellBlockMod": 0,
    "PercentAttackSpeedMod": 0,
    "BaseAttackSpeed": 0,
    "rPercentCooldownMod": 0,
    "attack-range": 0,
    "PercentMovementSpeedMod": 0,
    "FlatMovementSpeedMod": 0,
    "partype": "",
};
var itemStats = {
    "FlatHPPoolMod": 0,
    "PercentHPRegen": 0,
    "FlatMPPoolMod": 0,
    "PercentMPRegen": 0,
    "rFlatArmorPenetrationMod": 0,
    "PercentArmorPenetrationMod": 0,
    "rFlatMagicPenetrationMod": 0,
    "PercentMagicPenetrationMod": 0,
    "PercentLifeStealMod": 0,
    "PercentSpellVampMod": 0,
    "FlatCritChanceMod": 0,
    "PercentMovementImpedementResistance": 0,
    "FlatPhysicalDamageMod": 0,
    "FlatMagicDamageMod": 0,
    "FlatArmorMod": 0,
    "FlatSpellBlockMod": 0,
    "PercentAttackSpeedMod": 0,
    "BaseAttackSpeed": 0,
    "rPercentCooldownMod": 0,
    "attack-range": 0,
    "PercentMovementSpeedMod": 0,
    "FlatMovementSpeedMod": 0,
    "item-info": "",
};
var presentableStats = {
    "health-regen": 0,
    "mana-regen": 0,
    "health-pool": 0,
    "mana-pool": 0,
    "armor-penetration": 0,
    "magic-penetration": 0,
    "life-steal": 0,
    "spell-vamp": 0,
    "crit-chance": 0,
    "tenacity": 0,
    "attack-damage": 0,
    "ability-power": 0,
    "armor": 0,
    "magic-resist": 0,
    "attack-speed": 0,
    "cooldown-reduction": 0,
    "attack-range": 0,
    "movement-speed": 0,
    "item-info": "",
    "partype": "",
};

function popAllChampions() {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/champion.json";
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
            myImg.src = "http://ddragon.leagueoflegends.com/cdn/" + version + "/img/champion/" + json["data"][champion]["image"]["full"];
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
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/champion.json";
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
        var thumbSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/" + version + "/img/champion/" + json["data"][champID]["image"]["full"] + "\")";
        var passivename = json["data"][champID];
        var passiveSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/" + version + "/img/passive/" + champID + "_P.png\")";
        document.getElementById("selected-champion").style.backgroundImage = thumbSrc;
        document.getElementById("main-container").style.backgroundImage = backgroundImgSrc;
        setImage(champID);
        displayAbilityTooltips(champID);
        setupStats();
    }
}

function extractChampionStats(champID, callback) {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/champion/" + champID + ".json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var json = request.response;
        selectedChampionKey = json["data"][champID]["key"];
        let champStats = json["data"][champID]["stats"];
        championStats["FlatHPPoolMod"] = champStats["hp"] + (champStats["hpperlevel"] * curLevel);
        championStats["FlatMPPoolMod"] = champStats["mp"] + (champStats["mpperlevel"] * curLevel);
        championStats["FlatMovementSpeedMod"] = champStats["movespeed"];
        championStats["FlatArmorMod"] = champStats["armor"] + (champStats["armorperlevel"] * curLevel);
        championStats["FlatSpellBlockMod"] = champStats["spellblock"] + (champStats["spellblockperlevel"] * curLevel);
        championStats["attack-range"] = champStats["attackrange"];
        championStats["PercentHPRegen"] = champStats["hpregen"] + (champStats["hpregenperlevel"] * curLevel);
        championStats["PercentMPRegen"] = champStats["mpregen"] + (champStats["mpregenperlevel"] * curLevel);
        championStats["FlatCritChanceMod"] = champStats["crit"] + (champStats["critperlevel"] * curLevel);
        championStats["FlatPhysicalDamageMod"] = champStats["attackdamage"] + (champStats["attackdamageperlevel"] * curLevel);
        championStats["BaseAttackSpeed"] = calculateAttackSpeed(champStats);
        championStats["partype"] = json["data"][champID]["partype"];
        callback();
    }
}

function calculateAttackSpeed(champion) {
    let offset = champion["attackspeedoffset"];
    let asPerLevel = champion["attackspeedperlevel"];
    let itemsMod = itemStats["PercentAttackSpeedMod"];
    let base = 0.625 / (1 + offset);
    let result = 0;

    let bonusAS = (asPerLevel * (7 / 400 * (curLevel * curLevel - 1) + 267 / 400 * (curLevel - 1))) / 100;
    if (itemsMod > 0) {
        let items = itemsMod;
        result = base + (base * items + bonusAS);
    } else {
        result = base + (base * bonusAS);
    }

    return result;
}

function setImage(champID) {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/champion/" + champID + ".json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var json = request.response;
        var passiveName = json["data"][champID]["passive"]["image"]["full"];
        var passiveSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/" + version + "/img/passive/" + passiveName + "\")";
        var qName = json["data"][champID]["spells"][0]["image"]["full"];
        var qSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/" + version + "/img/spell/" + qName + "\")";
        var wName = json["data"][champID]["spells"][1]["image"]["full"];
        var wSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/" + version + "/img/spell/" + wName + "\")";
        var eName = json["data"][champID]["spells"][2]["image"]["full"];
        var eSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/" + version + "/img/spell/" + eName + "\")";
        var rName = json["data"][champID]["spells"][3]["image"]["full"];
        var rSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/" + version + "/img/spell/" + rName + "\")";
        document.getElementById("ability-passive").style.backgroundImage = passiveSrc;
        document.getElementById("ability-q").style.backgroundImage = qSrc;
        document.getElementById("ability-w").style.backgroundImage = wSrc;
        document.getElementById("ability-e").style.backgroundImage = eSrc;
        document.getElementById("ability-r").style.backgroundImage = rSrc;

    }
}

function popAllItems() {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/item.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        document.getElementById("list-container").innerHTML = "";
        var json = request.response;
        allItems = json["data"];
        for (items in json["data"]) {
            let myDiv = document.createElement("div");
            myDiv.setAttribute("class", "item-container");
            let myImg = document.createElement("img");
            myImg.setAttribute("class", "item-thumb");
            myImg.setAttribute("id", items);
            myImg.setAttribute("onclick", "selectItem(this.id)");
            myImg.src = "http://ddragon.leagueoflegends.com/cdn/" + version + "/img/item/" + json["data"][items]["image"]["full"];
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
    setupStats();
    $(".item-slot").each(function () {
        this.style.boxShadow = "";
    })
    slot.style.boxShadow = "inset 0px 0px 100px cyan";
}

function selectItem(itemID) {
    selectedItemsArr[selectedItemSlotID - 1] = itemID;
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/item.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        var json = request.response;
        var thumbSrc = "url(\"http://ddragon.leagueoflegends.com/cdn/" + version + "/img/item/" + json["data"][itemID]["image"]["full"] + "\")";
        var selectedSlotString = "item-slot-" + selectedItemSlotID;
        document.getElementById(selectedSlotString).style.backgroundImage = thumbSrc;
        setupStats();
    }
}

function extractItemStats(itemID) {
    var item = {};
    if (allItems.hasOwnProperty(itemID)) {
        item = allItems[itemID];
    }

    if (descriptionHasData(item)) {
        let description = parseDescription(item);
        for (let key in description) {

            itemStats[key] += description[key];
            validateStats();
        }
    }

    for (let key in item["stats"]) {
        if (itemStats.hasOwnProperty(key)) {
            itemStats[key] += item["stats"][key];
        }
    }

    if (itemStats["item-info"] === "") {
        itemStats["item-info"] = clearTags(item["description"]).concat("///");
    } else {
        itemStats["item-info"] += clearTags(item["description"]).concat("///");
    }
}

function displayAbilityTooltips(champID) {
    let request = new XMLHttpRequest();
    let url = "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/champion/" + champID + ".json";
    request.responseType = "json";
    request.open("GET", url, true);
    request.send();
    request.onload = () => {
        let championData = request.response["data"][champID];
        let abilityTextArray = [];

        abilityTextArray.push(championData["passive"]["description"]);

        for (let i = 0; i < championData["spells"].length; i++) {
            // abilityTextArray.push(championData["spells"][i]["tooltip"]); Ifall vi löser variabelproblemet
            abilityTextArray.push(championData["spells"][i]["description"]);
        }


        let abilityView = document.querySelector("#ability-info");
        abilityView.innerHTML = "";
        let abilityList = document.createElement("ul");
        abilityList.id = "ability-effects";


        for (let i = 0; i < abilityTextArray.length; i++) {
            let ability = document.createElement("li");
            ability.innerHTML = abilityTextArray[i];
            abilityList.appendChild(ability);
            abilityList.appendChild(document.createElement("hr"));
        }

        abilityView.appendChild(abilityList);
    }
}

function parseDescription(item) {
    let description = item["description"];
    let cdr = extractCDR(description);
    let regen = extractRegen(description);
    let penetration = extractDefensePenetration(description);
    let tenacity = extractTenacity(item);

    return {
        "rFlatArmorPenetrationMod": penetration["lethality"],
        "PercentArmorPenetrationMod": penetration["armorPen"],
        "rFlatMagicPenetrationMod": penetration["flatMagic"],
        "PercentMagicPenetrationMod": penetration["magicPen"],
        "PercentHPRegen": regen["Health"],
        "PercentMPRegen": regen["Mana"],
        "rPercentCooldownMod": cdr,
        "PercentMovementImpedementResistance": tenacity,
    };
}

function validateStats() {
    if (itemStats["rPercentCooldownMod"] > 0.4) {
        itemStats["rPercentCooldownMod"] = 0.4;
    } else if (itemStats["PercentMagicPenetrationMod"] > 40) {
        itemStats["PercentMagicPenetrationMod"] = 40;
    } else if (itemStats["PercentArmorPenetrationMod"] > 35) {
        itemStats["PercentArmorPenetrationMod"] = 35;
    }
}

function descriptionHasData(item) {
    if (item["description"].indexOf("Regen") > -1 ||
        item["description"].indexOf("Cooldown Reduction") > -1 ||
        item["description"].indexOf("Armor Penetration") > -1 ||
        item["description"].indexOf("Lethality") > -1 ||
        item["description"].indexOf("Magic Penetration") > -1 ||
        item["description"].indexOf("Tenacity") > -1) {
        return true;
    }
    return false;
}

function extractTenacity(item) {
    let tenacity = 0;
    if (item["name"].indexOf("Mercury") > -1) {
        tenacity = 30;
    }
    return tenacity;
}

function clearTags(description) {
    let badTags = [
        "<stats>",
        "</stats>",
        "<levelLimit>",
        "</levelLimit>",
        "<consumable>",
        "</consumable>",
        "<rules>",
        "</rules>",
        "<groupLimit>",
        "</groupLimit>",
        "<unique>",
        "</unique>",
        "<hr>",
        "<br><br>",
    ]

    if (description.indexOf("<stats>") > -1) {
        let removeThis = description.substring(
            description.indexOf(badTags[0]),
            description.indexOf(badTags[1]));
        description = description.replace(removeThis, "");
    }

    for (let i = 0; i < badTags.length; i += 1) {
        while (description.indexOf(badTags[i]) > -1) {
            description = description.replace(badTags[i], "");
        }
    }
    return description;
}

function extractDefensePenetration(description) {
    let searchKeys = {
        lethalityKey: " <a href='Lethality'",
        flatMagicKey: " <a href='FlatMagicPen'>",
        armorPenKey: "% <a href='BonusArmorPen",
        magicPenKey: "% <a href='TotalMagicPen"
    }
    let magicPen = 0;
    let armorPen = 0;
    let flatMagic = 0;
    let lethality = 0;


    for (let key in searchKeys) {
        let index = description.indexOf(searchKeys[key]);
        if (index > -1) {
            if (key.indexOf("magicPen") > -1) {
                magicPen = parseInt(description.substring(index - 2, index));
            } else if (key.indexOf("armorPen") > -1) {
                armorPen = parseInt(description.substring(index - 2, index));
            } else if (key.indexOf("flatMagic") > -1) {
                flatMagic = parseInt(description.substring(index - 2, index));
            } else if (key.indexOf("lethality") > -1) {
                lethality = parseInt(description.substring(index - 2, index));
            }
        }
    }

    return {
        "magicPen": magicPen,
        "armorPen": armorPen,
        "flatMagic": flatMagic,
        "lethality": lethality,
    }
}

function extractRegen(description) {
    let start = description.indexOf("<stats>");
    let end = description.indexOf("</stats>");
    let baseStats = description.substring(start, end);

    let result = {
        "Health": 0,
        "Mana": 0,
    }
    let regens = ["Health", "Mana"];

    // let mana = "Mana";
    for (let i = 0; i < regens.length; i += 1) {
        let endIndex = baseStats.indexOf("% Base " + regens[i] + " Regen");
        let startIndex = endIndex - 3;
        if (endIndex > (-1)) {

            let value = "";
            value = baseStats.substring(startIndex, endIndex);
            let res = "";
            if (value.indexOf("+") > -1) {
                value = value.charAt(1).concat(value.charAt(2));
            }

            result[regens[i]] = (parseInt(value)) / 100;
        }
    }

    return result;
}

function extractCDR(description) {
    let cdr = 0;
    let cdrString = "% Cooldown Reduction";
    let endIndex = description.indexOf(cdrString);
    let startIndex = endIndex - 2;
    if (endIndex > (-1)) {

        let value = "";
        value = description.substring(startIndex, endIndex);

        if (value.indexOf("+") > -1) {
            value = value.charAt(1);
        }
        cdr = parseInt(value) / 100;
    }
    return cdr;
}

function updateStatsUI() {
    for (let stat in presentableStats) {
        if (stat != "partype") {
            if (stat == "item-info" && "number" != typeof presentableStats[stat]) {

                let uniqueView = document.querySelector("#item-info");
                uniqueView.innerHTML = "";
                let itemList = document.createElement("ul");
                itemList.id = "unique-effects";

                let uniqueEffects = presentableStats[stat];
                let uniqueStrings = uniqueEffects.split("///");
                for (let i = 0; i < uniqueStrings.length; i++) {
                    if (uniqueStrings[i] != "") {
                        let item = document.createElement("li");
                        item.innerHTML = uniqueStrings[i];
                        itemList.appendChild(item);
                        itemList.appendChild(document.createElement("hr"));
                    }
                }

                uniqueView.appendChild(itemList);

            } else if (document.getElementById(stat) != null && presentableStats[stat] != 0) {
                if (stat === "mana-pool") {
                    let node = document.querySelector("#mana-bar :first-child");
                    node.innerText = presentableStats["partype"] + ":";
                    document.getElementById("mana-bar").style.backgroundColor = partypeColors[presentableStats["partype"]];
                    document.getElementById(stat).innerText = presentableStats[stat];
                } else {
                    document.getElementById(stat).innerText = presentableStats[stat];
                }
            }
        }
    }
}

function saveBuild() {
    let xmlHttp = new XMLHttpRequest();
    let title = selectedChampion; // document.getElementById("build-title").value;
    let items = "";
    selectedItemsArr.forEach(item => {
        if (item != undefined) {
            items += item + ",";
        }
    });
    var buildURL = "/savebuild?buildString=" + title + "," + selectedChampion + "," + selectedChampionKey + "," + items;
    xmlHttp.open("POST", buildURL, true)
    xmlHttp.send(null);
    xmlHttp.onreadystatechange = function () {
        let feedback = xmlHttp.response;
        let feedbackElement = document.getElementById("feedback-text");
        feedbackElement.innerText = feedback;
    };
}

function loadBuilds() {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "/loadBuilds", true)
    xmlHttp.send(null);
    xmlHttp.onload = function () {
        let userBuilds = xmlHttp.response;
        let rawArray = userBuilds.split(",");
        for (let i = 0; i < rawArray.length; i += 11) {
            if (!rawArray[i]) {
                break;
            }
            buildsArray.push({
                "ID": rawArray[i],
                "username": rawArray[i + 1],
                "championName": rawArray[i + 2],
                "championkey": rawArray[i + 3],
                "buildtitle": rawArray[i + 4],
                "item1": rawArray[i + 5],
                "item2": rawArray[i + 6],
                "item3": rawArray[i + 7],
                "item4": rawArray[i + 8],
                "item5": rawArray[i + 9],
                "item6": rawArray[i + 10],
            });
        }
    }
}

function makeJSON() {
    let title = selectedChampion;//document.getElementById("build-title").value;
    let items = "\"items\": [";
    for (let i = 0; i < selectedItemsArr.length; i++) {
        if ("number" == typeof selectedItemsArr[i]) {
            items = items.concat("{");
            items = items.concat("\"id\": \"" + selectedItemsArr[i] + "\"");
            items = items.concat("\"count\": \"1\"");
            items = items.concat("},");
        }
    }
    items = items.concat("],");
    let JSON = "{\"title\": "
        .concat(title)
        .concat("\"associatedMaps\": [],")
        .concat("\"associatedChampions\": [")
        .concat(selectedChampionKey)
        .concat("],")
        .concat("\"blocks\": [")
        .concat("{")
        .concat(items)
        .concat("\"type\": \"New Block\"")
        .concat("}]}");
    return JSON;
}

function setupStats() {
    resetStats();
    if (selectedChampion != null && selectedChampion != undefined) {
        extractChampionStats(selectedChampion, function () {

            if (selectedItemsArr.length > 0) {
                selectedItemsArr.forEach(item => {
                    if (item != undefined || item != null) {
                        extractItemStats(item);
                    }
                });
            }
            prepareStats();
            updateStatsUI();
        });
    }
}

function prepareStats() {

    presentableStats["health-regen"] = Math.round((championStats["PercentHPRegen"] *
        (1 + itemStats["PercentHPRegen"])) / 5) + "/s";
    presentableStats["mana-regen"] = Math.round((championStats["PercentMPRegen"] *
        (1 + itemStats["PercentMPRegen"])) / 5) + "/s";
    presentableStats["health-pool"] = Math.round(championStats["FlatHPPoolMod"] + itemStats["FlatHPPoolMod"]);

    presentableStats["partype"] = championStats["partype"];

    if (presentableStats["partype"] != "Mana") {
        presentableStats["mana-pool"] = Math.round(championStats["FlatMPPoolMod"]);
    } else {
        presentableStats["mana-pool"] = Math.round(championStats["FlatMPPoolMod"] + itemStats["FlatMPPoolMod"]);
    }

    presentableStats["armor-penetration"] = itemStats["rFlatArmorPenetrationMod"] + " | " +
        itemStats["PercentArmorPenetrationMod"] + "%";
    presentableStats["magic-penetration"] = itemStats["rFlatMagicPenetrationMod"] + " | " +
        itemStats["PercentMagicPenetrationMod"] + "%";
    presentableStats["life-steal"] = (itemStats["PercentLifeStealMod"] * 100) + "%";
    presentableStats["spell-vamp"] = (itemStats["PercentSpellVampMod"] * 100) + "%";
    presentableStats["crit-chance"] = (itemStats["FlatCritChanceMod"] * 100) + "%";
    presentableStats["tenacity"] = itemStats["PercentMovementImpedementResistance"] + "%";
    presentableStats["attack-damage"] = Math.round(itemStats["FlatPhysicalDamageMod"] +
        championStats["FlatPhysicalDamageMod"]);
    presentableStats["ability-power"] = Math.round(itemStats["FlatMagicDamageMod"] +
        championStats["FlatMagicDamageMod"]);
    presentableStats["armor"] = Math.round(itemStats["FlatArmorMod"] + championStats["FlatArmorMod"]);
    presentableStats["magic-resist"] = Math.round(itemStats["FlatSpellBlockMod"] +
        championStats["FlatSpellBlockMod"]);
    presentableStats["attack-speed"] = ((1 + itemStats["PercentAttackSpeedMod"]) *
        championStats["BaseAttackSpeed"]).toFixed(3);

    presentableStats["cooldown-reduction"] = Math.round((100 * itemStats["rPercentCooldownMod"])) + "%";
    presentableStats["attack-range"] = itemStats["attack-range"] + championStats["attack-range"];
    presentableStats["movement-speed"] = Math.round((itemStats["FlatMovementSpeedMod"] +
        championStats["FlatMovementSpeedMod"]) * (1 + itemStats["PercentMovementSpeedMod"]));
    presentableStats["item-info"] = itemStats["item-info"];
}

function isMultiplier(stat) {
    let multiplierStats = [
        "PercentHPRegen",
        "PercentMPRegen",
        "PercentAttackSpeedMod",
        "PercentMovementSpeedMod"
    ]
    for (let i = 0; i < multiplierStats.length; i += 1) {
        if (multiplierStats[i] === stat) {
            return true;
        }
    }
    return false;
}

function resetStats() {
    for (let stat in championStats) {
        championStats[stat] = 0;
    }
    for (let stat in itemStats) {
        itemStats[stat] = 0;
    }
    for (let stat in presentableStats) {
        presentableStats[stat] = 0;
    }

    presentableStats["item-info"] = "";
    itemStats["item-info"] = "";

}

// function loadJSON(callback) {
//     let runeData = "./json/perks.json"

//     var xobj = new XMLHttpRequest();
//     xobj.overrideMimeType("application/json");
//     xobj.open('GET', runeData, true);
//     xobj.onreadystatechange = function () {
//         if (xobj.readyState == 4 && xobj.status == "200") {
//             // .open will NOT return a value but simply returns undefined in async mode so use a callback
//             callback(xobj.responseText);
//         }
//     }
//     xobj.send(null);

// }

// function handleRunes(response) {
//     // Do Something with the response e.g.
//     jsonresponse = JSON.parse(response);
//     for (let perk in jsonresponse) {

//         let mySpan = document.createElement("span");
//         let myImg = document.createElement("img");
//         let myTitle = document.createElement("span");
//         myImg.src = jsonresponse.
//             myTitle.innerText = champions["data"][champion]["name"];
//         mySpan.appendChild(myImg);
//         mySpan.appendChild(myTitle);
//     }
//     document.getElementById("searchRow").appendChild(mySpan);
// }

// function showtyInfoListener(e) {


//     e.id
// }
