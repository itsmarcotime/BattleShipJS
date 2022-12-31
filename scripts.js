var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var ships = [
    {
        locations: ["10", "20", "30"], 
        hits: ["", "", ""]
    },
    {
        locations: ["32", "33", "34"], 
        hits: ["", "", ""]
    },
    {
        locations: ["63", "64", "65"], 
        hits: ["", "", "hit"]
    }
];

var model = {
    //setting size of board
    boardSize: 7,
    //number of ships in the game
    numShips: 3,
    //how many spaces each ship will take up
    shipLength: 3,
    //keeps track of all ships sunk
    shipsSunk: 0,
    //hardcoding ships into place for now
    ships: [{ locations: [0,0,0], hits: ["", "", ""] },
            { locations: [0,0,0], hits: ["", "", ""] },
            { locations: [0,0,0], hits: ["", "", ""] }],
    //the fire method that determines if a guess is a hit or miss
    fire: function(guess) {
        //looping through all ships 
        for (let i = 0; i < this.numShips; i++) {
            //checking all ships
            var ship = this.ships[i];
            //accessing the set of ships locations
            //indexOf searches an array for a matching value and returns its index or -1
            var index = ship.locations.indexOf(guess);
            //so if we get an index greater than or equal to 0 we have a hit!
            if (index >= 0) {
                //mark the hits array at the same index
                ship.hits[index] = "hit";
                //notify the view we have a hit && ask view to display the HIT
                view.displayHit(guess);
                view.displayMessage("HIT!")
                //this is a check for sunken ships
                if (this.isSunk(ship)) {
                    //let the player know that this hit sank the battleship
                    view.displayMessage("You Sank My Battleship!");
                    //if ship is hit 3 times then increase number of sunken ships
                    this.shipsSunk++;
                }
                //return true because we have a hit
                return true;
            };
        }
        //notify the view that there was a miss && ask view to display a MISS
        view.displayMiss(guess);
        view.displayMessage("Miss!");
        //otherwise the guess was a miss so return false!
        return false;
    },
    //this will check if a ship has been sunk
    //this method takes a ship and checks all the ship's locations
    isSunk: function (ship) {
        for (var i = 0; i < this.numShips; i++) {
            //if theres a location that doesnt have a hit then the ship is still floating so return false!
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        //otherwise the ship is sunk so return true
            return true;
    },

    //adding method to generate random postions for the ships
    generateShipLocations: function() {
        var locations;
        //loop through each ship we want a position for
        for (var i = 0; i < this.numShips; i++) {
            //do-while loop executes a function first then executes the while loop
            do {
                locations = this.generateShip();
                //checking if any of the ships overlap
            } while (this.collision(locations));
            //once we have locations that work we assign them to the model.ships array.
            this.ships[i].locations = locations;
        }
    },

    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row;
        var col;
        if (direction === 1) {
            //location is horizantal
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
        } else {
            //location is vertical
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
            col = Math.floor(Math.random() * this.boardSize);
        };

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                //add location array for horizantal
                newShipLocations.push(row + "" + (col + i));
            } else {
                //add location array for vertical
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

//this is a helper function
function parseGuess(guess) {
    //an array loaded with each possible letter guess
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    //checking if guess is null or if it is not equal to two characters.
    if (guess == null || guess.length !== 2) {
        //if so send alert
        alert("Oops, please enter a letter and a number on the board!");
    } else {
        //grabbing first character of the guess
        var firstChar = guess.charAt(0);
        //using indexOf we get back a number between 0 & 6 that corresponds to a letter in the alphabet array
        var row = alphabet.indexOf(firstChar);
        //this will grab the second character in the guess which is a column
        var column = guess.charAt(1);

        //checking if row or column is not a number using NaN function
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isnt on the board.");

            //making sure values are between 0-6 and not past the board size
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops! thats off the board!");
        } else {
            //everything has been converted now return it.
            return row + column;
        }
    }
    //there was a fail somewhere and returned null.
    return null;
};

var controller = {
    guesses: 0,

    processGuess: function(guess) {
        //using parse guess to validate the guess
        var location = parseGuess(guess);

        //if we dont get null back we know we have a vaild answer (null is falsey)
        if (location) {
            //if player entered a valid guess increase guesses by 1
            this.guesses++;
            //then pass the row and colum to the models fire method.
            var hit = model.fire(location);

            //if the guess was a hit and the number of ship equals shipsSunk then show the player this message.
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses.");
            }
        }
    }
};

//adding this function so pressing enter is like clicking fire
//the browser passes an event object to the handler. This object has info on the key pressed
function handleKeyPress(e) {
    //getting a reference 
    var fireButton = document.getElementById("fireButton");
    //if you press ENTER the events keyCode is 13. So we want to watch for when keycode is 13
    if (e.keyCode === 13) {
        //when eneter is pressed we trick the computer to thinking fire was clicked
        fireButton.click();
        //and we return false so this function doesnt try to do anything else (like try to resubmit)
        return false;
    }
};

//we need somewhere for the handler stuff to go so create init function here
function init() {
    //here we get a reference to the fire button using its id
    var fireButton = document.getElementById("fireButton");
    //then we add the click handler function to the fire button
    fireButton.onclick = handleFireButton;

    //adding new handlers so pressing enter is like clicking fire
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    //a call to generate the ships locations
    model.generateShipLocations();
};

//this function will be called when you click the fire button
function handleFireButton() {
    //first get a reference from the guess from the form input using the forms id
    var guessInput = document.getElementById("guessInput");
    //assigning the input value to guess
    var guess = guessInput.value;
    //here we are passing the guess to the controller to take over
    controller.processGuess(guess);
    //this just resets the form to empty so player doesnt have to physically delete it
    guessInput.value = "";
};

//we want the browser to run init when the page is fully loaded
window.onload = init;