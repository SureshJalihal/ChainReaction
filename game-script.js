"use strict";
var FIRST_ROW = 0, LAST_ROW = 8, FIRST_COL = 0, LAST_COL = 5;
var MOVE_LEFT = "-52px", MOVE_RIGHT = "52px", MOVE_UP = "-52px", MOVE_DOWN = "52px";
var TOTAL_COL = 8, TOTAL_ROW = 10;
var UP = 1, DOWN = 4, LEFT = 2, RIGHT = 8;
var curPlayer = 0;
var totalNumberOfPlayer = 2;
var colorAllowed = ["green", "red"];
var curMovingImages = [];
var intervalID = [];
var moving = false;
var TIMETOMOVE = 15;
var userClick = 0;
function Reboot() {
    document.getElementById("ID_gameBoard").innerHTML = "";
    userClick = 0;
    curPlayer = 0;
    gameBoard();
    gameRestart();
 }

function div() {
    var elem = document.createElement("DIV");
    elem.userID = -1;
    elem.mass = 0;
    elem.criticalMass = 0;
    elem.validDirection = 0;
    return elem;

}
function image(imageSrc) {
    var image = document.createElement("IMG");
    image.steps = 0;
    image.direction;
    image.setAttribute("src", imageSrc)
    return image;
}
function getCurClick() {
    var curClick;
    if (event.target.tagName == "IMG") {
        curClick = event.target.parentNode;
    } else {
        curClick = event.target;
    }
    return curClick;
}
function gameBoard() {
    var cell;
    var loadChecks = "";
    for (var row = 0; row < TOTAL_ROW; row++) {
        for (var col = 0; col < TOTAL_COL; col++) {
            cell = div();

            if (row != FIRST_COL) {
                cell.criticalMass++;
                cell.validDirection |= UP;
            }
            if (col != FIRST_ROW) {
                cell.criticalMass++;
                cell.validDirection |= LEFT;
            }
            if (row != LAST_ROW) {
                cell.criticalMass++;
                cell.validDirection |= DOWN;
            }
            if (col != LAST_COL) {
                cell.criticalMass++;
                cell.validDirection |= RIGHT;
            }
            if (col == 0) {
                cell.classList.add("clearLeft");
            }
            document.getElementById("ID_gameBoard").appendChild(cell);
        }
    }
}
function InsertGif(event) {
  
    var curClick = getCurClick();
    var ok;
    userClick++;
    if (curClick.userID == -1 || curClick.userID == curPlayer) {
        addMassToinTheCell(curClick);


        if (!moving) {

            curPlayer++;

            if (userClick > 1) {
                determineWinner(curClick);
            }
            if (curPlayer == totalNumberOfPlayer) {
                curPlayer = 0;
            }

            //To Change the grid color
            var grid = document.querySelectorAll(".gameBoard>div");
            for (var i = 0; i < grid.length; i++) {
                grid[i].style.borderColor = colorAllowed[curPlayer];
            }
        }

    }
}

function addMassToinTheCell(curClick) {
    var imageSrc;
    // var image;
    var curCell;
    var curMovingImageIndex = 0;
    curClick.userID = curPlayer;
    curClick.mass++;
    imageSrc = "Gif/Obj-" + curClick.userID + "-" + curClick.mass + ".gif";
    if (curClick.mass == 1) {
        curClick.appendChild(image(imageSrc));
    }
    else if (curClick.mass == curClick.criticalMass) {
        
        curClick.removeChild(curClick.childNodes[0]);
        imageSrc = "Gif/Obj-" + curPlayer + "-1.gif";

        //Creates Four new Images 
        for (var i = 0; i < curClick.criticalMass; i++) {
            curClick.appendChild(image(imageSrc));
          
        }

        curMovingImages.push(curClick);
        while (curMovingImages.length != 0) {
            moving = true;
            curCell = curMovingImages.shift();
            intervalID[getCurElementNumber(curClick)] = setInterval(function () { moveTheMass(curCell) }, TIMETOMOVE);
        }
        curClick.mass = 0;
    }
    else {
        curClick.childNodes[0].setAttribute("src", imageSrc);
    }
}


function moveTheMass(curClick) {
    var i = 0;
    if (curClick.children[0].steps > 54) {
        resetCurrentCell(curClick);
    
        if ((curClick.validDirection & UP) == UP) {
            
            addMassToinTheCell(curClick.parentNode.childNodes[getCurElementNumber(curClick) - TOTAL_COL]);
        }
        if ((curClick.validDirection & LEFT) == LEFT) {
            addMassToinTheCell(curClick.parentNode.childNodes[getCurElementNumber(curClick) - 1]);
        }
        if ((curClick.validDirection & DOWN) == DOWN) {
            addMassToinTheCell(curClick.parentNode.childNodes[getCurElementNumber(curClick) + TOTAL_COL]);
        }
        if ((curClick.validDirection & RIGHT) == RIGHT) {
            addMassToinTheCell(curClick.parentNode.childNodes[getCurElementNumber(curClick) + 1])
        }
        setTimeout(changeGrid, 100);
        
        function changeGrid() {

            if (!moving) {

                determineWinner(curClick);
                curPlayer++;
                if (curPlayer == totalNumberOfPlayer) {
                    curPlayer = 0;
                }
                var grid = document.querySelectorAll(".gameBoard>div");
                for (var i = 0; i < grid.length; i++) {
                    grid[i].style.borderColor = colorAllowed[curPlayer];
                }
            }
        }

    } else {
        if ((curClick.validDirection & UP) == UP) {
            curClick.children[i].style.top = -(curClick.children[i].steps += 2) + "px";
            i++;
        }
        if ((curClick.validDirection & LEFT) == LEFT) {
            curClick.children[i].style.left = -(curClick.children[i].steps += 2) + "px";
            i++;
        }
        if ((curClick.validDirection & DOWN) == DOWN) {
            curClick.children[i].style.top = (curClick.children[i].steps += 2) + "px";
            i++;
        }
        if ((curClick.validDirection & RIGHT) == RIGHT) {
            curClick.children[i].style.left = (curClick.children[i].steps += 2) + "px";
            i++;
        }
    }

}
function determineWinner(curClick) {
    var childCollection = curClick.parentNode.children;
    var prevCell = childCollection[0].userID;
    var flag;
    var count;
    for (var i = 1; i < childCollection.length; i++) {
        if (childCollection[i].userID != -1) {
            if (prevCell == -1) {
                prevCell = childCollection[i].userID;
            } else if ((prevCell != childCollection[i].userID)) {
                flag = -1;
                break;
            }
        }
    }
    if ((flag != -1)) {
        gameOver();
    }


}
function getCurElementNumber(curClick) {
    var childCollection = curClick.parentNode.children;
    for (var i = 0; i < childCollection.length; i++) {
        if (childCollection[i] == curClick) {
            return i;
        }
    }
}
function resetCurrentCell(curClick) {
    var child;
    for (var i = 0; i < curClick.criticalMass; i++) {
        curClick.removeChild(curClick.children[0]);
    }
    moving = false;
    curClick.userID = -1;
    clearInterval(intervalID[getCurElementNumber(curClick)]);
}

function gameOver() {
    document.getElementById("colorAllowed").innerHTML = curPlayer + 1;
    document.getElementById("playerStats").style.color = colorAllowed[curPlayer];
    document.getElementById("ID_gameBoard").style.display = "none";
    document.getElementById("gameOverID").style.display = "block";


}

function gameRestart() {


    document.getElementById("ID_gameBoard").style.display = "table";
    document.getElementById("gameOverID").style.display = "none";

}