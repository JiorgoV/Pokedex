const BASE_URL = "https://pokeapi.co/api/v2/";  // Basic-URL for all API-Calls
let currentOffset = 0;
const LIMIT = 30;
let allPokemonData = [];        // all Pokemon
let currentPokemon = null;
let currentPokemonIndex = null;
let foundPokemonFromSearch = [];

async function onloadFunc() {

    loadPkmns();
}

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path);         // BASE_URL + path = "https://pokeapi.co/api/v2/" + "pokemon/25"
    let responseToJson = await response.json();
    return responseToJson;
}

async function loadPkmns() {
    toggleLoadingSpinner(true);  // Show spinner deactivate button
    let pokemonResponse = await loadData(`pokemon?limit=${LIMIT}&offset=${currentOffset}`);
    let pokemonDetails = await fetchPokemonDetails(pokemonResponse.results);
    toggleLoadingSpinner(false);  // Hide spinner and activate button
    renderPokemon(pokemonDetails);
    updateLoadingSpinner();
}

async function fetchPokemonDetails(pokemonList) {
    let pokemonDetails = [];
    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        let shortUrl = pokemon.url.replace('https://pokeapi.co/api/v2/', '');   // Shorten the url (replace "https://pokeapi.co/api/v2/" with nothing) so "pokemon/17" stays
        let details = await loadData(shortUrl);     // load details
        pokemonDetails.push(details);           // add details
        allPokemonData.push(details);           // removed forEach because it would push all pokemon
    }
    return pokemonDetails;
}

function updateLoadingSpinner() {
    currentOffset += LIMIT;
}

function renderPokemon(pokemonList) {
    let mainContent = document.getElementById('main-content');

    pokemonList.forEach((pokemon) => {      // go through every pokemon in array(pokemonList)
        let cardHTML = getPokemonCard(pokemon);  // get the finished HTML for the pokeon card (logic in  getPokemonCard())
        mainContent.innerHTML += cardHTML;      // add cardHTML to mainContent
    });
}

function getTypesHTML(types) {
    let typesHTML = '';
    types.forEach((type) => {
        typesHTML += `<img src="assets/icons/${type.type.name}.svg"    
                    alt="${type.type.name}"
                    class="type-icon"
                    title="${type.type.name}">`;
    })
    return typesHTML;
}

function getArray() {
    if (foundPokemonFromSearch.length == 0) {
        return allPokemonData;
    } else {
        return foundPokemonFromSearch;
    }
}

function openDialog(pokemonId) {
    let pokemon;
    let pokemonIndex;
    let usedArray = getArray();
    usedArray.forEach((pkmn, index) => {
        if (pkmn.id === pokemonId) {
            pokemon = pkmn;
            pokemonIndex = index;
        }
    });
    showPokemonDialog(pokemon, pokemonIndex);
}

function showPokemonDialog(pokemon, pokemonIndex) {
    currentPokemon = pokemon;       // Store globally to access it, for example Evolution.
    currentPokemonIndex = pokemonIndex;     // Store Index globaly, so i can navigate back and for
    let dialog = document.getElementById('dialog');
    dialog.showModal();
    document.body.classList.add('no-scroll');
    document.getElementById('main-content').classList.add('blur');
    renderDialogContent(pokemon);
}

function closeDialog() {
    let dialog = document.getElementById('dialog');
    dialog.close();
    document.body.classList.remove('no-scroll');
    document.getElementById('main-content').classList.remove('blur');
}

function renderDialogContent(pokemon) {
    let dialogContent = document.getElementById('dialogContent');

    let gifUrl = pokemon.sprites.versions['generation-v']['black-white'].animated.front_default;
    if (!gifUrl) {
        gifUrl = pokemon.sprites.front_default;
    }

    let primaryType = pokemon.types[0].type.name;
    let typesHTML = getTypesHTML(pokemon.types);
    let statsHTML = getStatsHTML(pokemon);

    dialogContent.innerHTML = getDialogContentHTML(pokemon, gifUrl, primaryType, typesHTML, statsHTML);
}

