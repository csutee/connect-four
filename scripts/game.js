const startButton = document.querySelector("#startButton")
const indexField = document.querySelector("#indexField")
const gameField = document.querySelector("#gameField")
let stats = document.querySelector("#stats");

let table;

startButton.addEventListener("click", startGame)

let gameTable = [];
let gameOver = false;
let playerNames = [];

let actualPlayerField = document.querySelector("#actualPlayerName")
let actualPlayer;

let selectedColumn;
let pointerOnElement;

let playedMatches = [
]; //["1. játékos","2. játékos",1.játékos win, draws, 2. játékos wins]

let canPlaceCircle = true;

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}

function hasRecord() {
    for (let i = 0; i < playedMatches.length; i++) {
        if(playedMatches[i][0] == playerNames[0] && playedMatches[i][1] == playerNames[1]) {
            return true;
        }
    }

    return false;
}

function updateStats(result) {
    if(!hasRecord()) {
        playedMatches.push([playerNames[0],playerNames[1],0,0,0]);
    }

    for (let i = 0; i < playedMatches.length; i++) {
        if(playedMatches[i][0] == playerNames[0] && playedMatches[i][1] == playerNames[1]) {
            if(result == playerNames[0]) {
                playedMatches[i][2] += 1;
            }
            else if(result == playerNames[1]) {
                playedMatches[i][4] += 1;
            }
            else if(result == "draw") {
                playedMatches[i][3] += 1;
            }
        } 
    }

    
}

function startGame(e) {
    let firstPlayerName = document.querySelector("#firstPlayerName").value
    let secondPlayerName = document.querySelector("#secondPlayerName").value

    //console.log(firstPlayerName + " " + secondPlayerName);

    if(firstPlayerName == "") {
        firstPlayerName = "1. játékos";
    }
    if(secondPlayerName == "") {
        secondPlayerName = "2. játékos";
    }

    playerNames = [firstPlayerName, secondPlayerName];
    actualPlayer = playerNames[0];
    actualPlayerField.innerHTML = playerNames[0] + " 🔴"
    
    indexField.style.display = "none";
    stats.style.display = "none";
    gameField.style.display = "block";
    generateTable();
}

function backToMenu() {
    indexField.style.display = "block";
    gameField.style.display = "none";

    let statList = document.querySelector("#statList");
    statList.innerHTML = "";
    for(let i=0; i<playedMatches.length; i++) {
        let fullName = document.createElement("li")
        fullName.id = "fullName";
        fullName.innerHTML = playedMatches[i][0] + "-" + playedMatches[i][1];

        fullName.addEventListener("click", function(e){
            //console.log(e.target);
            if(e.target.id == "fullName") {
                let firstPlayerName = document.querySelector("#firstPlayerName");
                let secondPlayerName = document.querySelector("#secondPlayerName");

                firstPlayerName.value = playedMatches[i][0];
                secondPlayerName.value = playedMatches[i][1];
            }
            
        })

        let result = document.createElement("ul");
        let firstWins = document.createElement("li");
        firstWins.innerHTML = playedMatches[i][0] + " ennyiszer nyert: " + playedMatches[i][2];

        let draws = document.createElement("li");
        draws.innerHTML = "Döntetlenek: " + playedMatches[i][3];

        let secondWins = document.createElement("li");
        secondWins.innerHTML = playedMatches[i][1] + " ennyiszer nyert: " + playedMatches[i][4];

        result.appendChild(firstWins);
        result.appendChild(draws);
        result.appendChild(secondWins);

        fullName.appendChild(result);
        statList.appendChild(fullName);
        
    }

    

    stats.style.display = "block";

    table.remove();



}

