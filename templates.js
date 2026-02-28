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
            <button class="arrow-buttons" onclick="event.stopPropagation(), previousPokemon()">⬅️</button>
            <button class="tab-btn active" onclick="showTab('main', event)">Main</button>
            <button class="tab-btn" onclick="showTab('stats', event)">Stats</button>
            <button class="tab-btn" onclick="showTab('evolution', event)">Evolution</button>
            <button class="arrow-buttons" onclick="event.stopPropagation(), nextPokemon()">➡️</button>
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

function getStatsTabHTML(pokemon) {
    const statNames = ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'];
    let statsHTML = '';
    pokemon.stats.forEach((stat, index) => {
        let percentage = stat.base_stat;
        if (percentage > 100) {
            percentage = 100;
        }
        statsHTML += getStatsRowHTML(statNames[index], stat.base_stat, percentage);});
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
    let html = '<div class="evolution-container">';
    let names = [];

    names.push(chain.species.name);  // Base Pokemon ---> gibt es immer

    if (chain.evolves_to && chain.evolves_to.length > 0) {  // durch alle 2. Evolutionen durchgehen wenn welche da sind
        for (let i = 0; i < chain.evolves_to.length; i++) {
            names.push(chain.evolves_to[i].species.name);       // Evolution in names pushen
            console.log(names);
            
            if (chain.evolves_to[i].evolves_to && chain.evolves_to[i].evolves_to.length > 0) {      // 3. Evolution checken ob vorhanden
                for (let index = 0; index < chain.evolves_to[i].evolves_to.length; index++) {
                    names.push(chain.evolves_to[i].evolves_to[index].species.name);     // Evolution in names pushen
                    console.log(names);
                    }}}}
    // namen Anzeigen
    names.forEach((name, index) => {
        if (index > 0) {
            html += '<span class="arrow">→</span>';
        }
        html += getEvolutionStagesHTML(name)
    });

    if (names.length === 1) {
        html += '<p class="no-evolution">This Pokemon doesn`t evolve</p>';
    }

    html += '</div>';
    return html;
}

function getEvolutionStagesHTML(name) {
    let sprite = getPokemonSpritesByName(name);
    let imgHTML;
    
    if (sprite) {
        imgHTML = `<img src="${sprite}" alt="${name}">`;
    } else {
        imgHTML = '<div class="no-image">No Image</div>';
    }
    
    return `
        <div class="evolution-stage">
            ${imgHTML}
            <p>${name.charAt(0).toUpperCase() + name.slice(1)}</p>
        </div>
    `;
}
 