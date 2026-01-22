const BASE_URL = "https://pokeapi.co/api/v2/";
let currentOffset = 0;
const LIMIT = 20;

async function onloadFunc() {
    let pokemonResponse = await loadData("pokemon?limit=40&offset=0")
    let pokemonList = pokemonResponse.results;
    console.log(pokemonResponse);
    console.log(pokemonResponse.results);

    pokemonList.forEach((pokemon) => {
        console.log(pokemon.name);
    });
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}

async function loadPkmns() {
    showLoadingSpinner();

    let pokemonResponse = await loadData(`pokemon?limit=${LIMIT}&offset=${currentOffset}`);
    renderPokemon(pokemonResponse.results);

    currentOffset += LIMIT;

    hideLoadingSpinner();
}

function renderPokemon() {
    
}

function getPokemonTemplate() {

}