function generateTable() {
    gameTable = [];

    table = document.createElement("table");
    
    let tr = document.createElement("tr");
    for(let i=0; i<7; i++) {
        let td = document.createElement("td");
        td.className = "column";
        td.id = i;
        tr.appendChild(td);
    }
    table.appendChild(tr);

    for(let i=0; i<6; i++) {
        let tr = document.createElement("tr");

        for(let i=0; i<7; i++) {
            let td = document.createElement("td");
            td.className = "circle";
            tr.appendChild(td);
            
        }
        table.appendChild(tr);
        gameTable.push(tr.childNodes);
        //gameTable.push(tr);
    }

    gameField.append(table);

    //console.log(gameTable);

    delegate(table, "mouseover", "td", mouseOverTD);
    delegate(table, "mouseout", "td", mouseLeaveTD);
    delegate(table, "click", "td", clickOnTD);

    selectedColumn = document.getElementById("0");
    selectedColumn.className = "column circle-red";


    document.addEventListener("keydown", pressedKey);

    gameOver = false;
    canPlaceCircle = true;

}

function isColumnFull(column) {
    for(let i=0; i<gameTable.length; i++) {
        if(gameTable[i][column].className == "circle") {
            return false;
        }
    }
    return true;
}

function isDraw() {
    for(let i = 0; i<gameTable[0].length; i++) {
        if(!isColumnFull(i)) {
            return false;
        }
    }

    return true;
}

function gotWinner(pos) {

    let col = pos[1];
    let row = pos[0];
    let i,j;
    let horizontalCounter = 0;
    let diagonalCounter = 0;

    if(actualPlayer == playerNames[0]) {
        //Fuggoleges check red
        if(gameTable[row+1] != undefined && gameTable[row+2] != undefined && gameTable[row+3] != undefined) {
            if(gameTable[row+1][col].className == "circle-red" && gameTable[row+2][col].className == "circle-red" && gameTable[row+3][col].className == "circle-red") {
                return true;
            }
        }


        //Vizszintes check red
        
        i = col-1;
        while(i >= 0 && gameTable[row][i].className == "circle-red") {
            --i;
            ++horizontalCounter;
        }

        i = col+1;
        while(i != gameTable[row].length && gameTable[row][i].className == "circle-red") {
            ++i;
            ++horizontalCounter;
        }

        //console.log(horizontalCounter);

        if(horizontalCounter == 3) {
            return true;
        }

        //Atlok
        //Bal fel red
        i = col-1;
        j = row-1;
        diagonalCounter = 0;
        while(i >= 0 && j >= 0 && gameTable[j][i].className == "circle-red") {
            --i;
            --j;
            ++diagonalCounter;
        }
        if(diagonalCounter >= 3) {
            return true;
        }

        //Jobb le red
        i = col+1;
        j = row+1;
        //diagonalCounter = 0;
        while(i != gameTable[row].length && j != gameTable.length && gameTable[j][i].className == "circle-red") {
            ++i;
            ++j;
            ++diagonalCounter;
        }
        if(diagonalCounter >= 3) {
            return true;
        }

        //Bal le red
        i = col-1;
        j = row+1;
        diagonalCounter = 0;
        while(i >= 0 && j != gameTable.length && gameTable[j][i].className == "circle-red") {
            --i;
            ++j;
            ++diagonalCounter;
        }
        if(diagonalCounter >= 3) {
            return true;
        }

        //Jobb fel red
        i = col+1;
        j = row-1;
        //diagonalCounter = 0;
        while(j >= 0 && i != gameTable[row].length && gameTable[j][i].className == "circle-red") {
            ++i;
            --j;
            ++diagonalCounter;
        }
        if(diagonalCounter >= 3) {
            return true;
        }

    }
    else {
        //Fuggoleges check yellow
        if(gameTable[row+1] != undefined && gameTable[row+2] != undefined && gameTable[row+3] != undefined) {
            if(gameTable[row+1][col].className == "circle-yellow" && gameTable[row+2][col].className == "circle-yellow" && gameTable[row+3][col].className == "circle-yellow") {
                return true;
            }
        }


        //Vizszintes check red
        i = col-1;
        while(i >= 0 && gameTable[row][i].className == "circle-yellow") {
            --i;
            ++horizontalCounter;
        }

        i = col+1;
        while(i != gameTable[row].length && gameTable[row][i].className == "circle-yellow") {
            ++i;
            ++horizontalCounter;
        }

        //console.log(horizontalCounter);

        if(horizontalCounter == 3) {
            return true;
        }

        
        //Atlok
        //Bal fel red
        i = col-1;
        j = row-1;
        diagonalCounter = 0;
        while(i >= 0 && j >= 0 && gameTable[j][i].className == "circle-yellow") {
            --i;
            --j;
            ++diagonalCounter;
        }
        if(diagonalCounter >= 3) {
            return true;
        }

        //Jobb le red
        i = col+1;
        j = row+1;
        //diagonalCounter = 0;
        while(i != gameTable[row].length && j != gameTable.length && gameTable[j][i].className == "circle-yellow") {
            ++i;
            ++j;
            ++diagonalCounter;
        }
        if(diagonalCounter >= 3) {
            return true;
        }

        //Bal le red
        i = col-1;
        j = row+1;
        diagonalCounter = 0;
        while(i >= 0 && j != gameTable.length && gameTable[j][i].className == "circle-yellow") {
            --i;
            ++j;
            ++diagonalCounter;
        }
        if(diagonalCounter >= 3) {
            return true;
        }

        //Jobb fel red
        i = col+1;
        j = row-1;
        //diagonalCounter = 0;
        while(j >= 0 && i != gameTable[row].length && gameTable[j][i].className == "circle-yellow") {
            ++i;
            --j;
            ++diagonalCounter;
        }
        if(diagonalCounter >= 3) {
            return true;
        }
    }

    return false;
}

