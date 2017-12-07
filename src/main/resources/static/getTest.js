var api_key = "&api_key=RGAPI-9473df52-0728-4513-a12e-7aa5dd60093a";
var champSearchTags = {
    allytips: "allytips",
    blurb: "blurb",
    enemytips: "enemytips",
    image: "image",
    info: "info",
    lore: "lore",
    partype: "partype",
    passive: "passive",
    recommended: "recommended",
    skins: "skins",
    spells: "spells",
    stats: "stats",
    tags: "tags",
    keys: "keys",
}

var itemSearchTags = {
    colloq: "colloq",
    consumeOnFull: "consumeOnFull",
    consumed: "consumed",
    depth: "depth",
    effect: "effect",
    from: "from",
    gold: "gold",
    groups: "groups",
    hideFromAll: "hideFromAll",
    image: "image",
    inStore: "inStore",
    into: "into",
    maps: "maps",
    requiredChampion: "requiredChampion",
    sanitizedDescription: "sanitizedDescription",
    specialRecipe: "specialRecipe",
    stacks: "stacks",
    stats: "stats",
    tags: "tags",
    tree: "tree"
}



var champUrl = "https://eun1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US";

// https://eun1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=image&tags=keys&tags=passive&tags=spells&tags=stats&tags=tags&dataById=false&api_key=RGAPI-9473df52-0728-4513-a12e-7aa5dd60093a
// https://eun1.api.riotgames.com/lol/static-data/v3/champions/266?locale=en_US&tags=allytips&tags=blurb&tags=enemytips&tags=image&tags=info&tags=lore&tags=partype&tags=passive&tags=recommended&tags=skins&tags=spells&tags=stats&tags=tags&api_key=RGAPI-9473df52-0728-4513-a12e-7aa5dd60093a
// https://eun1.api.riotgames.com/lol/static-data/v3/items?locale=en_US&tags=colloq&tags=consumeOnFull&tags=consumed&tags=depth&tags=effect&tags=from&tags=gold&tags=groups&tags=hideFromAll&tags=image&tags=inStore&tags=into&tags=maps&tags=requiredChampion&tags=sanitizedDescription&tags=specialRecipe&tags=stacks&tags=stats&tags=tags&tags=tree&api_key=RGAPI-9473df52-0728-4513-a12e-7aa5dd60093a
// https://eun1.api.riotgames.com/lol/static-data/v3/items/1001?locale=en_US&api_key=RGAPI-9473df52-0728-4513-a12e-7aa5dd60093a

var currentItemStats = {}; // For storing the stats of the selected item 
var allItems = {}; // For caching later
function getAllItems() {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/item.json";
    request.open("GET", requestURL);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        let items = request.response;
        stats = items["basic"]["stats"];
        console.log(items);
        allItems = items["data"];
        for (let item in allItems) {
            let mySpan = document.createElement("span");
            let myImg = document.createElement("img");
            let myTitle = document.createElement("span");
            myImg.src = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/item/" + items["data"][item]["image"]["full"];
            myTitle.innerText = allItems[item]["name"];
            mySpan.appendChild(myImg);
            mySpan.appendChild(myTitle);
            document.getElementById("searchRow").appendChild(mySpan);
        }
        extractStats("1001");
    };
}


function extractStats(itemID) {
    var item = {};
    if (allItems.hasOwnProperty(itemID)) {
        item = allItems[itemID];
        console.log(item);
    }

    item["tags"].forEach( tag => {
        if (tag.indexOf("Regen") > -1) {
            let desc = parseDescription(item);
            for (let prop in desc) {
                console.log(prop);
                stats[prop] += desc[prop];
            }
        }
    });

    for (let key in item["stats"]) {

        // for (let i = 0; i < item["tags"].length(); i+=1)

        if (stats.hasOwnProperty(key)) {
            stats[key] += item["stats"][key];
            console.log("Extract " + stats[key] + " from " + item["stats"]);
        }
        console.log("Key was " + key);

    }
}

function parseDescription(item) {

    let description = item["description"];
    let start = description.indexOf("<stats>");
    let end = description.indexOf("</stats>");
    let regens = description.substring(start, end);

    let stats = regens.match(/\d+/g);
    let tags = item["tags"];
    let hpregen = 0;
    let mpregen = 0;

    for (let i = 0; i < tags.length(); i++) {
        if (tags[i].equals("HealthRegen")) {
            hpregen = stats[i];
        } else if (tags[i].equals("ManaRegen")) {
            mpregen = stats[i];
        }
    }

    return {
        "PercentHPRegenMod": hpregen,
        "PercentMPRegenMod": mpregen
    };
}


function getAllChampions() {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/champion.json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        let champions = request.response;
        for (let champion in champions["data"]) {
            let mySpan = document.createElement("span");
            let myImg = document.createElement("img");
            let myTitle = document.createElement("span");
            myImg.src = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + champions["data"][champion]["image"]["full"];
            myTitle.innerText = champions["data"][champion]["name"];
            mySpan.appendChild(myImg);
            mySpan.appendChild(myTitle);
            document.getElementById("searchRow").appendChild(mySpan);
        }
    };
}

function getOneChampion(event) {
    var request = new XMLHttpRequest();
    var requestURL = "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/en_US/champions/+" + event + ".json";
    request.open("GET", requestURL, true);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        let champions = request.response;
        for (let champion in champions["data"]) {
            let mySpan = document.createElement("span");
            let myImg = document.createElement("img");
            let myTitle = document.createElement("span");
            myImg.src = "http://ddragon.leagueoflegends.com/cdn/7.24.1/img/champion/" + champions["data"][champion]["image"]["full"];
            myTitle.innerText = champions["data"][champion]["name"];
            mySpan.appendChild(myImg);
            mySpan.appendChild(myTitle);
            document.getElementById("searchRow").appendChild(mySpan);
        }
    };
}

function loadJSON(callback) {
    let runeData = "./json/perks.json"

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

function handleRunes(response) {
    // Do Something with the response e.g.
    console.log(response);
    jsonresponse = JSON.parse(response);
    console.log(jsonresponse);
    for (let perk in jsonresponse) {

        let mySpan = document.createElement("span");
        let myImg = document.createElement("img");
        let myTitle = document.createElement("span");
        myImg.src = jsonresponse.
            myTitle.innerText = champions["data"][champion]["name"];
        mySpan.appendChild(myImg);
        mySpan.appendChild(myTitle);
    }
    document.getElementById("searchRow").appendChild(mySpan);
}