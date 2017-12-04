var request = new XMLHttpRequest();
var requestURL = "http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/item.json";

request.open("GET", requestURL);

request.responseType = "json";
request.send();

request.onload = function () {
    var json = request.response;
    var allItems = [];
    var i = 0;
    for (items in json["data"]) {
        console.log(items);
        // allItems[i++] = items;
        let myTd = document.createElement("td");

        let obj = "<img src=\"http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/" + json["data"][items]["image"]["full"] + "\">" +
            "<p>" + json["data"][items]["name"] + "</p> ";
        myTd.innerHTML = obj;
        document.getElementById("searchRow").appendChild(myTd);
    }




    // json["data"].forEach(item => {
    //     console.log(item);
    //     document.getElementById("searchRow").appendChild("<td> " +
    //                       "<img src=\"http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/" +item["image"["full"] + "\">" +
    //                       "<p>" + item["name"] + "</p> " +
    //                   "</td>");
    // });



    console.log(json);

    document.getElementById("items").innerText = json["data"]["1001"]["name"];
};

