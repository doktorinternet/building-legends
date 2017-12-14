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
  Mana: "blue",
  Flow: "white",
  Energy: "rgba(255, 200, 0, 1)",
  "Crimson Rush": "grey",
  Fury: "red",
  Heat: "white",
  None: "transparent",
  Ferocity: "orange",
  Shield: "grey",
  Courage: "white",
  Rage: "Red"
};
var championStats = {
  FlatHPPoolMod: 0,
  PercentHPRegen: 0,
  FlatMPPoolMod: 0,
  PercentMPRegen: 0,
  rFlatArmorPenetrationMod: 0,
  PercentArmorPenetrationMod: 0,
  rFlatMagicPenetrationMod: 0,
  PercentMagicPenetrationMod: 0,
  PercentLifeStealMod: 0,
  PercentSpellVampMod: 0,
  FlatCritChanceMod: 0,
  PercentMovementImpedementResistance: 0,
  FlatPhysicalDamageMod: 0,
  FlatMagicDamageMod: 0,
  FlatArmorMod: 0,
  FlatSpellBlockMod: 0,
  PercentAttackSpeedMod: 0,
  BaseAttackSpeed: 0,
  rPercentCooldownMod: 0,
  "attack-range": 0,
  PercentMovementSpeedMod: 0,
  FlatMovementSpeedMod: 0,
  partype: ""
};
var itemStats = {
  FlatHPPoolMod: 0,
  PercentHPRegen: 0,
  FlatMPPoolMod: 0,
  PercentMPRegen: 0,
  rFlatArmorPenetrationMod: 0,
  PercentArmorPenetrationMod: 0,
  rFlatMagicPenetrationMod: 0,
  PercentMagicPenetrationMod: 0,
  PercentLifeStealMod: 0,
  PercentSpellVampMod: 0,
  FlatCritChanceMod: 0,
  PercentMovementImpedementResistance: 0,
  FlatPhysicalDamageMod: 0,
  FlatMagicDamageMod: 0,
  FlatArmorMod: 0,
  FlatSpellBlockMod: 0,
  PercentAttackSpeedMod: 0,
  BaseAttackSpeed: 0,
  rPercentCooldownMod: 0,
  "attack-range": 0,
  PercentMovementSpeedMod: 0,
  FlatMovementSpeedMod: 0,
  "item-info": ""
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
  tenacity: 0,
  "attack-damage": 0,
  "ability-power": 0,
  armor: 0,
  "magic-resist": 0,
  "attack-speed": 0,
  "cooldown-reduction": 0,
  "attack-range": 0,
  "movement-speed": 0,
  "item-info": "",
  partype: ""
};

function popAllChampions() {
  var request = new XMLHttpRequest();
  var requestURL =
    "http://ddragon.leagueoflegends.com/cdn/" +
    version +
    "/data/en_US/champion.json";
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
      myImg.src =
        "http://ddragon.leagueoflegends.com/cdn/" +
        version +
        "/img/champion/" +
        json["data"][champion]["image"]["full"];
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
  document.getElementById("champion-name").innerText = setChampName(champID);
  var request = new XMLHttpRequest();
  var requestURL =
    "http://ddragon.leagueoflegends.com/cdn/" +
    version +
    "/data/en_US/champion.json";
  request.open("GET", requestURL, true);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    var json = request.response;
    var backgroundImgSrc =
      'url("http://ddragon.leagueoflegends.com/cdn/img/champion/splash/' +
      champID +
      '_0.jpg")';
    var thumbSrc =
      'url("http://ddragon.leagueoflegends.com/cdn/' +
      version +
      "/img/champion/" +
      json["data"][champID]["image"]["full"] +
      '")';
    var passivename = json["data"][champID];
    var passiveSrc =
      'url("http://ddragon.leagueoflegends.com/cdn/' +
      version +
      "/img/passive/" +
      champID +
      '_P.png")';
    document.getElementById(
      "selected-champion"
    ).style.backgroundImage = thumbSrc;
    document.getElementById(
      "main-container"
    ).style.backgroundImage = backgroundImgSrc;
    setImage(champID);
    displayAbilityTooltips(champID);
    setupStats();
  };
}
function setChampName(champID) {
  let champName = champID.charAt(0);
  for (let i = 1; i < champID.length; i++) {
    if (isUpperCase(champID.charAt(i))) {
      champName = champName.concat(" ");
    }
    champName = champName.concat(champID.charAt(i));
  }
  return champName;
}

