
// Объект представления

var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea"); // Вывод сообщения
		messageArea.innerHTML = msg;
	},

	displayHit: function(location){
		var cell = document.getElementById(location); // Попал
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location){
		var cell = document.getElementById(location); // Помах
		cell.setAttribute("class", "miss");
	}
};

// Объект модели игры

var model = {
	boardSize: 7,      // Размер поля
	numShips: 3,			 // Количество кораблей
	shipLength: 3,		 // Длина корабля
	shipsSunk: 0,			 // Потоплено кораблей

	ships: [              
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },   
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],                 

	fire: function(guess) { // Стрельбы

		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				
				if (this.isSunk(ship)) {
					view.displayMessage("You sunk my ship!");
					this.shipsSunk++;
				}
				return true; 
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if(ship.hits[i] !== "hit") {
				return false;
			}
		}
		  return true;
	},

	generateShip: function(){
		var direction = Math.floor(Math.random()*2);
		var row, col;

		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1){
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++){
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0){
					return true;
				}
			}
		}
		return false;
	},

	generateShipLocations: function(){
		var locations;
		for (var i = 0; i < this.numShips; i++){
			do{
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	}
};



var controller = {
	guesses: 0,

	processGuess: function(guess){
		var location = parseGuess(guess);
		
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " +
					this.guesses + " guesses");
			}
		}
	}		
};


// Функция проверки корректности введенных данных и преобразования строки в число

function parseGuess(guess){
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

		if (guess === null || guess.length !==2) {
			alert("Oops, please enter a letter and a number on the board.");

		} else {
				firstChar = guess.charAt(0);
				var row = alphabet.indexOf(firstChar);
				var column = guess.charAt(1);		

				if (isNaN(row) || isNaN(column)) {
					alert("Oops. it's not on the board!");

				} else if (row < 0 || row >= model.boardSize ||
									 column < 0 || column >= model.boardSize) {
						alert("Oops, that's off the board!");

				} else {
						return row + column;
				}
		}
		return null;
	}

// Обработчик событий


function handleFireButton(){
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
}

function handleKeyPress(e){
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

window.onload = init;

function init(){
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}

