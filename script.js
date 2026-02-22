const BASE_URL = "https://pokeapi.co/api/v2/";  // Basis-URL für alle API-Aufrufe
let currentOffset = 0;  
const LIMIT = 30;
let loadingCount = 0;
let allPokemonData = [];        // Alle Pokemon
let currentPokemon = null;
let currentPokemonIndex = null;

async function onloadFunc() {

    loadPkmns();
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path);
    let responseToJson = await response.json();     // BASE_URL + path = "https://pokeapi.co/api/v2/" + "pokemon/25"
    return responseToJson;
}

async function loadPkmns() {
    showLoadingSpinner()
    let pokemonResponse = await loadData(`pokemon?limit=${LIMIT}&offset=${currentOffset}`);
    let pokemonDetails = [];        
    for (let i = 0; i < pokemonResponse.results.length; i++) {
        let pokemon = pokemonResponse.results[i];
        let shortUrl = pokemon.url.replace('https://pokeapi.co/api/v2/', '');   // Kürze die URL (entferne "https://pokeapi.co/api/v2/") so bleibt nur z.b. "pokemon/17"
        let details = await loadData(shortUrl);     // Details laden
        pokemonDetails.push(details);           // Details hinzufügen
        pokemonDetails.forEach((pokemon) => {
            allPokemonData.push(pokemon);       // In globales Array gespeichert, um auf alle geladenen Pokemon zuzugreifen.
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
        let primaryType = pokemon.types[0].type.name;       // hole den ersten Typ des Pokemon(fire, water usw) Array -> pokemon.types[0]

        let typesHTML = '';
        pokemon.types.forEach((type) => {       // durch jedej Typen gehen falls 2 vorhanden sind
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
    currentPokemon = pokemon;       // global speichern um darauf zuzugreifen z.B. Evolution
    currentPokemonIndex = pokemonIndex;     // Index global speichern, so kann ich vor-zurück navigieren
    let dialog = document.getElementById('dialog');
    dialog.showModal();
    document.body.classList.add('no-scroll');
    document.getElementById('main-content').classList.add('blur');
    getDialogContentTemplates(pokemon);
}

function closeDialog() {
    let dialog = document.getElementById('dialog');
    dialog.close();
    document.body.classList.remove('no-scroll');
    document.getElementById('main-content').classList.remove('blur');
}

function getDialogContentTemplates(pokemon) {       // pokemon = das gefundene Pokemon von openDialog()
    let dialogContent = document.getElementById('dialogContent')
    let gifUrl = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default;
    if (!gifUrl) {
        gifUrl = pokemon.sprites.front_default;
    }
    let primaryType = pokemon.types[0].type.name
    let typesHTML = getTypesHTML(pokemon.types);
    dialogContent.innerHTML = `
        <div class="id-name"> <h3>#${pokemon.id} <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3></div>
        <div class="pokemon-img ${primaryType}"><button class="arrow-buttons"onclick="event.stopPropagation(), previousPokemon()">⬅️</button>
        <img class="pkm-img" src="${gifUrl}" alt="${pokemon.name}">
        <button class="arrow-buttons" onclick="event.stopPropagation(), nextPokemon()">➡️</button></div>
        <div class="pokemon-types">${typesHTML}</div>
        ${getTabNavigationHTML()}
        ${getMainTabHTML(pokemon)}       
        ${getStatsTabHTML(pokemon)}    
        ${getEvolutionTabHTML()}    
        </div>
    `
}

function showTab(tabName, event) {
    let allTabs = document.querySelectorAll('.tab-content');       // Alle Tab-Inhalte (Main, Stats, Evolution)
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
    disableLoadMoreButton();
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.add('d-none');
    enableLoadMoreButton();
}

function disableLoadMoreButton() {
    let button = document.querySelector('.loading-more button');
    button.disabled = true;
}

function enableLoadMoreButton() {
    let button = document.querySelector('.loading-more button');
    button.disabled = false;
}

async function getEvolutionChain(pokemon) {         // komplettes objekt currentPokemon
    let speciesUrl = pokemon.species.url.replace('https://pokeapi.co/api/v2/', '');     // Species Url holen und kürzen -> nach replace: "pokemon-species/1/"
    let speciesData = await loadData(speciesUrl);       // Species-Daten laden -> da ist evolution-chain drin
    console.log(speciesData);
    
    let evolutionUrl = speciesData.evolution_chain.url.replace('https://pokeapi.co/api/v2/', '');   // Evolution-Chain holen und kürzen -> nach replace: "evolution-chain/1/"
    let evolutionData = await loadData(evolutionUrl);       // Evolution-cahin daten laden
    console.log(evolutionData);
    
    return evolutionData.chain;     // nur Chain zurückgeben
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
    getDialogContentTemplates(currentPokemon);
}

function previousPokemon() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
    } else {
        currentPokemonIndex = allPokemonData.length - 1;
    }

    currentPokemon = allPokemonData[currentPokemonIndex];
    getDialogContentTemplates(currentPokemon);
}


function searchPokemon() {
    let input = document.querySelector('.search-bar');
    let filter = input.value.toLowerCase();
    let allCards = document.querySelectorAll('.pokemon-card');
    if (filter.length < 3) {
        allCards.forEach((card) => {
            card.style.display = '';
        });
        return;}
    allCards.forEach((card) => {
        let pokemonName = card.querySelector('.id-name h3:last-child').textContent.toLowerCase();
        if (pokemonName.indexOf(filter) > -1) {
            card.style.display = '';  
        } else {
            card.style.display = 'none'; 
        }});
}

function getPokemonSpritesByName(name) {
    let pokemon = allPokemonData.find(p => p.name === name);

    return pokemon.sprites.front_default;
}