function changePlayer() {
    if(actualPlayer == playerNames[0]) {
        actualPlayer = playerNames[1];
        actualPlayerField.innerHTML = actualPlayer + " 🟡";
        //console.log(selectedColumn);
        selectedColumn.className = "column circle-yellow";
        //console.log(selectedColumn)
    }
    else {
        actualPlayer = playerNames[0];
        actualPlayerField.innerHTML = actualPlayer + " 🔴";
        selectedColumn.className = "column circle-red";
        //console.log(selectedColumn);
    }

}

function placeCircle(column) {

    canPlaceCircle = false;

    if(!gameOver) {
        if(!isColumnFull(column)) {

            if(actualPlayer == playerNames[0]) {
                gameTable[0][column].className = "circle-red";
            }
            else {
                gameTable[0][column].className = "circle-yellow";
            }
            
            let i = 1;
            
            let timer = setInterval(function() {
                if(i != gameTable.length) {
                    if(actualPlayer == playerNames[0]) {
                        if(gameTable[i][column].className == "circle") {
                            gameTable[i-1][column].className = "circle";
                            gameTable[i][column].className = "circle-red";
                        }
                        else {
                            clearInterval(timer);
                            //console.log("interval checked");
                            let lastPlacedPos = [i-1, column];
                            if(!gotWinner(lastPlacedPos)) {
                                if(!isDraw()) {
                                    canPlaceCircle = true;
                                    changePlayer();
                                }
                                else {
                                    alert("Döntetlen!");
                                    updateStats("draw");
                                    backToMenu();
                                }
                                
                            }
                            else {
                                canPlaceCircle = true;
                                gameOver = true;
                                setTimeout(function() {
                                    alert("Játék vége! Nyertes: " + actualPlayer);
                                    updateStats(actualPlayer);
                                    backToMenu();
                                }, 200);

                                
                            }
                        }
                    }
                    else {
                        if(gameTable[i][column].className == "circle") {
                            gameTable[i-1][column].className = "circle";
                            gameTable[i][column].className = "circle-yellow";
                        }
                        else {
                            clearInterval(timer);
                            let lastPlacedPos = [i-1, column];
                            if(!gotWinner(lastPlacedPos)) {
                                if(!isDraw()) {
                                    canPlaceCircle = true;
                                    changePlayer();
                                }
                                else {
                                    alert("Döntetlen!");
                                    updateStats("draw");
                                    backToMenu();
                                }
                                
                            }
                            else {
                                canPlaceCircle = true;
                                gameOver = true;
                                setTimeout(function() {
                                    alert("Játék vége! Nyertes: " + actualPlayer);
                                    updateStats(actualPlayer);
                                    backToMenu();
                                }, 200);
                                
                            }
                        }
                    }
                }
                else {
                    clearInterval(timer);
                    let lastPlacedPos = [i-1, column];
                    if(!gotWinner(lastPlacedPos)) {
                        if(!isDraw()) {
                            canPlaceCircle = true;
                            changePlayer();
                        }
                        else {
                            alert("Döntetlen!");
                            updateStats("draw");
                            backToMenu();
                        }
                        
                    }
                    else {
                        canPlaceCircle = true;
                        gameOver = true;
                        setTimeout(function() {
                            alert("Játék vége! Nyertes: " + actualPlayer);
                            updateStats(actualPlayer);
                            backToMenu();
                        }, 200);
                    }
                }

                i = i + 1;
            },250)
        }
        else {
            alert("Az adott oszlop már tele van!");
            canPlaceCircle = true;
        }

        
        

        /* if(!gotWinner(lastPlacedPos)) {
            changePlayer();
        }
        else {
            
            //console.log("nyert");
            alert("Játék vége! Nyertes: " + actualPlayer);
            
        } */
    }
}

