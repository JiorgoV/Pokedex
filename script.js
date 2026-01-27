const BASE_URL = "https://pokeapi.co/api/v2/";
let currentOffset = 0;
const LIMIT = 20;
let allPokemonData = [];

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

        allPokemonData = allPokemonData.concat(pokemonDetails);

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
        let gifUrl = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default;

        if (!gifUrl) {
            gifUrl = pokemon.sprites.front_default;
        }
        let primaryType = pokemon.types[0].type.name;

        let typesHTML = '';
        pokemon.types.forEach((type) => {
            typesHTML += `<img src="assets/icons/${type.type.name}.svg"
                    alt="${type.type.name}"
                    class="type-icon"
                    title="${type.type.name}"></img>`;
        });

        mainContent.innerHTML += `
            <div class="pokemon-card" onclick="openDialog(${pokemon.id})">  
            <div class="id-name"> <h3>#${pokemon.id} <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3></div>
            <div class="pokemon-img ${primaryType}"><img class="pkm-img" src="${imageUrl}" alt="${pokemon.name}"></div>
            <div class="pokemon-types">${typesHTML}</div>
            </div>
        `;
    });


}

function openDialog(pokemonId) {

    let pokemon;
    allPokemonData.forEach((pkmn) => {
        if (pkmn.id === pokemonId) {
            pokemon = pkmn;
        }
    });
    let dialog = document.getElementById('dialog');
    dialog.showModal();
    document.body.classList.add('no-scroll');
    getDialogContentTemplate(pokemon);
}

function closeDialog() {
    let dialog = document.getElementById('dialog');
    dialog.close();
}

function getDialogContentTemplate(pokemon) {
    let dialogContent = document.getElementById('dialogContent')
    let gifUrl = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default;
    if (!gifUrl) {
        gifUrl = pokemon.sprites.front_default;
    }
    let primaryType = pokemon.types[0].type.name

    let typesHTML = '';
        pokemon.types.forEach((type) => {
            typesHTML += `<img src="assets/icons/${type.type.name}.svg"
                    alt="${type.type.name}"
                    class="type-icon"
                    title="${type.type.name}"></img>`;
        });

    dialogContent.innerHTML = `
        <div class="id-name"> <h3>#${pokemon.id} <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3></div>
        <div class="pokemon-img ${primaryType}"><img class="pkm-img" src="${gifUrl}" alt="${pokemon.name}"></div>
        <div class="pokemon-types">${typesHTML}</div>

        <div class="tab-navigation">
            <button class="tab-btn active" onclick="showTab('main')">Main</button>
            <button class="tab-btn" onclick="showTab('stats')">Stats</button>
            <button class="tab-btn" onclick="showTab('evolution')">Evolution</button>
        </div>

        <div id="tab-content">
            <div id="main-tab" class="tab-content active">
                <p>Height: ${pokemon.height / 10}m</p>
                <p>Weight: ${pokemon.weight / 10}kg</p>
                <p>Base Experience: ${pokemon.base_experience}</p>
            </div>
            
            <div id="stats-tab" class="tab-content">
                <p>HP: ${pokemon.stats[0].base_stat}</p>
                <p>Attack: ${pokemon.stats[1].base_stat}</p>
                <p>Defense: ${pokemon.stats[2].base_stat}</p>
                <p>Special Attack: ${pokemon.stats[3].base_stat}</p>
                <p>Special Defense: ${pokemon.stats[4].base_stat}</p>
                <p>Speed: ${pokemon.stats[5].base_stat}</p>
            </div>
            
            <div id="evolution-tab" class="tab-content">
                <p>Evolution Chain kommt hier hin</p>
            </div>
        </div>
    `
}

function showTab(tabName) {
    let allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach((tab) => {
        tab.classList.remove('active');
    });

    let allButtons = document.querySelectorAll('.tab-btn');
    allButtons.forEach((btn) => {
        btn.classList.remove('active');
    });

    document.getElementById(tabName + '-tab').classList.add('active');

    event.target.classList.add('active');
}