function showTab(tabName, event) {      // switch throug tabs in dialog   event = click-event from button
    let allTabs = document.querySelectorAll('.tab-content');       // get All Tab-Content (Main, Stats, Evolution)
    allTabs.forEach((tab) => {                  // search for tab in allTabs and get the tabs
        tab.classList.remove('active');         // remove class="active" from all tabs
    });
    let allButtons = document.querySelectorAll('.tab-btn');     // get all tab-buttons
    allButtons.forEach((btn) => {
        btn.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');      // add class="active" to chosen tab. tabname + '-tab' = 'stats' + '-tab' = 'stats-tab'
    event.target.classList.add('active');       // add class="active" to clicked button
    if (tabName === 'evolution') {      // if evolution-tab ist chosen -> load evolution chain for current pokemon
        loadEvolutionForCurrentPokemon();
    }
}

function toggleLoadingSpinner(show) {
    let spinner = document.getElementById('loading-spinner');
    let button = document.querySelector('.loading-more button');

    spinner.classList.toggle('d-none', !show);  // !show because 'd-none' = hidden
    button.disabled = show;  // Button deactivated while Spinner runs
}

function toggleLoadmoreButton(show) {
    let button = document.getElementById('load-more-buton');
    button.classList.toggle('d-none', !show)
}

async function getEvolutionChain(pokemon) {         // complete object currentPokemon
    let speciesUrl = pokemon.species.url.replace('https://pokeapi.co/api/v2/', '');     // get Species Url and shorten -> after replace: "pokemon-species/1/"
    let speciesData = await loadData(speciesUrl);       // load species data -> here is the evo chain

    let evolutionUrl = speciesData.evolution_chain.url.replace('https://pokeapi.co/api/v2/', '');   //  // get evolution chain and shorten -> after replace: "evolution-chain/1/"
    let evolutionData = await loadData(evolutionUrl);       // evolution chain data load

    return evolutionData.chain;     // give only chain back
}

async function loadEvolutionForCurrentPokemon() {
    let evolutionTab = document.getElementById('evolution-tab');
    evolutionTab.innerHTML = '<p class="loading-text">Lade Evolution Chain...</p>';

    let chain = await getEvolutionChain(currentPokemon);

    let evolutionHTML = getEvolutionHTML(chain);

    evolutionTab.innerHTML = evolutionHTML;
}

function getEvolutionNames(chain) {
    let names = [chain.species.name];       // Base Pokemon ---> allways there
    let secondNames = [];
    let thirdNames = [];
    if (chain.evolves_to && chain.evolves_to.length > 0) {  // go through all 2. evolutions if theres any
        for (let i = 0; i < chain.evolves_to.length; i++) {
            secondNames.push(chain.evolves_to[i].species.name);       // push Evolution in secondNames 
            if (chain.evolves_to[i].evolves_to && chain.evolves_to[i].evolves_to.length > 0) {      // check if theres 3. evolution and go through
                for (let index = 0; index < chain.evolves_to[i].evolves_to.length; index++) {
                    thirdNames.push(chain.evolves_to[i].evolves_to[index].species.name);     // push Evolution in thirdNames 
                }
            }
        }
    }
    return { names, secondNames, thirdNames };
}

function getEvolutionStagesHTML(name) {
    let sprite = getPokemonSpritesByName(name);     // pokemon.sprites.front_default
    let imgHTML = '';
    if (sprite) {
        imgHTML = `<img class="dialog-img" src="${sprite}" alt="${name}">`;
    } else {
        imgHTML = '<div class="no-image">🚫</br>No Image</div>';
    }
    return `
        <div class="evolution-stage">
            ${imgHTML}
            <p>${name.charAt(0).toUpperCase() + name.slice(1)}</p>
        </div>
    `;
}

function getBaseEvolution(names) {
    // show names from first evo
    let html = '';
    html += '<div class="evolution-container">';
    names.forEach((name, index) => {
        if (index > 0) {
            html += '<span class="arrow">→</span>';
        }
        html += getEvolutionStagesHTML(name);
    });
    html += '</div>';
    return html;
}

function getSecondEvolution(secondNames) {
    // show names from second evo
    if (secondNames.length === 0) {
        return '<p class="no-evolution">This Pokemon doesn`t evolve</p>';
    }
    let html = '<div class="second-evolution-container">';
    secondNames.forEach((name) => {
        html += '<div class="second-evolution-items">';
        html += '<span class="arrow">→</span>';
        html += getEvolutionStagesHTML(name);
        html += '</div>';
    });
    html += '</div>';
    return html;
}

function getThirdEvolution(thirdNames) {
    // show names from third evo
    if (thirdNames.length === 0) {
        return '';
    }
    let html = '<div class="third-evolution-container">';
    thirdNames.forEach((name) => {
        html += '<span class="arrow">→</span>';
        html += getEvolutionStagesHTML(name);
    });
    html += '</div>';
    return html;
}

function nextPokemon() {
    let usedArray = getArray();
    if (currentPokemonIndex < usedArray.length - 1) {
        currentPokemonIndex++;
    } else {
        currentPokemonIndex = 0;
    }

    currentPokemon = usedArray[currentPokemonIndex];
    renderDialogContent(currentPokemon);
}

function previousPokemon() {
    let usedArray = getArray();
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
    } else {
        currentPokemonIndex = usedArray.length - 1;
    }

    currentPokemon = usedArray[currentPokemonIndex];
    renderDialogContent(currentPokemon);
}

function searchPokemon() {
    let input = document.getElementById('search-bar');
    let filter = input.value.toLowerCase().trim();
    let allCards = document.querySelectorAll('.pokemon-card');
    let noResults = document.getElementById('no-results');
    let errorMsg = document.getElementById('search-error');
    errorMsg.classList.add('d-none');
    if (filter.length > 0 && filter.length < 3) {
        showSearchError(errorMsg, allCards);  
        return;}
    if (filter.length === 0) {
        showAllPokemonCards(allCards, noResults);
        toggleLoadmoreButton(true);
        return;}
    runSearch(allCards, noResults, filter);
}

function runSearch(allCards, noResults, filter) {
    toggleLoadmoreButton(false);
    let foundPokemon = filterPokemonCards(allCards, filter);
    toggleNoResultsText(noResults, foundPokemon);
}

function showSearchError(errorMsg, allCards) {
    errorMsg.classList.remove('d-none');
    allCards.forEach((card) => {
        card.style.display = 'none';
    });
}

function resetSearch() {
    let input = document.querySelector('.search-bar');
    let allCards = document.querySelectorAll('.pokemon-card');
    let noResults = document.getElementById('no-results');
    let errorMsg = document.getElementById('search-error');

    input.value = '';
    errorMsg.classList.add('d-none');

    showAllPokemonCards(allCards, noResults);
    toggleLoadmoreButton(true);

}

function getPokemonSpritesByName(name) {
    let pokemon = allPokemonData.find(pkmn => pkmn.name === name);
    if (!pokemon) {
        return null;
    } else
        return pokemon.sprites.front_default;
}

function filterPokemonCards(allCards, filter) {
    let foundPokemon = 0;
    foundPokemonFromSearch = [];
    allCards.forEach((card) => {        // go through every pokemoncard in allCards
        let pokemonName = card.querySelector('.id-name h3:last-child').textContent.toLowerCase();       // get the name
        if (pokemonName.indexOf(filter) > -1) {         // Check if written(filter) is in the name. IndexOf() gives position back or -1(not found)!
            card.style.display = '';
            foundPokemon++;
            let pokemon = allPokemonData.find(pkmn => pkmn.name === pokemonName);
            if (pokemon) {
                foundPokemonFromSearch.push(pokemon);
            }
        } else {
            card.style.display = 'none';        // when nothing found --> hide all cards 
        }
    });
    return foundPokemon;
}

function toggleNoResultsText(noResults, foundPokemon) {
    if (foundPokemon === 0) {
        noResults.classList.remove('d-none');
    } else {
        noResults.classList.add('d-none');
    }
}

function showAllPokemonCards(allCards, noResults) {
    foundPokemonFromSearch = [];
    allCards.forEach((card) => {
        card.style.display = '';        // show Pokemoncards
    });
    noResults.classList.add('d-none');   // hide text
}

function getStatsHTML(pokemon) {
    const statNames = ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'];
    let statsHTML = '';
    pokemon.stats.forEach((stat, index) => {
        let percentage = stat.base_stat;
        if (percentage > 100) {
            percentage = 100;
        }
        statsHTML += getStatsRowHTML(statNames[index], stat.base_stat, percentage);
    });
    return statsHTML;
}

function getPokemonCard(pokemon) {
    let imageUrl = pokemon.sprites.front_default;
    let primaryType = pokemon.types[0].type.name;
    let typesHTML = getTypesHTML(pokemon.types);  // get Types HTML before

    return getPokemonCardHTML(pokemon, imageUrl, primaryType, typesHTML);
}
