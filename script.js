const baseURL = "https://pokeapi.co/api/v2/type/"
const navbar = document.querySelector(".nav"); // allows access to the navbar on html page

let currentlyActiveLink;


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

function displayPokemonTypesList(results) {
    let pokemonTypes = results.results; // array of pokemonTypes

    pokemonTypes.forEach((type) => { // forEach pokemon type
        let a = document.createElement("a"); // create a anchor tag
        // set class attribute
        a.setAttribute("class", "nav-link")
        // define innerText
        a.innerText = type.name;
        // capitalize first letter of the innerText
        a.style.textTransform = "capitalize";
        // add the new anchor tag to the navbar
        navbar.appendChild(a);

        // add an event listener to the anchor tag
        a.addEventListener("click", typeListLinkClicked);
    })
}

// Event Listener Handlers
function typeListLinkClicked(event) {
    // event.target.innerHTML returns "normal" while innerText returns "Normal"
    let queryURL = baseURL + event.target.innerHTML; // add innerHTML to baseURL
    let newlyClickedLink = event.target; // provides a reference to the newlyClickedLink
    
    if (currentlyActiveLink === undefined) { // check to see if undefined
        console.log("no current active links, set clicked link active");
        currentlyActiveLink = newlyClickedLink;
    } else if (currentlyActiveLink !== newlyClickedLink) {
        console.log("newly clicked link does not match current active link, set current active to new clicked link");
        currentlyActiveLink = newlyClickedLink;
    } else {
        console.log("nothing todo here, same link clicked");
    }
    
    // fetch a new request to get the new data
    fetch(queryURL)
        .then(checkForOkResponse) // check to see if the response is ok
        .then(data => console.log("Type Link clicked",data)) // log the response data, if ok, to see how to handle processing further
        .catch(console.error) // console.error log any catch errors that may have been found
    // console.log(event);
}

fetchPokemonTypes(baseURL);

