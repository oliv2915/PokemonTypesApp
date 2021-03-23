const pokemonTypesBaseURL = "https://pokeapi.co/api/v2/type/";
const pokemonBaseURL = "https://pokeapi.co/api/v2/pokemon/";


const pokemonListView = document.querySelector("#pokemon-list"); // allows access to the pokemonList on the html page
const pokemonDataView = document.querySelector("#pokemon-data");
pokemonDataView.style.display = "none";
pokemonListView.parentElement.style.display = "none"; // sets the pokemon list card-body element to hidden, this removes the ghost box seen if set to block

let currentlyActiveTypeLink; // used to keep track of which pokemen type was clicked in typeListLinkCicked()
let currentlyActivePokemonLink; // used to keep track of which pokemen type was clicked in currentlyActivePokemonLink()


function fetchPokemonTypes(url) {
    fetch(url) 
        .then(checkForOkResponse)
        .then(displayPokemonTypesList)
        .catch(console.error)
}

function fetchPokemonType(url) {
    fetch(url)
        .then(checkForOkResponse)
        .then(displayPokemonList)
        .catch(console.error)
}

function fetchPokemon(url) {
    fetch(url)
        .then(checkForOkResponse)
        .then(displayPokemonData)
        .catch(console.error)
}


function checkForOkResponse(response) { // Used to handle all errors from fetch requests
    if (!response.ok) { // if error is found
        return Promise.reject(response.status); // return a promise reject
    }
    return response.json(); // return our response, once it has been checked
}

function displayPokemonTypesList(typesList) { // loads pokemonTypes into the pokemoneTypesListView
    const pokemonTypesListView = document.querySelector("#type-list")
    let pokemonTypes = typesList.results; // array of pokemonTypes
    createListLinks(pokemonTypes, pokemonTypesListView, typeListLinkClicked); // call createListLinks passing in our list of pokemonTypes, where the list should show, and a click event handler
}

function displayPokemonList(pokemonData) { // load pokemon ino #pokemon-list
    // displays the #pokemon-list, this was disabled by default on line 6
    pokemonListView.parentElement.style.display = "block";
    /*
        pokemonData is an arry of objects. Our specific data is deeply nested. To access the name for one pokemon, we would need to use pokemonData.pokemon[0].pokemon
        We need to create our own array which will hold objs of pokemon. Addess one pokemon, we type pokemon.name
    */
    let pokemonArray = pokemonData.pokemon;
    let pokemon = [];

    // check to see if the pokemonArray is empty
    // here is where we process the data to be passed into the view
    if (pokemonArray != 0) {
        // forEach obj in the pokemonArray
        pokemonArray.forEach((obj) => {
            // push the obj found at key pokemon onto our own pokemon array
            pokemon.push(obj.pokemon);
        })
    } else {
        pokemonListView.parentElement.style.display = "none"; // hide the #pokemon-list element
    }
    
    

    // this while statement handles the possiblity for there to already be a list of pokemon in the list view
    // if there are any, remove them from the list
    while(pokemonListView.firstChild) { // while a list item is present
        pokemonListView.removeChild(pokemonListView.firstChild); // remove it
    }
    // add pokemon to the #pokemon-list and add click event
    createListLinks(pokemon, pokemonListView, pokemonListLinkClicked);
    
}

function displayPokemonData(pokemon) {
    // references to the pokemon data we need to display
    const name = pokemon.name
    const types = pokemon.types
    const stats = pokemon.stats;
    const abilities = pokemon.abilities;
    const moves = pokemon.moves;
    const image = pokemon.sprites.other["official-artwork"]["front_default"]

    // references to the view elements where the data needs to be displayed
    const pokemonNameElement = document.querySelector("#pokemon-name");
    const pokemonTypeElement = document.querySelector("#pokemon-type");
    const pokemonImageElement = document.querySelector("#pokemon-image");

    // sets the name and image
    pokemonImageElement.src = image;
    pokemonNameElement.innerText = name;
    pokemonNameElement.style.textTransform = "capitalize"
    
    displayStats(stats);

    
    // displayAbilities(abilities, abilitiesElem);
}

function displayAbilities(abilities, parentElement) {
    
}

function displayStats(pokemonStats) {
    pokemonDataView.style.display = "flex";
    // stats elements
    const hpElement = document.querySelector("#hp-stat");
    const attackElement = document.querySelector("#attack-stat");
    const defenseElement = document.querySelector("#defense-stat");
    const specialAttackElement = document.querySelector("#special-attack-stat");
    const specialDefenseElement = document.querySelector("#special-defense-stat");
    const speedElement = document.querySelector("#speed-stat");
    // placeholders to the data that we need to display
   
    let stats = [];
    // forEach stat, build our own object for that stat
    pokemonStats.forEach(stat => {
        stats.push({
            name: stat.stat.name,
            base_stat: stat.base_stat,
            effort: stat.effort,
            url: stat.stat.url
        })
    })
    
    stats.forEach((stat) => {
        switch (stat.name) {
            case "hp":
                hpElement.innerText = `HP: ${stat.base_stat}`;
                break;
            case "attack":
                attackElement.innerText = `ATK: ${stat.base_stat}`;
                break;
            case "defense":
                defenseElement.innerText = `DEF: ${stat.base_stat}`;
                break;
            case "special-attack":
                specialAttackElement.innerText = `SP-ATK: ${stat.base_stat}`;
                break;
            case "special-defense":
                specialDefenseElement.innerText = `SP-DEF: ${stat.base_stat}`;
                break;
            case "speed":
                speedElement.innerText = `SPD: ${stat.base_stat}`;
            default:
                break;
        }
    })
}

