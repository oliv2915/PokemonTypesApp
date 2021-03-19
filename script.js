const pokemonTypeURL = "https://pokeapi.co/api/v2/type/";
const pokemonURL = "https://pokeapi.co/api/v2/pokemon/";

const pokemonTypesListView = document.querySelector("#type-list"); // allows access to the pokemonTypesList on the html page
const pokemonListView = document.querySelector("#pokemon-list"); // allows access to the pokemonList on the html page
// pokemonListView.style.display = "none";

let currentlyActiveTypeLink; // used to keep track of which pokemen type was clicked in typeListLinkCicked()
let currentlyActivePokemonLink; // used to keep track of which pokemen type was clicked in currentlyActivePokemonLink()


function fetchPokemonTypes(url) { // fecth pokemon types using a provided url
    fetch(url) // uses the provided url to submit a GET request
     .then(checkForOkResponse) // then we call anther function to check if the response was ok
     .then(displayPokemonTypesList) // if the response is ok, call displayResults
     .catch(console.error) // handles all errors that may have been found, in this case, use console.error
}


function checkForOkResponse(response) { // Used to handle all errors from fetch requests
    if (!response.ok) { // if error is found
        return Promise.reject(response.status); // return a promise reject
    }
    return response.json(); // return our response, once it has been checked
}

function displayPokemonTypesList(typesList) { // loads pokemonTypes into the pokemoneTypesListVie
    let pokemonTypes = typesList.results; // array of pokemonTypes
    createListLinks(pokemonTypes, pokemonTypesListView, typeListLinkClicked); // call createListLinks passing in our list of pokemonTypes, where the list should show, and a click event handler
}

function displayPokemonList(pokemonList) { // load pokemon ino the pokemonListView
    // When a pokemonType has been selected, we need to update the pokemonList to reflect this change
    while(pokemonListView.firstChild) {
        pokemonListView.removeChild(pokemonListView.firstChild);
    }
    let header = document.createElement("h6");
    header.innerText = "Pokemon";
    pokemonListView.appendChild(header);

    let pokemon = [];
    pokemonList.pokemon.forEach((pokeman) => {
        pokemon.push(pokeman.pokemon);
    })

    createListLinks(pokemon, pokemonListView, pokemonListLinkClicked);
    
}

function createListLinks(list, parentElement, clickEventHandler) { // create anchor tags for the provided list, adds the anchor tag to the parentElement, and assigns an event listner to each anchor tag
    // console.log(list);
    list.forEach((item) => { // forEach item in the list
        let a = document.createElement("a"); // create an anchor tag
        a.setAttribute("class", "nav-link") // give it the class of nav-link
        a.innerText = item.name; // set the innerText to that of the item.name
        a.style.textTransform = "capitalize"; // capitalize the first letter of innerText
        parentElement.appendChild(a) // add the anchor tag to the parentElement that this list should be seen in

        if (clickEventHandler) { // check to see if a clickEventHandler has been provided
            a.addEventListener("click", clickEventHandler); // add an eventListenerHandler to handle click events
        }
    })
}

// Event Listener Handlers
function typeListLinkClicked(event) {
    // event.target.innerHTML returns "normal" while innerText returns "Normal"
    let queryURL; // placeholder for our new url that we will create
    let newlyClickedLink = event.target; // provides a reference to the newlyClickedLink
    
    if (currentlyActiveTypeLink === undefined) { // check to see if undefined
        // console.log("no current active links, set clicked link active");
        newlyClickedLink.setAttribute("class", "nav-link active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActiveTypeLink = newlyClickedLink; // define the currentlyActiveTypeLink to be that of the newlyClickedClink
        queryURL = pokemonTypeURL + newlyClickedLink.innerHTML; //
    } else if (currentlyActiveTypeLink !== newlyClickedLink) {
        // console.log("newly clicked link does not match current active link, set current active to new clicked link");
        newlyClickedLink.setAttribute("class", "nav-link active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActiveTypeLink.setAttribute("class", "nav-link"); // removes the active class and keeps the nav-link class on the now old currentlyActiveTypeLink
        currentlyActiveTypeLink = newlyClickedLink; // sets the newlyClickedLink as the currentlyActiveTypeLink
        queryURL = pokemonTypeURL + event.target.innerHTML;
    } else {
        queryURL = pokemonTypeURL + newlyClickedLink.innerHTML; // same link clicked
        // console.log("same type link clicked");
    } // nothing else todo, we checked to make sure the currentlyActiveTypeLink is not falsey and we checked to make sure that currentlyActiveTypeLink and the newlyClickedLink do not match
    
    // fetch a new request to get the new data
    fetch(queryURL)
        .then(checkForOkResponse) // check to see if the response is ok
        .then(displayPokemonList) // TODO: log the response data, if ok, how to handle processing further
        .catch(console.error) // console.error log any catch errors that may have been found
    // console.log(event);
}

function pokemonListLinkClicked(event) {
    // event.target.innerHTML returns "normal" while innerText returns "Normal"
    let queryURL; // placeholder for our new url that we will create
    let newlyClickedLink = event.target; // provides a reference to the newlyClickedLink
    
    if (currentlyActivePokemonLink === undefined) { // check to see if undefined
        // console.log("no current active links, set clicked link active");
        newlyClickedLink.setAttribute("class", "nav-link active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActivePokemonLink = newlyClickedLink; // define the currentlyActivePokemonLink to be that of the newlyClickedClink
        queryURL = pokemonURL + newlyClickedLink.innerHTML; //
    } else if (currentlyActivePokemonLink !== newlyClickedLink) {
        // console.log("newly clicked link does not match current active link, set current active to new clicked link");
        newlyClickedLink.setAttribute("class", "nav-link active"); // add the active class and keep the nav-link class for the newlyClickedLink
        currentlyActivePokemonLink.setAttribute("class", "nav-link"); // removes the active class and keeps the nav-link class on the now old currentlyActivePokemonLink
        currentlyActivePokemonLink = newlyClickedLink; // sets the newlyClickedLink as the currentlyActivePokemonLink
        queryURL = pokemonURL + event.target.innerHTML;
    } else {
        queryURL = pokemonURL + newlyClickedLink.innerHTML; // same link clicked
        // console.log("same type link clicked");
    } // nothing else todo, we checked to make sure the currentlyActivePokemonLink is not falsey and we checked to make sure that currentlyActivePokemonLink and the newlyClickedLink do not match
    
    // fetch a new request to get the new data
    fetch(queryURL)
        .then(checkForOkResponse) // check to see if the response is ok
        .then(console.log) // TODO: log the response data, if ok, how to handle processing further
        .catch(console.error) // console.error log any catch errors that may have been found
    // console.log(event);
}

fetchPokemonTypes(pokemonTypeURL);
