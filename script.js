const BASE_URL = "https://pokeapi.co/api/v2/";
let currentOffset = 0;
const LIMIT = 20;
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
    getDialogContentTemplate(pokemon);
}

function closeDialog() {
    let dialog = document.getElementById('dialog');
    dialog.close();
    document.body.classList.remove('no-scroll');
}



function getDialogContentTemplate(pokemon) {
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

function getEvolutionHTML(chain) {
    let html = '<div class="evolution-container">';
    let baseName = chain.species.name;
    html += `
        <div class="evolution-stage">
            <p>${baseName.charAt(0).toUpperCase() + baseName.slice(1)}</p>
        </div>
    `;

    if (chain.evolves_to.length > 0) {
        let secondName = chain.evolves_to[0].species.name;
        html += `
            <span class="arrow">→</span>
            <div class="evolution-stage">
                <p>${secondName.charAt(0).toUpperCase() + secondName.slice(1)}</p>
            </div>
        `;

        if (chain.evolves_to[0].evolves_to.length > 0) {
            let thirdName = chain.evolves_to[0].evolves_to[0].species.name;
            html += `
                <span class="arrow">→</span>
                <div class="evolution-stage">
                    <p>${thirdName.charAt(0).toUpperCase() + thirdName.slice(1)}</p>
                </div>
            `;
        }

    }

    html += '</div>';
    return html;
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

function getTabNavigationHTML() {
    return `<div class="tab-navigation">
            <button class="tab-btn active" onclick="showTab('main')">Main</button>
            <button class="tab-btn" onclick="showTab('stats')">Stats</button>
            <button class="tab-btn" onclick="showTab('evolution')">Evolution</button>
        </div>`;
}

function getMainTabHTML(pokemon) {
    return `<div id="tab-content">
            <div id="main-tab" class="tab-content active">
                <p>Height: ${pokemon.height / 10}m</p>
                <p>Weight: ${pokemon.weight / 10}kg</p>
                <p>Base Experience: ${pokemon.base_experience}</p>
            </div>`;
}

function getStatsTabHTML(pokemon) {
    const statNames = ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'];

    let statsHTML = '';
    pokemon.stats.forEach((stat, index) => {
        statsHTML += `
        <p>${statNames[index]}:</p>
        <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${stat.base_stat}%;">${stat.base_stat}</div>
        </div>`;
    });

    return `<div id="stats-tab" class="tab-content">
                <div class="tab-stats">
                    ${statsHTML}
                </div>
            </div>`;
}
function getEvolutionTabHTML() {
    return `<div id="evolution-tab" class="tab-content">
                <p>Evolution Chain kommt hier hin</p>
            </div>`;
}