function createListLinks(list, parentElement, clickEventHandler) { // create anchor tags for the provided list, adds the anchor tag to the parentElement, and assigns an event listner to each anchor tag
    // console.log(list);
    list.forEach((item) => { // forEach item in the list
        let a = document.createElement("a"); // create an anchor tag
        a.setAttribute("class", "list-group-item list-group-item-action") // give it the class of nav-link
        a.innerText = item.name; // set the innerText to that of the item.name
        a.style.textTransform = "capitalize"; // capitalize the first letter of innerText
        parentElement.appendChild(a) // add the anchor tag to the parentElement that this list should be seen in

        if (clickEventHandler) { // check to see if a clickEventHandler has been provided
            a.addEventListener("click", clickEventHandler); // add an eventListenerHandler to handle click events
        }
    })
}


fetchPokemonTypes(pokemonTypesBaseURL);

/* 
    EVENT HANDLERS BELOW THIS AREA
*/

function typeListLinkClicked(event) {
    // event.target.innerHTML returns "normal" while innerText returns "Normal"
    let queryURL; // placeholder for our new url that we will create
    let newlyClickedLink = event.target; // provides a reference to the newlyClickedLink
    
    if (currentlyActiveTypeLink === undefined) { // check to see if undefined
        newlyClickedLink.setAttribute("class", "list-group-item list-group-item-action active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActiveTypeLink = newlyClickedLink; // sets the currentlyActiveTypeLink to be that of the newlyClickedClink
        queryURL = pokemonTypesBaseURL + newlyClickedLink.innerHTML; // add newlyClickedLink innerHTML to the queryURL
    } else if (currentlyActiveTypeLink !== newlyClickedLink) { // and if it does not match
        newlyClickedLink.setAttribute("class", "list-group-item list-group-item-action active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActiveTypeLink.setAttribute("class", "list-group-item list-group-item-action"); // removes  active class and keeps the nav-link class on the now old currentlyActiveTypeLink
        currentlyActiveTypeLink = newlyClickedLink; // sets the currentlyActiveTypeLink to be that of the newlyClickedClink
        queryURL = pokemonTypesBaseURL + newlyClickedLink.innerHTML;  // add newlyClickedLink innerHTML to the queryURL
    } else {
        queryURL = pokemonTypesBaseURL + newlyClickedLink.innerHTML; // same link clicked
        // console.log("same type link clicked");
    } // nothing else todo, we checked to make sure the currentlyActiveTypeLink is not falsey and we checked to make sure that currentlyActiveTypeLink and the newlyClickedLink do not match
    
    // fetchPokemon
    fetchPokemonType(queryURL);
}

function pokemonListLinkClicked(event) {
    // event.target.innerHTML returns "normal" while innerText returns "Normal"
    let queryURL; // placeholder for our new url that we will create
    let newlyClickedLink = event.target; // provides a reference to the newlyClickedLink
    
    if (currentlyActivePokemonLink === undefined) { // check to see if undefined
        // console.log("no current active links, set clicked link active");
        newlyClickedLink.setAttribute("class", "list-group-item list-group-item-action active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActivePokemonLink = newlyClickedLink; // define the currentlyActivePokemonLink to be that of the newlyClickedClink
        queryURL = pokemonBaseURL + newlyClickedLink.innerHTML; //
    } else if (currentlyActivePokemonLink !== newlyClickedLink) {
        // console.log("newly clicked link does not match current active link, set current active to new clicked link");
        newlyClickedLink.setAttribute("class", "list-group-item list-group-item-actionr active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActivePokemonLink.setAttribute("class", "list-group-item list-group-item-action"); // removes the active class and keeps the nav-link class on the now old currentlyActivePokemonLink
        currentlyActivePokemonLink = newlyClickedLink; // sets the newlyClickedLink as the currentlyActivePokemonLink
        queryURL = pokemonBaseURL + event.target.innerHTML;
    } else {
        queryURL = pokemonBaseURL + newlyClickedLink.innerHTML; // same link clicked
        // console.log("same type link clicked");
    } // nothing else todo, we checked to make sure the currentlyActivePokemonLink is not falsey and we checked to make sure that currentlyActivePokemonLink and the newlyClickedLink do not match
    
    fetchPokemon(queryURL)
}