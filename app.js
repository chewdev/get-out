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
    this.powerupsToBeUsed = [];
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
      if (newLoc < 0) {
        return newLoc + 8;
      }
      return newLoc;
    };

    this.incRollCount = function() {
      this.rollCountEl.textContent = ++this.rollCount;
    };

    this.rollUpdateDice = function() {
      var vertChange = getDiceRoll();
      var horizChange = getDiceRoll();
      if (this.powerupsToBeUsed.length > 0) {
        this.powerupsToBeUsed.forEach(function(powerup) {
          switch (powerup) {
            case "No Vertical Movement":
              vertChange = 0;
              break;
            case "No Horizontal Movement":
              horizChange = 0;
              break;
            case "Roll Only 1's or 2's":
              vertChange = vertChange === 0 ? 0 : vertChange % 2 === 0 ? 1 : 2;
              horizChange =
                horizChange === 0 ? 0 : horizChange % 2 === 0 ? 1 : 2;
              break;
            case "Roll Only 5's or 6's":
              vertChange = vertChange === 0 ? 0 : vertChange % 2 === 0 ? 5 : 6;
              horizChange =
                horizChange === 0 ? 0 : horizChange % 2 === 0 ? 5 : 6;
              break;
            case "Move Up And Left":
              vertChange = -vertChange;
              horizChange = -horizChange;
              break;
            default:
              break;
          }
        });
        this.powerupsToBeUsed = [];
        this.updatePowerups();
      }
      this.diceEls[0].textContent = vertChange;
      this.diceEls[1].textContent = horizChange;
      this.currentVert = this.findNewLoc(vertChange, "vert");
      this.currentHoriz = this.findNewLoc(horizChange);
      return this.gameBoard[this.currentVert][this.currentHoriz];
    };

    this.clearChip = function() {
      this.chip = this.currentSquare.innerHTML;
      this.currentSquare.innerHTML = "";
    };

    this.gotTrapped = function() {
      this.clearChip();
      this.currentSquare = this.squares[0];
      this.currentSquare.innerHTML = this.chip;
      this.currentVert = 0;
      this.currentHoriz = 0;
    };

    this.usePowerup = function(ind) {
      var removedPowerup = this.attainedPowerups.splice(ind, 1);
      this.powerupsToBeUsed.push(removedPowerup[0]);
      console.log(this.attainedPowerups);
      console.log(this.powerupsToBeUsed);
      this.updatePowerups();
    };

    this.removePowerup = function(ind) {
      var powerupToRemove = this.powerupsToBeUsed.splice(ind, 1);
      this.attainedPowerups.push(powerupToRemove[0]);
      console.log(this.powerupsToBeUsed);
      this.updatePowerups();
    };

    this.updatePowerups = function() {
      var thisObj = this;
      var powerUpsListEl = this.powerUpsListEl;
      var powerUpsUsing = this.powerUpsUsing;
      powerUpsListEl.innerHTML = "";
      powerUpsUsing.innerHTML = "";
      if (this.powerupsToBeUsed.length > 0) {
        this.powerupsToBeUsed.forEach(function(powerup, ind) {
          var newLi = document.createElement("li");
          newLi.textContent = powerup;
          var removePowerup = function() {
            this.removePowerup(ind);
          };
          newLi.onclick = removePowerup.bind(thisObj);
          powerUpsUsing.appendChild(newLi);
        });
      }

      this.attainedPowerups.forEach(function(powerup, ind) {
        var newLi = document.createElement("li");
        newLi.textContent = powerup;
        var usePowerup = function() {
          this.usePowerup(ind);
        };
        newLi.onclick = usePowerup.bind(thisObj);
        powerUpsListEl.appendChild(newLi);
      });
    };

    this.gotTreasure = function() {
      this.attainedPowerups.push(
        this.possiblePowerups[
          Math.floor(Math.random() * this.possiblePowerups.length)
        ]
      );
      this.powerUpsListEl.innerHTML = "";
      var powerUpsListEl = this.powerUpsListEl;
      var thisObj = this;
      this.attainedPowerups.forEach(function(powerup, ind) {
        var newLi = document.createElement("li");
        newLi.textContent = powerup;
        var usePowerup = function() {
          this.usePowerup(ind);
        };
        newLi.onclick = usePowerup.bind(thisObj);
        powerUpsListEl.appendChild(newLi);
      });
    };

    this.rollDice = function() {
      this.incRollCount();
      var newLocEl = this.rollUpdateDice();
      if (
        this.currentVert === this.winningVert &&
        this.currentHoriz === this.winningHoriz
      ) {
        console.log("win");
        this.currentSquare.innerHTML = "";
        startNewGame();
        return;
      }

      var trapTreasure = this.isTrapTreasure(newLocEl);

      if (trapTreasure === "trap") {
        this.gotTrapped();
        return;
      }
      if (trapTreasure === "treasure") {
        this.gotTreasure();
      }
      var newBoardLoc = this.squares[newLocEl];
      this.clearChip();
      this.currentSquare = newBoardLoc;
      this.currentSquare.innerHTML = this.chip;
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
    game.powerUpsListEl = document.querySelector(".power-ups-list");
    game.powerUpsListEl.innerHTML = "";
    game.powerUpsUsing = document.querySelector(".power-ups-using");
    game.powerUpsUsing.innerHTML = "";
    game.chip = document.createElement("div");
    game.chip.classList.add("chip");
    game.squares = document.querySelectorAll(".board-square");
    game.currentSquare = game.squares[0];
    game.currentSquare.appendChild(game.chip);
    game.diceEls = document.querySelectorAll(".dice");
    game.rollCountEl = document.querySelector(".roll-count");
    diceBtn.onclick = game.rollDice.bind(game);
  }
});