function mouseLeaveTD(e) {
    if(e.target.classList[0] == "column") {
        selectedColumn.className = "column";
        selectedColumn = document.getElementById("0");
        if(actualPlayer == playerNames[0]) {
            selectedColumn.className = "column circle-red";
        }
        else {
            selectedColumn.className = "column circle-yellow";
        }
    }
}

function clickOnTD(e) {
    //console.log(e.target);
    if(selectedColumn == e.target) {
        if(canPlaceCircle) {
            placeCircle(parseInt(e.target.id));
        }
    }
}

function pressedKey(e) {
    if(e.keyCode == 37) {
        if(parseInt(selectedColumn.id) > 0) {
            selectedColumn.className = "column";
            selectedColumn = document.getElementById(parseInt(selectedColumn.id) - 1);
            if(actualPlayer == playerNames[0]) {
                selectedColumn.className = "column circle-red";
            }
            else {
                selectedColumn.className = "column circle-yellow";
            }
        }
        //console.log("balra nyil");
    }
    else if(e.keyCode == 39) {
        if(parseInt(selectedColumn.id) < 6) {
            selectedColumn.className = "column";
            selectedColumn = document.getElementById(parseInt(selectedColumn.id) + 1);
            if(actualPlayer == playerNames[0]) {
                selectedColumn.className = "column circle-red";
            }
            else {
                selectedColumn.className = "column circle-yellow";
            }
            
        }
        //console.log("jobb nyil");
    }
    else if(e.keyCode == 32) {
        //console.log("Space");
        if(canPlaceCircle) {
            placeCircle(parseInt(selectedColumn.id));
        }
        
    }
    else if(e.keyCode == 13) {
        //console.log("Enter");
        if(canPlaceCircle) {
            placeCircle(parseInt(selectedColumn.id));
        }
    }
}


function mouseOverTD(e) {
    if(e.target.classList[0] == "column") {
        selectedColumn.className = "column";
        selectedColumn = e.target;
        if(actualPlayer == playerNames[0]) {
            selectedColumn.className = "column circle-red";
            //console.log("changed");
        }
        else if(actualPlayer == playerNames[1]) {
            selectedColumn.className = "column circle-yellow";
        }
    }
    //console.log("ok")
}

function delegate(parent, type, selector, handler) {
    parent.addEventListener(type, function(event) {
        const targetElement = event.target.closest(selector);
        if(this.contains(targetElement)) handler.call(targetElement, event)
    })
}