function isUpperCase(letter) {
  return letter.toUpperCase() == letter;
}

function extractChampionStats(champID, callback) {
  var request = new XMLHttpRequest();
  var requestURL =
    "http://ddragon.leagueoflegends.com/cdn/" +
    version +
    "/data/en_US/champion/" +
    champID +
    ".json";
  request.open("GET", requestURL, true);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    var json = request.response;
    selectedChampionKey = json["data"][champID]["key"];
    let champStats = json["data"][champID]["stats"];
    championStats["FlatHPPoolMod"] =
      champStats["hp"] + champStats["hpperlevel"] * curLevel;
    championStats["FlatMPPoolMod"] =
      champStats["mp"] + champStats["mpperlevel"] * curLevel;
    championStats["FlatMovementSpeedMod"] = champStats["movespeed"];
    championStats["FlatArmorMod"] =
      champStats["armor"] + champStats["armorperlevel"] * curLevel;
    championStats["FlatSpellBlockMod"] =
      champStats["spellblock"] + champStats["spellblockperlevel"] * curLevel;
    championStats["attack-range"] = champStats["attackrange"];
    championStats["PercentHPRegen"] =
      champStats["hpregen"] + champStats["hpregenperlevel"] * curLevel;
    championStats["PercentMPRegen"] =
      champStats["mpregen"] + champStats["mpregenperlevel"] * curLevel;
    championStats["FlatCritChanceMod"] =
      champStats["crit"] + champStats["critperlevel"] * curLevel;
    championStats["FlatPhysicalDamageMod"] =
      champStats["attackdamage"] +
      champStats["attackdamageperlevel"] * curLevel;
    championStats["BaseAttackSpeed"] = calculateAttackSpeed(champStats);
    championStats["partype"] = json["data"][champID]["partype"];
    callback();
  };
}

function calculateAttackSpeed(champion) {
  let offset = champion["attackspeedoffset"];
  let asPerLevel = champion["attackspeedperlevel"];
  let itemsMod = itemStats["PercentAttackSpeedMod"];
  let base = 0.625 / (1 + offset);
  let result = 0;

  let bonusAS =
    asPerLevel *
    (7 / 400 * (curLevel * curLevel - 1) + 267 / 400 * (curLevel - 1)) /
    100;
  if (itemsMod > 0) {
    let items = itemsMod;
    result = base + (base * items + bonusAS);
  } else {
    result = base + base * bonusAS;
  }

  return result;
}

function setImage(champID) {
  var request = new XMLHttpRequest();
  var requestURL =
    "http://ddragon.leagueoflegends.com/cdn/" +
    version +
    "/data/en_US/champion/" +
    champID +
    ".json";
  request.open("GET", requestURL, true);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    var json = request.response;
    var passiveName = json["data"][champID]["passive"]["image"]["full"];
    var passiveSrc =
      'url("http://ddragon.leagueoflegends.com/cdn/' +
      version +
      "/img/passive/" +
      passiveName +
      '")';
    var qName = json["data"][champID]["spells"][0]["image"]["full"];
    var qSrc =
      'url("http://ddragon.leagueoflegends.com/cdn/' +
      version +
      "/img/spell/" +
      qName +
      '")';
    var wName = json["data"][champID]["spells"][1]["image"]["full"];
    var wSrc =
      'url("http://ddragon.leagueoflegends.com/cdn/' +
      version +
      "/img/spell/" +
      wName +
      '")';
    var eName = json["data"][champID]["spells"][2]["image"]["full"];
    var eSrc =
      'url("http://ddragon.leagueoflegends.com/cdn/' +
      version +
      "/img/spell/" +
      eName +
      '")';
    var rName = json["data"][champID]["spells"][3]["image"]["full"];
    var rSrc =
      'url("http://ddragon.leagueoflegends.com/cdn/' +
      version +
      "/img/spell/" +
      rName +
      '")';
    document.getElementById(
      "ability-passive"
    ).style.backgroundImage = passiveSrc;
    document.getElementById("ability-q").style.backgroundImage = qSrc;
    document.getElementById("ability-w").style.backgroundImage = wSrc;
    document.getElementById("ability-e").style.backgroundImage = eSrc;
    document.getElementById("ability-r").style.backgroundImage = rSrc;
  };
}

