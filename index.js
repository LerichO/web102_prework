/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

var i = 0;


// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    const gamesContainer = document.querySelector('#games-container');
    let gamesListDiv = ``
    i=0;
    for(let game of games){
        // create a new div element, which will become the game card
        let gamesDiv = document.createElement('div');

        // add the class game-card to the list
        gamesDiv.classList.add('game-card');

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gamesDiv.innerHTML = 
            `<h2 id="game-title-${i}">${game["name"]}</h2>
            <img src=${game["img"]} class='game-img' />
            <p>${game["description"]}</p>
            <p id="total-pledged-${i}"><b>Pledged:</b> \$${game["pledged"]}</p>
            <p><b>Goal:</b> \$${game["goal"]}</p>
            <p id="total-backers-${i}"><b>Backers:</b> ${game["backers"]}</p>
            <div id="pledge-div-${i}">
                <button class="pledge-button" id="pledge-btn-${i}">Pledge</button>
            </div>
            `;

        // append the game to the games-container
        gamesContainer.appendChild(gamesDiv)

        i++;
    }

    //for loop to add event listener to each pledge button
    for (let j = 0; j < i; j++){
        (function (index) {
            document.getElementById(`pledge-btn-${index}`).addEventListener("click", function () {
                makePledge(index);
            });
        })(j)
    }

}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON)


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
let numberOfContributions = GAMES_JSON.reduce( (count, game) => {
    return count + parseInt(game["backers"]);
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${numberOfContributions.toLocaleString('en-US')}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
let totalRaised = GAMES_JSON.reduce( (count, game) => {
    return count + parseInt(game["pledged"]);
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `\$${totalRaised.toLocaleString('en-US')}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `${GAMES_JSON.length}`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter((game) => game.pledged < game.goal);
    console.log("unfunded: " + unfundedGames.length)

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter((game) => game.pledged >= game.goal);
    console.log("funded: " + fundedGames.length)

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter((game) => game.pledged > game.goal).length;

// create a string that explains the number of unfunded games using the ternary operator
const unfundedString = `A total of $${totalRaised.toLocaleString()} has been raised for
${gamesCard.innerHTML.toLocaleString()} games. Currently, ${unfundedGames.toLocaleString() === 1 ? 'there is 1 game that remains' : `there are ${unfundedGames.toLocaleString()} games that remain`} unfunded.
We need your help to fund these amazing games!`

// create a new DOM element containing the template string and append it to the description container
const descriptionElement = document.createElement('p');
descriptionElement.textContent = unfundedString;
descriptionContainer.appendChild(descriptionElement);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame] = sortedGames; 

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topGameName = document.createElement("p");
topGameName.innerHTML = firstGame.name;
firstGameContainer.appendChild(topGameName);

// do the same for the runner up item
const runnerUpGameName = document.createElement("p");
runnerUpGameName.innerHTML = secondGame.name;
secondGameContainer.appendChild(runnerUpGameName);

/************************************************************************************
 * Extra additions after challenge 7
 * Adding feature to make pledge to games - not a permanent change but still interesting change
 */

function makePledge(idNum){

    document.getElementById(`pledge-div-${idNum}`).innerHTML = `
    <form class="pledge-form">
    <label for="plede-amount">Pledge Amount:</label>
    <input type="number" id="pledge-amount" name="pledgeAmount"><br><br>
    <input type="submit" value="Submit">
    </form>
    `;

    //Upon submitting, the appropriate data will be updated in the card although the actual data in games.js will not
    document.querySelector(`#pledge-div-${idNum} .pledge-form`).addEventListener('submit', function(event) {
    
        const formData = new FormData(this); // 'this' refers to the form element
    
        const pledgedAmount = formData.get('pledgeAmount'); // Access the value by the input's name attribute
        console.log("Pledged Amount:", pledgedAmount);
        if(pledgedAmount > 0){
            deleteChildElements(document.getElementById(`pledge-div-${idNum}`));
        }

        //update pledge and backer count
        const thisGame = GAMES_JSON.find((game) => game.name == document.getElementById(`game-title-${idNum}`).innerHTML.toString())
        thisGame.pledged = parseInt(thisGame.pledged) + parseInt(pledgedAmount);
        thisGame.backers = parseInt(thisGame.backers) + 1;

        //update html template with appropriate amounts
        document.getElementById(`game-title-${idNum}`).parentElement.innerHTML =
        `<h2 id="game-title-${idNum}">${thisGame.name}</h2>
        <img src=${thisGame.img} class='game-img' />
        <p>${thisGame.description}</p>
        <p id="total-pledged-${idNum}"><b>Pledged:</b> \$${thisGame.pledged}</p>
        <p><b>Goal:</b> \$${thisGame.goal}</p>
        <p id="total-backers-${idNum}"><b>Backers:</b> ${thisGame.backers}</p>
        <div id="pledge-div-${i}">
            <p>Thank you for making a pledge!</p>
        </div>`;
    });
    
}
