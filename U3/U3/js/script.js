var newGameButton;
var newBricksButton;

var newBrickImgElems;//4 new brick elements
var boardBrickElems; // All 24 board brick elements

var initImgList = []; // holds represenation of all 40 images

var brickCounter = 0; // counts how many of the new bricks have been moved;

var moveCountElem;


var scoreTotalElem;
var totalScoreCount;

var countGamesElem;
var totalGamesCount;

var messageElem;

var markElems;


window.addEventListener("load", init);


function init() {


    newGameButton = document.getElementById("newGameBtn");
    newBricksButton = document.getElementById("newBricksBtn");
    moveCountElem = document.getElementById("moveCount");
    scoreTotalElem = document.getElementById("totPoints");
    countGamesElem = document.getElementById("countGames");
    messageElem = document.getElementById("message");

    newBrickImgElems = document.getElementById("newBricks").getElementsByTagName("img");
    boardBrickElems = document.getElementById("board").getElementsByTagName("img");


    newGameButton.addEventListener("click", newGame);
    newBricksButton.addEventListener("click", newBricks);

    markElems = document.getElementsByClassName("mark");

    newGameButton.disabled = false;
    newBricksButton.disabled = true;

    getCoockieData();

}

function getCoockieData() {

    let dataStr = getCookie("cv222iv");
    if (dataStr != null) {
        let dataArr = dataStr.split("&");

        totalScoreCount = parseInt(dataArr[0], 10);
        totalGamesCount = parseInt(dataArr[1], 10);

        scoreTotalElem.innerHTML = totalScoreCount;
        countGamesElem.innerHTML = totalGamesCount;

    } else {
        totalScoreCount = 0;
        totalGamesCount = 0;

        scoreTotalElem.innerHTML = totalScoreCount;
        countGamesElem.innerHTML = totalGamesCount;
    }

}

function dragStartBrick(e) {


    e.dataTransfer.setData("text", this.src);


}


function dragEndBrick(e) {

    e.preventDefault();


    if (e.type === "dragover" && (this.id === "")) {
        this.style.backgroundColor = "#9C9";
    }

    if (e.type === "dragleave") {
        this.style.backgroundColor = "";
    }
    if (e.type === "drop" && (this.id === "")) {

        brickCounter++; // count nr of bricks that have been moveed so "nya brickor" button can be toggelled on and off
        moveCountElem.innerHTML = (16 - brickCounter);


        // old works on locallet imgNr = e.dataTransfer.getData("text").substr(e.dataTransfer.getData("text").indexOf("i"));

        //Extraherar den sista biten som alltid kommer inehålla de siffror jag är intressearade av och inga andra siffror
        let imgNr = e.dataTransfer.getData("text").slice(-8);

        //Used to extract picture number so it can be stored in id
        let reg1 = /\d+/;

        //stores the img number in imgNr
        imgNr = imgNr.match(reg1);


        //interactions with the slot that the brick has been placed in
        this.src = e.dataTransfer.getData("text");
        this.style.backgroundColor = "";
        this.setAttribute("draggable", false);
        this.setAttribute("id", imgNr);
        this.className = this.className.substring(0, 6) + "brick";


        //Used to find corret block & make the brick dropped un-draggable and hold empty img
        for (let i = 0; i < newBrickImgElems.length; i++) {

            if (e.dataTransfer.getData("text") === newBrickImgElems[i].src) {
                newBrickImgElems[i].setAttribute("draggable", false);
                newBrickImgElems[i].src = "img/empty.png";
            }

        }


        //Used to disable and enable newBricksButton via counters of dropped bricks
        if ((initImgList.length > 24) && (brickCounter % 4 == 0)) {
            newBricksButton.disabled = false;
        } else newBricksButton.disabled = true;


        //All 16 brick slots are filled, calculate score for current game
        if (brickCounter == 16) {
            scoreCalc();
        }

    }
}