function popAllItems() {
  var request = new XMLHttpRequest();
  var requestURL =
    "http://ddragon.leagueoflegends.com/cdn/" +
    version +
    "/data/en_US/item.json";
  request.open("GET", requestURL, true);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    document.getElementById("list-container").innerHTML = "";
    var json = request.response;
    allItems = json["data"];

    for (let items in json["data"]) {

      if (itemQualifies(json["data"][items])) {
        let myDiv = document.createElement("div");
        myDiv.setAttribute("class", "item-container");
        let myImg = document.createElement("img");
        myImg.setAttribute("class", "item-thumb");
        myImg.setAttribute("id", items);
        myImg.setAttribute("onclick", "selectItem(this.id)");
        myImg.src =
          "http://ddragon.leagueoflegends.com/cdn/" +
          version +
          "/img/item/" +
          json["data"][items]["image"]["full"];
        let myNameDiv = document.createElement("div");
        myNameDiv.setAttribute("class", "name-container");
        let myName = document.createElement("span");
        myName.innerText = json["data"][items]["name"];
        myDiv.appendChild(myImg);
        myNameDiv.appendChild(myName);
        myDiv.appendChild(myNameDiv);
        document.getElementById("list-container").appendChild(myDiv);
      }
    }
  };
}

function itemQualifies(item) {
  if (hasBadProperty(item)) {
    return false;
  }
  if (hasBadTags(item)) {
    return false;
  }
  if (hasBadDescription(item)) {
    return false;
  }
  if (hasBadName(item)) {
    return false;
  }
  return true;
}

function hasBadProperty(item) {
  if (item.hasOwnProperty("consumed")) {
    return true;
  }
  if (item.hasOwnProperty("inStore")) {
    return true;
  }
  if (item.hasOwnProperty("consumeOnFull")) {
    return true;
  }
  if (item.hasOwnProperty(item["requiredChampion"])) {
    if (item["requiredChampion"] !== "Viktor") {
      return true;
    }
  }
  return false;
}

function hasBadTags(item) {
  let tags = item["tags"];
  for (let i = 0; i < tags.length; i++) {

    if (tags[i] == "Trinket") {
      return true;
    }
    if (tags[i] == "Vision") {
      return true;
    }
    if (tags[i] == "Consumable") {
      return true;
    }
  }
  return false;
}

function hasBadDescription(item) {
  let description = item["description"];
  if (description.indexOf("Shackle") > -1) {
    return true;
  }
  if (description.indexOf("Singularity") > -1) {
    return true;
  }
  if (description.indexOf("Dark Star") > -1) {
    return true;
  }
  if (description.indexOf("Stars") > -1) {
    return true;
  }
  if (description.indexOf("consumable") > -1) {
    return true;
  }
  return false;
}

function hasBadName(item) {
  let name = item["name"];
  if (name.indexOf("Quick Charge") > -1) {
    return true;
  }
  if (item == "3042") {
    return true;
  }
  if (item["name"] == "Broken Stopwatch") {
    return true;
  }
  return false;
}
function selectItemSlot(slot, slotID) {
  popAllItems();
  slot.style.backgroundImage = 'url("./images/SelectItem' + slotID + '.png")';
  selectedItemSlotID = slotID;
  selectedItemsArr[selectedItemSlotID - 1] = undefined;
  setupStats();
  $(".item-slot").each(function () {
    this.style.boxShadow = "";
  });
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
    var thumbSrc = 'url("http://ddragon.leagueoflegends.com/cdn/' + version + "/img/item/" + json["data"][itemID]["image"]["full"] + '")';
    var selectedSlotString = "item-slot-" + selectedItemSlotID;
    document.getElementById(selectedSlotString).style.backgroundImage = thumbSrc;
    setupStats();
  };
}

