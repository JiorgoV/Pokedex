function getDialogHeaderHTML(pokemon, gifUrl, primaryType) {
    return `
        <div class="pkm-id-and-img"><div class="id-name">
            <h3>#${pokemon.id}</h3>
            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        </div>
        <div class="pokemon-img ${primaryType}">
            <img class="pkm-img" src="${gifUrl}" alt="${pokemon.name}"></div></div>
    `;
}

function getDialogContentHTML(pokemon, gifUrl, primaryType, typesHTML, statsHTML) {
    return `
        <div class="dialog-top ${primaryType}">
            ${getDialogHeaderHTML(pokemon, gifUrl, primaryType)}
            <div class="pokemon-types">${typesHTML}</div>
        </div>
        <div class="dialog-bottom">
            ${getTabNavigationHTML()}
            ${getMainTabHTML(pokemon)}       
            ${getStatsTabHTML(statsHTML)}    
            ${getEvolutionTabHTML()}    
        </div>
    `;
}

function getTabNavigationHTML() {
    return `<div class="tab-navigation">
            <button class="arrow-buttons" onclick="event.stopPropagation(), previousPokemon()">⬅️</button>
            <button class="tab-btn active" onclick="showTab('main', event)">Main</button>
            <button class="tab-btn" onclick="showTab('stats', event)">Stats</button>
            <button class="tab-btn" onclick="showTab('evolution', event)">Evolution</button>
            <button class="arrow-buttons" onclick="event.stopPropagation(), nextPokemon()">➡️</button>
        </div>`;
}

function getMainTabHTML(pokemon) {
    return `
            <div id="main-tab" class="tab-content active">
                <p>Height: ${pokemon.height / 10}m</p>
                <p>Weight: ${pokemon.weight / 10}kg</p>
                <p>Base Experience: ${pokemon.base_experience}</p>
            </div>`;
}

function getStatsRowHTML(statName, statValue, percentage) {
    return `<div class="stats-row">
            <div class="stat-names">
                <p>${statName}:</p>
            </div>
            <div class="stat-value">
                <p>${statValue}</p>
            </div>
            <div class="stat-bars-container">
                <div class="stat-bars" style="width: ${percentage}%; height: 8px;"></div>
            </div> 
        </div>`;
}

function getStatsTabHTML(statsHTML) {
    return `<div id="stats-tab" class="tab-content">
                <div class="tab-stats">
                    ${statsHTML}
                </div>
            </div>`;
}

function getEvolutionTabHTML() {
    return `<div id="evolution-tab" class="tab-content">
                <p>Evolutionchain loading...</p>
            </div>`;
}

function getEvolutionHTML(chain) {
    if (!chain) return '<p>No Evolutionchain available</p>';
    let html = '<div class="evolution-wrapper">';
    let evolutionData = getEvolutionNames(chain);

    html += getBaseEvolution(evolutionData.names);
    html += getSecondEvolution(evolutionData.secondNames);
    html += getThirdEvolution(evolutionData.thirdNames);
    html += '</div>';
    return html;
}

function getEvolutionStagesHTML(name) {
    let sprite = getPokemonSpritesByName(name);
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

function getPokemonCardHTML(pokemon, imageUrl, primaryType) {
    let typesHTML = '';
    pokemon.types.forEach((type) => {       // durch jedej Typen gehen falls 2 vorhanden sind
        typesHTML += `<img src="assets/icons/${type.type.name}.svg"
                    alt="${type.type.name}"
                    class="type-icon"
                    title="${type.type.name}"></img>`;
    });

    return `
            <div class="pokemon-card" onclick="openDialog(${pokemon.id})">  
            <div class="id-name"><h3>#${pokemon.id} <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3></div>
            <div class="pokemon-img ${primaryType}"><img class="pkm-img" src="${imageUrl}" alt="${pokemon.name}"></div>
            <div class="pokemon-types">${typesHTML}</div>
            </div>
        `;
}

