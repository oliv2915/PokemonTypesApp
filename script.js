const pokemonTypesBaseURL = "https://pokeapi.co/api/v2/type/";
const pokemonBaseURL = "https://pokeapi.co/api/v2/pokemon/";

const pokemonTypesListView = document.querySelector("#type-list"); // allows access to the pokemonTypesList on the html page
const pokemonListView = document.querySelector("#pokemon-list"); // allows access to the pokemonList on the html page
const pokemonDataSection = document.querySelector("#pokemon-data");

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
    let pokemonTypes = typesList.results; // array of pokemonTypes
    let header = document.createElement("h4"); // create h6 element
    header.setAttribute("class", "h4 text-center") // add class of h6
    header.innerText = "Types of"; // add some text
    pokemonTypesListView.appendChild(header); // add to the list view
    createListLinks(pokemonTypes, pokemonTypesListView, typeListLinkClicked); // call createListLinks passing in our list of pokemonTypes, where the list should show, and a click event handler
}

function displayPokemonList(pokemonList) { // load pokemon ino the pokemonListView
    // this while statement handles the possiblity for there to already be a list of pokemon in the list view
    // if there are any, remove them from the list
    // end result is that the list view will be empty
    while(pokemonListView.firstChild) { // while a list item is present
        pokemonListView.removeChild(pokemonListView.firstChild); // remove it
    }

    // here is where we start to create a new list view
    let header = document.createElement("h4"); // we need a header
    header.setAttribute("class", "h4 text-center") // add class of h6
    header.innerText = "Pokemon"; // add some text to it
    pokemonListView.appendChild(header); // and add it to the top of the list view

    /*
        Inside our pokemonList object is key of pokemon which holds an array of pokemon with keys of pokemon. It is deeply nested.
        This means to get the name of the first pokeman, we will need to use pokemonList.pokemon[0].pokemon.name
    */
    let pokemon = []; // place holder array for our pokemon
    /*
        
    */
    pokemonList.pokemon.forEach((pokeman) => {
        pokemon.push(pokeman.pokemon);
    })

    createListLinks(pokemon, pokemonListView, pokemonListLinkClicked);
    
}

function displayPokemonData(pokemon) {
    // references to the pokemon data we need to display
    let name = pokemon.name
    let stats = pokemon.stats;
    let abilities = pokemon.abilities;
    let moves = pokemon.moves;
    let image = pokemon.sprites.other["official-artwork"]["front_default"]

    // references to the view elements where the data needs to be displayed
    let imgElem = pokemonDataSection.querySelector("#pokemon-image");
    let nameElem = pokemonDataSection.querySelector("#pokemon-name");
    let statsElem = pokemonDataSection.querySelector("#pokemon-stats");
    let abilitiesElem = pokemonDataSection.querySelector("#pokemon-abilities");
    let movesElem = pokemonDataSection.querySelector("#pokemon-moves");

    imgElem.src = image;
    nameElem.innerText = name;
    nameElem.style.textTransform = "capitalize"
    
    //TODO: Still need to define
    //    stats => statsElem
    //    abilities => abilitiesElem

    // will clear the view of any previously loaded pokemon data
    // while(pokemonDataSection.firstChild) {
    //     pokemonDataSection.removeChild(pokemonDataSection.firstChild);
    // }
}

function createListLinks(list, parentElement, clickEventHandler) { // create anchor tags for the provided list, adds the anchor tag to the parentElement, and assigns an event listner to each anchor tag
    // console.log(list);
    list.forEach((item) => { // forEach item in the list
        let a = document.createElement("a"); // create an anchor tag
        a.setAttribute("class", "nav-link text-center") // give it the class of nav-link
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
        newlyClickedLink.setAttribute("class", "nav-link text-center active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActiveTypeLink = newlyClickedLink; // sets the currentlyActiveTypeLink to be that of the newlyClickedClink
        queryURL = pokemonTypesBaseURL + newlyClickedLink.innerHTML; // add newlyClickedLink innerHTML to the queryURL
    } else if (currentlyActiveTypeLink !== newlyClickedLink) { // and if it does not match
        newlyClickedLink.setAttribute("class", "nav-link text-center active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActiveTypeLink.setAttribute("class", "nav-link text-center"); // removes  active class and keeps the nav-link class on the now old currentlyActiveTypeLink
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
        newlyClickedLink.setAttribute("class", "nav-link text-center active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActivePokemonLink = newlyClickedLink; // define the currentlyActivePokemonLink to be that of the newlyClickedClink
        queryURL = pokemonBaseURL + newlyClickedLink.innerHTML; //
    } else if (currentlyActivePokemonLink !== newlyClickedLink) {
        // console.log("newly clicked link does not match current active link, set current active to new clicked link");
        newlyClickedLink.setAttribute("class", "nav-link text-center active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActivePokemonLink.setAttribute("class", "nav-link text-center"); // removes the active class and keeps the nav-link class on the now old currentlyActivePokemonLink
        currentlyActivePokemonLink = newlyClickedLink; // sets the newlyClickedLink as the currentlyActivePokemonLink
        queryURL = pokemonBaseURL + event.target.innerHTML;
    } else {
        queryURL = pokemonBaseURL + newlyClickedLink.innerHTML; // same link clicked
        // console.log("same type link clicked");
    } // nothing else todo, we checked to make sure the currentlyActivePokemonLink is not falsey and we checked to make sure that currentlyActivePokemonLink and the newlyClickedLink do not match
    
    fetchPokemon(queryURL)
}