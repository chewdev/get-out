document.addEventListener("DOMContentLoaded", function(e) {
  var game = {
    trap: [23, 39, 57],
    treasure: [7, 13, 28, 58],
    attainedPowerups: [],
    possiblePowerups: [
      "noVertMove",
      "noHorizMove",
      "move1Or2",
      "moveNegative",
      "doubleRoll"
    ],
    winningLoc: [7, 7],
    afterTrapLoc: [0, 0],
    usePowerups: [],
    currentLocation: [0, 0]
  };
  var gameBoard = [
    [0, 1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30, 31],
    [32, 33, 34, 35, 36, 37, 38, 39],
    [40, 41, 42, 43, 44, 45, 46, 47],
    [48, 49, 50, 51, 52, 53, 54, 55],
    [56, 57, 58, 59, 60, 61, 62, 63]
  ];
  var chip = document.createElement("div");
  chip.classList.add("chip");
  var squares = document.querySelectorAll(".board-square");
  squares[0].appendChild(chip);

  console.log(squares.length);

  var diceEls = document.querySelectorAll(".dice");

  function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }
  function rollBothDice() {
    var diceArr = [rollDice(), rollDice()];
    return diceArr;
  }
  function findNewLoc(change) {
    var current = game.currentLocation[0];
    var newLoc = current + change;
    if (newLoc > 7) {
      return newLoc - 7;
    }
    return newLoc;
  }
  function isTrapTreasure(loc) {
    return game.trap.includes(loc)
      ? "trap"
      : game.treasure.includes(loc)
        ? "treasure"
        : null;
  }
  function diceClicked() {
    var dice = rollBothDice();
    var [vert, horiz] = dice;
    diceEls[0].innerHTML = vert;
    diceEls[1].innerHTML = horiz;
    var newVert = findNewLoc(vert);
    var newHoriz = findNewLoc(horiz);
    var [currVert, currHoriz] = game.currentLocation;
    var locIndex = gameBoard[currVert][currHoriz];
    var currentSquare = squares[locIndex];
    var newLocIndex = gameBoard[newVert][newHoriz];
    var trapTreasure = isTrapTreasure(newLocIndex);
    var chipCopy = currentSquare.innerHTML;
    currentSquare.innerHTML = "";
    if (trapTreasure === "trap") {
      squares[0].innerHTML = chipCopy;
      game.currentLocation = [0, 0];
      return;
    }
    if (trapTreasure === "treasure") {
      game.attainedPowerups.push(
        game.possiblePowerups[
          Math.floor(Math.random() * game.possiblePowerups.length)
        ]
      );
      console.log(game.attainedPowerups);
    }
    squares[gameBoard[newVert][newHoriz]].innerHTML = chipCopy;
    game.currentLocation = [newVert, newHoriz];
  }

  var diceBtn = document.querySelector(".roll-dice");
  console.log(diceBtn);
  diceBtn.onclick = diceClicked;
});
