const BASE_URL = "https://pokeapi.co/api/v2/";
let currentOffset = 0;
const LIMIT = 20;

async function onloadFunc() {
    let pokemonResponse = await loadData("pokemon?limit=40&offset=0")
    let pokemonList = pokemonResponse.results;  // das ist mein array
    pokemonList.forEach((pokemon) => {   // hier durch das array gehen
        console.log(pokemon.name);
    });

    loadPkmns();
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}

async function loadPkmns() {
    // showLoadingSpinner();

    let pokemonResponse = await loadData(`pokemon?limit=${LIMIT}&offset=${currentOffset}`);

    let pokemonDetails = [];
    for (let i = 0; i < pokemonResponse.results.length; i++) {
        let pokemon = pokemonResponse.results[i];

        let shortUrl = pokemon.url.replace('https://pokeapi.co/api/v2/', '');
        let details = await loadData(shortUrl);

        pokemonDetails.push(details);

    }

    console.log(pokemonDetails);

    // hideLoadingSpinner();
    renderPokemon(pokemonDetails);
    currentOffset += LIMIT;

}

function renderPokemon(pokemonList) {
    let mainContent = document.getElementById('main-content');

    pokemonList.forEach((pokemon) => {
        let imageUrl = pokemon.sprites.front_default;

        let typesHTML = '';
        pokemon.types.forEach((type) => {
            typesHTML += `<img src="assets/icons/${type.type.name}.svg"
                    alt="${type.type.name}"
                    class="type-icon"
                    title="${type.type.name}"></img>`;
        });

        mainContent.innerHTML += `
            <div class="pokemon-card">
            <div class="id-name"> <h3>#${pokemon.id} <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3></div>
            <div class="pokemon-img"><img class="pkm-img" src="${imageUrl}" alt="${pokemon.name}"></div>
            <div class="pokemon-types">${typesHTML}</div>
            </div>
        </div>
        `;
    });
}

