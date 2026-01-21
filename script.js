const BASE_URL = "https://pokeapi.co/api/v2/";

async function onloadFunc() {
    let pokemonResponse = await loadData("pokemon?limit=10&offset=0")
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