function extractItemStats(itemID) {
  var item = {};
  if (allItems.hasOwnProperty(itemID)) {
    item = allItems[itemID];

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
  } else {
  }
}

function displayAbilityTooltips(champID) {
  let request = new XMLHttpRequest();
  let url =
    "http://ddragon.leagueoflegends.com/cdn/" +
    version +
    "/data/en_US/champion/" +
    champID +
    ".json";
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
  };
}

function parseDescription(item) {
  let description = item["description"];
  let cdr = extractCDR(description);
  let regen = extractRegen(description);
  let penetration = extractDefensePenetration(description);
  let tenacity = extractTenacity(item);

  return {
    rFlatArmorPenetrationMod: penetration["lethality"],
    PercentArmorPenetrationMod: penetration["armorPen"],
    rFlatMagicPenetrationMod: penetration["flatMagic"],
    PercentMagicPenetrationMod: penetration["magicPen"],
    PercentHPRegen: regen["Health"],
    PercentMPRegen: regen["Mana"],
    rPercentCooldownMod: cdr,
    PercentMovementImpedementResistance: tenacity
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
  if (
    item["description"].indexOf("Regen") > -1 ||
    item["description"].indexOf("Cooldown Reduction") > -1 ||
    item["description"].indexOf("Armor Penetration") > -1 ||
    item["description"].indexOf("Lethality") > -1 ||
    item["description"].indexOf("Magic Penetration") > -1 ||
    item["description"].indexOf("Tenacity") > -1
  ) {
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
    "<br><br>"
  ];

  if (description.indexOf("<stats>") > -1) {
    let removeThis = description.substring(
      description.indexOf(badTags[0]),
      description.indexOf(badTags[1])
    );
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
  };
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
    magicPen: magicPen,
    armorPen: armorPen,
    flatMagic: flatMagic,
    lethality: lethality
  };
}

function extractRegen(description) {
  let start = description.indexOf("<stats>");
  let end = description.indexOf("</stats>");
  let baseStats = description.substring(start, end);

  let result = {
    Health: 0,
    Mana: 0
  };
  let regens = ["Health", "Mana"];

  // let mana = "Mana";
  for (let i = 0; i < regens.length; i += 1) {
    let endIndex = baseStats.indexOf("% Base " + regens[i] + " Regen");
    let startIndex = endIndex - 3;
    if (endIndex > -1) {
      let value = "";
      value = baseStats.substring(startIndex, endIndex);
      let res = "";
      if (value.indexOf("+") > -1) {
        value = value.charAt(1).concat(value.charAt(2));
      }

      result[regens[i]] = parseInt(value) / 100;
    }
  }

  return result;
}

function extractCDR(description) {
  let cdr = 0;
  let cdrString = "% Cooldown Reduction";
  let endIndex = description.indexOf(cdrString);
  let startIndex = endIndex - 2;
  if (endIndex > -1) {
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
          document.getElementById("mana-bar").style.backgroundColor =
            partypeColors[presentableStats["partype"]];
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
  var buildURL =
    "/savebuild?buildString=" +
    title +
    "," +
    selectedChampion +
    "," +
    selectedChampionKey +
    "," +
    items;
  xmlHttp.open("POST", buildURL, true);
  xmlHttp.send(null);
  xmlHttp.onreadystatechange = function () {
    let feedback = xmlHttp.response;
    let feedbackElement = document.getElementById("feedback-text");
    if (feedback != success) {
      feedbackElement.innerText = "Could not save build! Make sure you put items in the slots, or refresh the page."
    } else {
      feedbackElement.innerText = "Build saved"; //TODO: 
    }
  }
}

function loadBuilds() {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "/loadBuilds", true);
  xmlHttp.send(null);

  // Reset the list from last press
  if (buildsArray.length) {
    buildsArray.length = 0;
  }

  buildsArray = [];
  xmlHttp.onload = function () {
    let userBuilds = xmlHttp.response;
    let rawArray = userBuilds.split(",");

    for (let i = 0; i < rawArray.length; i += 11) {
      if (!rawArray[i]) {
        break;
      }
      buildsArray.push({
        ID: rawArray[i],
        username: rawArray[i + 1],
        championName: rawArray[i + 2],
        championkey: rawArray[i + 3],
        buildtitle: rawArray[i + 4],
        item1: rawArray[i + 5],
        item2: rawArray[i + 6],
        item3: rawArray[i + 7],
        item4: rawArray[i + 8],
        item5: rawArray[i + 9],
        item6: rawArray[i + 10]
      });
    }
    popAllSaves(buildsArray);
  };
}