function scoreCalc() {

    let brickRow = []; // Used to hold values
    let BrickNrs = []; // used to hold values of bricks to evaluate if player scored
    let score = 0;

    //For vertical signs
    //This loop is to itterate over rows
    for (let r = 0; r < 4; r++) {

        //this loop is to itterate over columns
        for (let i = 0; i < 4; i++) {

            brickRow[i] = document.getElementsByClassName('r' + (r + 1) + ' c' + (i + 1));

            BrickNrs.push(parseInt(brickRow[i][0].id, 10));

        }

        let resultElem = document.getElementById('r' + (r + 1) + 'mark');


        //kontrollerar om man skall få poäng; är nästkommande nummer är större än det föregående?
        if ((BrickNrs[0] < BrickNrs[1]) && (BrickNrs[1] < BrickNrs[2]) && (BrickNrs[2] < BrickNrs[3])) {
            resultElem.innerHTML = "&check;";
            resultElem.style.color = "#008000";
            score++;
        } else {
            resultElem.innerHTML = "&cross;";
            resultElem.style.color = "#FF0000";
        }
        BrickNrs.splice(0, 4);

    }


    //For horisontal signs
    //This loop is to itterate over columns
    for (let i = 0; i < 4; i++) {

        //this loop is to itterate over rows
        for (let r = 0; r < 4; r++) {

            brickRow[r] = document.getElementsByClassName('r' + (r + 1) + ' c' + (i + 1));

            BrickNrs.push(parseInt(brickRow[r][0].id, 10));

        }

        let resultElem = document.getElementById('c' + (i + 1) + 'mark');


        //kontrollerar om man skall få poäng; är nästkommande nummer är större än det föregående?
        if ((BrickNrs[0] < BrickNrs[1]) && (BrickNrs[1] < BrickNrs[2]) && (BrickNrs[2] < BrickNrs[3])) {
            resultElem.innerHTML = "&check;";
            resultElem.style.color = "#008000";
            score++;

        } else {
            resultElem.innerHTML = "&cross;";
            resultElem.style.color = "#FF0000";
        }
        BrickNrs.splice(0, 4);

    }

    messageElem.innerHTML = "You´re score for this game was = " + score;

    totalScoreCount = totalScoreCount + score;
    scoreTotalElem.innerHTML = totalScoreCount;


    totalGamesCount++;
    countGamesElem.innerHTML = totalGamesCount;

    newGameButton.disabled = false;

    saveStats();


}

function saveStats() {


    let stats = encodeURIComponent(totalScoreCount) + "&" + encodeURIComponent(totalGamesCount)

    setCookie("cv222iv", stats, 30);
    getCoockieData();
}


function newGame() {

    newGameButton.disabled = true;
    newBricksButton.disabled = false;
    brickCounter = 0;
    messageElem.innerHTML = "";


    // Går igenom alla Board brick elements
    for (let i = 0; i < boardBrickElems.length; i++) {
        boardBrickElems[i].setAttribute("draggable", true);
        boardBrickElems[i].addEventListener("dragover", dragEndBrick);
        boardBrickElems[i].addEventListener("dragleave", dragEndBrick);
        boardBrickElems[i].addEventListener("drop", dragEndBrick);
        boardBrickElems[i].setAttribute("id", "");
        boardBrickElems[i].src = "img/empty.png";
        boardBrickElems[i].className = boardBrickElems[i].className.substring(0, 6) + "empty";
    }


    // Lägger in referens till alla 40 bilder i initImgList
    for (i = 0; i < 40; i++) {
        initImgList[i] = "img/" + (i + 1) + ".png";
    }

    for (i = 0; i < markElems.length; i++) {
        markElems[i].innerHTML = "";
    }


}


function newBricks() {


// Går igenom alla new brick elements
//Ligger här för att sätta alla till dragable varje gång man får nya bricks
    for (let i = 0; i < newBrickImgElems.length; i++) {
        newBrickImgElems[i].setAttribute("draggable", true);
        newBrickImgElems[i].addEventListener("dragstart", dragStartBrick);
        newBrickImgElems[i].addEventListener("dragend", dragEndBrick);
    }


// väljer ut 4 slumpmässiga tal och lägger in i nya brickor elementen.
    for (let i = 0; i < 4; i++) {

        let r = Math.floor(Math.random() * initImgList.length);

        newBrickImgElems[i].src = initImgList[r];

        initImgList.splice(r, 1);

    }

//Should place out all new bricks first before generating new is ok
    newBricksButton.disabled = true;


}


