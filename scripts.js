// var randomLoc = Math.floor(Math.random() * 5);
// var location1 = randomLoc;
// var location2 = location1 + 1;
// var location3 = location2 + 1;
// var guess;
// var hits = 0;
// var guesses = 0;
// var isSunk = false;

// while (isSunk == false) {
//     guess = prompt("Ready, Aim, FIRE! (enter a number from 0-6) :");
//     if (guess < 0 || guess > 6) {
//         alert("Please enter a number between 1 and 6!");
//     } else {
//         guesses = guesses + 1;

//         if (guess == location1 || guess == location2 || guess == location3) {
//             alert("HIT!");
//             hits = hits + 1;
        
//             if (hits == 3) {
//                 isSunk = true;
//                 alert("You sank my battleship!");
//             };
//         } else {
//             alert("MISS!")
//         };
//     };
// };

// var stats = "You took " + guesses + " guesses to sink the battleship, " + "which means your shooting accuracy was " + (3/guesses);
// alert(stats);

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
    ships: [{ locations: ["06", "16", "26"], hits: ["", "", ""] },
            { locations: ["24", "34", "44"], hits: ["", "", ""] },
            { locations: ["10", "11", "12"], hits: ["", "", ""] }],
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
}