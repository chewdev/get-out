document.addEventListener("DOMContentLoaded", function(e) {
  function Game() {
    this.trap = [23, 39, 57];
    this.treasure = [7, 13, 28, 58];
    this.attainedPowerups = [];
    this.possiblePowerups = [
      "No Vertical Movement",
      "No Horizontal Movement",
      "Roll Only 1's or 2's",
      "Roll Only 5's or 6's",
      "Move Up And Left"
    ];
    this.usePowerups = [];
    this.powerUpsListEl = document.querySelector(".power-ups-list");
    this.winningVert = 7;
    this.winningHoriz = 7;
    this.currentVert = 0;
    this.currentHoriz = 0;
    this.rollCount = 0;
    this.gameBoard = [
      [0, 1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29, 30, 31],
      [32, 33, 34, 35, 36, 37, 38, 39],
      [40, 41, 42, 43, 44, 45, 46, 47],
      [48, 49, 50, 51, 52, 53, 54, 55],
      [56, 57, 58, 59, 60, 61, 62, 63]
    ];
    this.chip = document.createElement("div");
    this.chip.classList.add("chip");
    this.squares = document.querySelectorAll(".board-square");
    this.currentSquare = this.squares[0];
    this.currentSquare.appendChild(this.chip);
    this.diceEls = document.querySelectorAll(".dice");
    this.rollCountEl = document.querySelector(".roll-count");

    this.isTrapTreasure = function(loc) {
      var type = this.trap.includes(loc)
        ? "trap"
        : this.treasure.includes(loc)
          ? "treasure"
          : null;
      return type;
    };
    this.findNewLoc = function(change, direction) {
      var current = direction === "vert" ? this.currentVert : this.currentHoriz;
      var newLoc = current + change;
      if (newLoc > 7) {
        return newLoc - 8;
      }
      return newLoc;
    };
    this.incRollCount = function() {
      this.rollCountEl.textContent = ++this.rollCount;
    };
    this.rollDice = function() {
      this.incRollCount();
      var [vertChange, horizChange] = getBothDiceRolls();
      this.diceEls[0].innerHTML = vertChange;
      this.diceEls[1].innerHTML = horizChange;
      var newVert = this.findNewLoc(vertChange, "vert");
      var newHoriz = this.findNewLoc(horizChange);
      if (newVert === this.winningVert && newHoriz === this.winningHoriz) {
        console.log("win");
        this.currentSquare.innerHTML = "";
        startNewGame();
        return;
      }
      var newLocEl = this.gameBoard[newVert][newHoriz];
      var chipCopy = this.currentSquare.innerHTML;
      this.currentSquare.innerHTML = "";
      var trapTreasure = this.isTrapTreasure(newLocEl);
      this.powerUpsListEl.innerHTML = "";
      var powerUpsListEl = this.powerUpsListEl;

      if (trapTreasure === "trap") {
        this.currentSquare = this.squares[0];
        this.currentSquare.innerHTML = chipCopy;
        this.currentVert = 0;
        this.currentHoriz = 0;

        this.attainedPowerups.forEach(function(powerup) {
          var newLi = document.createElement("li");
          newLi.textContent = powerup;
          powerUpsListEl.appendChild(newLi);
        });
        return;
      }
      if (trapTreasure === "treasure") {
        this.attainedPowerups.push(
          this.possiblePowerups[
            Math.floor(Math.random() * this.possiblePowerups.length)
          ]
        );
        console.log(this.attainedPowerups);
      }
      var newBoardLoc = this.squares[this.gameBoard[newVert][newHoriz]];
      this.currentSquare = newBoardLoc;
      this.currentSquare.innerHTML = chipCopy;
      this.currentVert = newVert;
      this.currentHoriz = newHoriz;
      this.attainedPowerups.forEach(function(powerup) {
        var newLi = document.createElement("li");
        newLi.textContent = powerup;
        powerUpsListEl.appendChild(newLi);
      });
    };
  }

  var diceBtn = document.querySelector(".roll-dice");
  var game;
  startNewGame();

  function getDiceRoll() {
    return Math.floor(Math.random() * 6) + 1;
  }
  function getBothDiceRolls() {
    var diceArr = [getDiceRoll(), getDiceRoll()];
    return diceArr;
  }
  function startNewGame() {
    game = new Game();
    diceBtn.onclick = game.rollDice.bind(game);
  }
});
