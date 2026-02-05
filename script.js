const BASE_URL = "https://pokeapi.co/api/v2/";
let currentOffset = 0;
const LIMIT = 30;
let loadingCount = 0;
let allPokemonData = [];
let currentPokemon = null;
let currentPokemonIndex = null;

async function onloadFunc() {

    loadPkmns();
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();
    return responseToJson;
}

async function loadPkmns() {
    showLoadingSpinner()
    let pokemonResponse = await loadData(`pokemon?limit=${LIMIT}&offset=${currentOffset}`);
    let pokemonDetails = [];
    for (let i = 0; i < pokemonResponse.results.length; i++) {
        let pokemon = pokemonResponse.results[i];
        let shortUrl = pokemon.url.replace('https://pokeapi.co/api/v2/', '');
        let details = await loadData(shortUrl);
        pokemonDetails.push(details);
        pokemonDetails.forEach((pokemon) => {
            allPokemonData.push(pokemon);
        });
    }

    hideLoadingSpinner();
    renderPokemon(pokemonDetails);
    currentOffset += LIMIT;
    loadingCount++;
    if (loadingCount >= 2) {
        disableLoadMoreButton();
    }

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
    let pokemonIndex;
    allPokemonData.forEach((pkmn, index) => {
        if (pkmn.id === pokemonId) {
            pokemon = pkmn;
            pokemonIndex = index;
        }
    });
    currentPokemon = pokemon;
    currentPokemonIndex = pokemonIndex;
    let dialog = document.getElementById('dialog');
    dialog.showModal();
    document.body.classList.add('no-scroll');
    getDialogContentTemplates(pokemon);
}

function closeDialog() {
    let dialog = document.getElementById('dialog');
    dialog.close();
    document.body.classList.remove('no-scroll');
}



function getDialogContentTemplates(pokemon) {
    let dialogContent = document.getElementById('dialogContent')
    let gifUrl = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default;
    if (!gifUrl) {
        gifUrl = pokemon.sprites.front_default;
    }
    let primaryType = pokemon.types[0].type.name
    let typesHTML = getTypesHTML(pokemon.types);
    dialogContent.innerHTML = `
        <div class="id-name"> <h3>#${pokemon.id} <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3></div>
        <div class="pokemon-img ${primaryType}"><img class="pkm-img" src="${gifUrl}" alt="${pokemon.name}"></div>
        <div class="pokemon-types">${typesHTML}</div>
        ${getTabNavigationHTML()}
        ${getMainTabHTML(pokemon)}       
        ${getStatsTabHTML(pokemon)}    
        ${getEvolutionTabHTML()}    
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

    if (tabName === 'evolution') {
        loadEvolutionForCurrentPokemon();
    }
}

function showLoadingSpinner() {
    document.getElementById('loading-spinner').classList.remove('d-none');
    document.getElementById('load-more-buton').disabled = true;
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.add('d-none');
    document.getElementById('load-more-buton').disabled = false;
}

function disableLoadMoreButton() {
    let button = document.querySelector('.loading-more button');
    button.disabled = true;
}

async function getEvolutionChain(pokemon) {
    let speciesUrl = pokemon.species.url.replace('https://pokeapi.co/api/v2/', '');
    let speciesData = await loadData(speciesUrl);
    let evolutionUrl = speciesData.evolution_chain.url.replace('https://pokeapi.co/api/v2/', '');
    let evolutionData = await loadData(evolutionUrl);




    return evolutionData.chain;
}


async function loadEvolutionForCurrentPokemon() {
    let evolutionTab = document.getElementById('evolution-tab');
    evolutionTab.innerHTML = '<p class="loading-text">Lade Evolution Chain...</p>';

    let chain = await getEvolutionChain(currentPokemon);

    let evolutionHTML = getEvolutionHTML(chain);

    evolutionTab.innerHTML = evolutionHTML;
}

function nextPokemon() {
    if (currentPokemonIndex < allPokemonData.length - 1) {
        currentPokemonIndex++;
    } else {
        currentPokemonIndex = 0;
    }

    currentPokemon = allPokemonData[currentPokemonIndex];
    getDialogContentTemplate(currentPokemon);
}

function previousPokemon() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
    } else {
        currentPokemonIndex = allPokemonData.length - 1;
    }

    currentPokemon = allPokemonData[currentPokemonIndex];
    getDialogContentTemplate(currentPokemon);
}