function makeJSON() {
  let title = selectedChampion; //document.getElementById("build-title").value;
  let items = '"items": [';
  for (let i = 0; i < selectedItemsArr.length; i++) {
    if ("number" == typeof selectedItemsArr[i] && selectedItemsArr != 0) {
      items = items.concat("{");
      items = items.concat('"id": "' + selectedItemsArr[i] + '"');
      items = items.concat('"count": "1"');
      items = items.concat("},");
    }
  }
  items = items.concat("],");
  let JSON = '{"title": '
    .concat(title)
    .concat('"associatedMaps": [],')
    .concat('"associatedChampions": [')
    .concat(selectedChampionKey)
    .concat("],")
    .concat('"blocks": [')
    .concat("{")
    .concat(items)
    .concat('"type": "New Block"')
    .concat("}]}");
  return JSON;
}

function setupStats() {
  resetStats();
  if (selectedChampion != null && selectedChampion != undefined) {
    extractChampionStats(selectedChampion, function () {
      if (selectedItemsArr.length > 0) {
        selectedItemsArr.forEach(item => {
          if (item != undefined && item != null && item != 0) {
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
  presentableStats["health-regen"] =
    Math.round(
      championStats["PercentHPRegen"] * (1 + itemStats["PercentHPRegen"]) / 5
    ) + "/s";
  presentableStats["mana-regen"] =
    Math.round(
      championStats["PercentMPRegen"] * (1 + itemStats["PercentMPRegen"]) / 5
    ) + "/s";
  presentableStats["health-pool"] = Math.round(
    championStats["FlatHPPoolMod"] + itemStats["FlatHPPoolMod"]
  );

  presentableStats["partype"] = championStats["partype"];

  if (presentableStats["partype"] != "Mana") {
    presentableStats["mana-pool"] = Math.round(championStats["FlatMPPoolMod"]);
  } else {
    presentableStats["mana-pool"] = Math.round(
      championStats["FlatMPPoolMod"] + itemStats["FlatMPPoolMod"]
    );
  }

  presentableStats["armor-penetration"] =
    itemStats["rFlatArmorPenetrationMod"] +
    " | " +
    itemStats["PercentArmorPenetrationMod"] +
    "%";
  presentableStats["magic-penetration"] =
    itemStats["rFlatMagicPenetrationMod"] +
    " | " +
    itemStats["PercentMagicPenetrationMod"] +
    "%";
  presentableStats["life-steal"] = itemStats["PercentLifeStealMod"] * 100 + "%";
  presentableStats["spell-vamp"] = itemStats["PercentSpellVampMod"] * 100 + "%";
  presentableStats["crit-chance"] = itemStats["FlatCritChanceMod"] * 100 + "%";
  presentableStats["tenacity"] =
    itemStats["PercentMovementImpedementResistance"] + "%";
  presentableStats["attack-damage"] = Math.round(
    itemStats["FlatPhysicalDamageMod"] + championStats["FlatPhysicalDamageMod"]
  );
  presentableStats["ability-power"] = Math.round(
    itemStats["FlatMagicDamageMod"] + championStats["FlatMagicDamageMod"]
  );
  presentableStats["armor"] = Math.round(
    itemStats["FlatArmorMod"] + championStats["FlatArmorMod"]
  );
  presentableStats["magic-resist"] = Math.round(
    itemStats["FlatSpellBlockMod"] + championStats["FlatSpellBlockMod"]
  );
  presentableStats["attack-speed"] = (
    (1 + itemStats["PercentAttackSpeedMod"]) *
    championStats["BaseAttackSpeed"]
  ).toFixed(3);

  presentableStats["cooldown-reduction"] =
    Math.round(100 * itemStats["rPercentCooldownMod"]) + "%";
  presentableStats["attack-range"] =
    itemStats["attack-range"] + championStats["attack-range"];
  presentableStats["movement-speed"] = Math.round(
    (itemStats["FlatMovementSpeedMod"] +
      championStats["FlatMovementSpeedMod"]) *
    (1 + itemStats["PercentMovementSpeedMod"])
  );
  presentableStats["item-info"] = itemStats["item-info"];
}

function isMultiplier(stat) {
  let multiplierStats = [
    "PercentHPRegen",
    "PercentMPRegen",
    "PercentAttackSpeedMod",
    "PercentMovementSpeedMod"
  ];
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

function popAllSaves(buildsArr) {
  var champRequest = new XMLHttpRequest();
  var champRequestURL =
    "http://ddragon.leagueoflegends.com/cdn/" +
    version +
    "/data/en_US/champion.json";
  champRequest.open("GET", champRequestURL, true);
  champRequest.responseType = "json";
  champRequest.send();
  champRequest.onload = function () {
    var champjson = champRequest.response;
    var itemRequest = new XMLHttpRequest();
    var itemRequestURL =
      "http://ddragon.leagueoflegends.com/cdn/" +
      version +
      "/data/en_US/item.json";
    itemRequest.open("GET", itemRequestURL, true);
    itemRequest.responseType = "json";
    itemRequest.send();
    itemRequest.onload = function () {
      allItems = itemRequest.response["data"];
      document.getElementById("list-container").innerHTML = "";
      for (let i = 0; i < buildsArr.length; i += 1) {
        let b = buildsArr[i];
        let myDiv = document.createElement("div");
        let champID = b["championName"];
        let buildTitle = b["buildtitle"];
        let items = [];
        for (let i = 1; i <= 6; i += 1) {
          // items.push(b["item" + i]);
          items[i - 1] = (b["item" + i]);

        }
        let champThumbSrc = 'url("http://ddragon.leagueoflegends.com/cdn/' + version + "/img/champion/" + champjson["data"][champID]["image"]["full"] + '")';
        myDiv.classList.add("loaded-build");

        myDiv.style.backgroundImage = champThumbSrc;
        for (let item = 0; item < 6; item += 1) {
          let myitemImg = document.createElement("img");
          myitemImg.classList.add("item-thumb");
          curItem = items[item];
          if (curItem != undefined && curItem != null && curItem != 0) {
            let itemThumb =
              "http://ddragon.leagueoflegends.com/cdn/" +
              version +
              "/img/item/" +
              allItems[curItem]["image"]["full"];
            myitemImg.src = itemThumb;
          }
          myDiv.appendChild(myitemImg);
        }
        myDiv.addEventListener("click", (e) => {
          selectBuild(champID, buildTitle, items, e.currentTarget);
        });
        document.getElementById("list-container").appendChild(myDiv);
      }
    };
  };
}


function selectBuild(championName, buildTitle, items, me) {
  let meChilds = me.childNodes;
  console.log(items);
  console.log(championName);
  selectChampion(championName);
  for (let i = 1; i <= 6; i += 1) {
    selectedItemsArr[i - 1] = items[i - 1];
    console.log(document.getElementById("item-slot-" + i));
    console.log(meChilds[i - 1].currentSrc);
    let stoopid = document.getElementById("item-slot-" + i);
    stoopid.style.backgroundImage = "url(\"" + meChilds[i - 1].currentSrc + "\")";
  }
}
