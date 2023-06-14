var modal = document.getElementById("fagModal");
var span = document.getElementsByClassName("close")[0];


var fagDict = {};
var fagRows = [];

const VÆGTNING = Object.freeze({
    "A": 2,
    "B": 1.5,
    "C": 1
});


span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function nyFag() {
    document.getElementById("fagNvn").value = "";
    document.getElementById("fagTyp").value = "";
    document.getElementById("fagLvl").value = "";
    document.getElementById("fagRes").value = "";

    modal.style.display = "block";
}

function lavNyFag() {
    var fagNvn = document.getElementById("fagNvn").value;
    const fagLvl = document.getElementById("fagLvl").value;
    const fagRes = document.getElementById("fagRes").value;
    const fagTyp = document.getElementById("fagTyp").value;

    if (fagNvn != "" && fagLvl != "" && fagRes != "" && fagTyp != "") {
        modal.style.display = "none";
        fagNvn += " " +  fagTyp;

        const fagTbl = document.getElementById("fagTbl");    
        const tr = fagTbl.insertRow(fagTbl.rows.length-1);

        tr.className = "fagRow";

        const tdFag = tr.insertCell();
        const tdLvl = tr.insertCell();
        const tdRes = tr.insertCell();
        const tdRem = tr.insertCell();

        tdFag.className = "fagContent";
        tdLvl.className = "fagContent";
        tdRes.className = "fagContent";

        const karInput = document.createElement("input");
        const fagFjern = document.createElement("button");

        karInput.className = "karakterInput";
        karInput.type = "text";
        karInput.placeholder = "Karakter";
        karInput.value = fagRes;

        fagRows.push(tr);

        fagFjern.className = "fjernButton";
        fagFjern.textContent = "X";
        fagFjern.addEventListener("click", function() {
            fjernFag(fagRows.indexOf(tr));
        });

        tdFag.appendChild(document.createTextNode(fagNvn));
        tdLvl.appendChild(document.createTextNode(fagLvl));
        tdRes.appendChild(karInput);
        tdRem.appendChild(fagFjern);

        findSammeFag(fagTbl);
        document.getElementById("snitTd").innerHTML = udregnSnit(fagTbl);
    }
}

function findSammeFag(tbl) {
    fagDict = {}
    for (var i = Object.keys(fagDict).length+1; i < tbl.rows.length-1; i++) {
        if (i == 0) { continue; }

        const value = tbl.rows[i].cells[0].innerHTML.split(" ");
        const karak = tbl.rows[i].cells[2].children[0].value;
        const level = tbl.rows[i].cells[1].innerHTML.toUpperCase();
        var name = value[0].toLowerCase();
        var type = value[1][0].toLowerCase();

        if (name in fagDict) {
            if (fagDict[name].indexOf(type) == -1) {
                fagDict[name].push(type);
                fagDict[name].push(karak);
                fagDict[name].push(level);
            }
        }
        else
        { fagDict[name] = [type, karak, level]; }
    }
}

function udregnSnit(tbl) {
    var amountA = 0;
    var snit = 0;
    var levelSum = 0;
    const keys = Object.keys(fagDict);
   
    for (var i = 0; i < keys.length; i++) {
        var level = VÆGTNING[fagDict[keys[i]][2]];
        amountA += (level == "A") ? 1 : 0;
        var karak = fagDict[keys[i]][1];

        levelSum += level;
        if (fagDict[keys[i]] > 3) {
            var karak2 = fagDict[keys[i]][4];
            level /= 2;
            snit += (karak * level) + (karak2 * level);
        }
        else {
            snit += karak * level;
        }
    }

    snit /= levelSum;
    snit *= (amountA == 5) ? 1.03 : 1;
    snit *= (amountA >= 6) ? 1.06 : 1;
    return snit;
}

function fjernFag(index) {
    const fag = fagRows[index];
    fag.remove();

    const tbl = document.getElementById("fagTbl");
    const txt = document.getElementById("snitTd");

    

    findSammeFag(tbl);
    const snit = udregnSnit(tbl);
    txt.innerHTML = (snit.toString() === "NaN") ? 0 : snit;
}
