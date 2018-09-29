document.addEventListener("DOMContentLoaded", function(e) {
  function Player() {
    this.bestScore = null;
  }
  function Game(player) {
    this.trap = [23, 39, 57, 60];
    this.treasure = [
      5,
      7,
      11,
      13,
      18,
      22,
      25,
      28,
      30,
      33,
      34,
      35,
      36,
      40,
      42,
      45,
      49,
      51,
      54,
      58,
      61,
      62
    ];
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
    this.player = player;
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
              var vertSign = Math.sign(vertChange);
              var horizSign = Math.sign(horizChange);
              vertChange =
                vertChange === 0
                  ? 0
                  : vertChange % 2 === 0
                    ? 1 * vertSign
                    : 2 * vertSign;
              horizChange =
                horizChange === 0
                  ? 0
                  : horizChange % 2 === 0
                    ? 1 * horizSign
                    : 2 * horizSign;
              break;
            case "Roll Only 5's or 6's":
              var vertSign = Math.sign(vertChange);
              var horizSign = Math.sign(horizChange);
              vertChange =
                vertChange === 0
                  ? 0
                  : vertChange % 2 === 0
                    ? 5 * vertSign
                    : 6 * vertSign;
              horizChange =
                horizChange === 0
                  ? 0
                  : horizChange % 2 === 0
                    ? 5 * horizSign
                    : 6 * horizSign;
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
      this.notificationEl.innerHTML =
        "You got trapped! Back to the beginning with you!";
      this.currentSquare = this.squares[0];
      this.currentSquare.innerHTML = this.chip;
      this.currentVert = 0;
      this.currentHoriz = 0;
    };

    this.usePowerup = function(ind) {
      if (this.powerupsToBeUsed.length > 0) {
        var powerUpToRemove = this.attainedPowerups.slice(ind, ind + 1)[0];
        if (
          this.powerupsToBeUsed.includes(powerUpToRemove) ||
          (this.powerupsToBeUsed.includes("Roll Only 1's or 2's") &&
            powerUpToRemove === "Roll Only 5's or 6's") ||
          (this.powerupsToBeUsed.includes("Roll Only 5's or 6's") &&
            powerUpToRemove === "Roll Only 1's or 2's") ||
          (this.powerupsToBeUsed.includes("No Vertical Movement") &&
            powerUpToRemove === "No Horizontal Movement") ||
          (this.powerupsToBeUsed.includes("No Horizontal Movement") &&
            powerUpToRemove === "No Vertical Movement")
        ) {
          return;
        }
      }
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
      var newPowerup = this.possiblePowerups[
        Math.floor(Math.random() * this.possiblePowerups.length)
      ];
      this.attainedPowerups.push(newPowerup);
      this.notificationEl.innerHTML =
        "You receieved a new power-up: " + newPowerup;
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

    this.updateScore = function() {
      this.scoreEl.innerHTML = this.player.bestScore;
      this.rollCountEl.innerHTML = 0;
    };

    this.rollDice = function() {
      this.notificationEl.innerHTML = "";
      this.incRollCount();
      var newLocEl = this.rollUpdateDice();
      if (
        this.currentVert === this.winningVert &&
        this.currentHoriz === this.winningHoriz
      ) {
        this.notificationEl.innerHTML =
          "You reached the finish! It took " + this.rollCount + " rolls.";
        this.currentSquare.innerHTML = "";
        if (!this.player.bestScore) {
          this.player.bestScore = this.rollCount;
        } else if (this.player.bestScore > this.rollCount) {
          this.player.bestScore = this.rollCount;
        }
        this.updateScore();
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
  var newGameBtn = document.querySelector(".start-new");
  newGameBtn.onclick = startNewGame;
  var game;
  var player = new Player();
  startNewGame();

  function getDiceRoll() {
    return Math.floor(Math.random() * 6) + 1;
  }
  function getBothDiceRolls() {
    var diceArr = [getDiceRoll(), getDiceRoll()];
    return diceArr;
  }

  function startNewGame() {
    game = new Game(player);
    game.powerUpsListEl = document.querySelector(".power-ups-list");
    game.powerUpsListEl.innerHTML = "";
    game.powerUpsUsing = document.querySelector(".power-ups-using");
    game.powerUpsUsing.innerHTML = "";
    game.chip = document.createElement("div");
    game.chip.classList.add("chip");
    game.squares = document.querySelectorAll(".board-square");
    game.squares.forEach(function(square) {
      square.innerHTML = "";
    });
    game.currentSquare = game.squares[0];
    game.currentSquare.appendChild(game.chip);
    game.diceEls = document.querySelectorAll(".dice");
    game.rollCountEl = document.querySelector(".roll-count");
    game.scoreEl = document.querySelector(".best-score");
    game.notificationEl = document.querySelector(".game-notification");
    diceBtn.onclick = game.rollDice.bind(game);
    game.updateScore();
  }
});
