function getDialogHeaderHTML(pokemon, gifUrl, primaryType) {
    return `
        <div class="pkm-id-and-img"><div class="id-name">
            <h3>#${pokemon.id}</h3>
            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        </div>
        <div class="pokemon-img ${primaryType}">
            <img class="pkm-img" src="${gifUrl}" alt="${pokemon.name}">
            
        </div></div>
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

function getStatsRowHTML(statName, statValue) {
    return `<div class="stats-row">
            <div class="stat-names">
                <p>${statName}:</p>
            </div>
            <div class="stat-value">
                <p>${statValue}</p>
            </div>
            <div class="stat-bars-container">
                <div class="stat-bars" style="width: ${statValue}%;; height: 8px;"></div>
            </div> 
        </div>`;
}

function getStatsTabHTML(pokemon) {
    const statNames = ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'];
    let statsHTML = '';
    pokemon.stats.forEach((stat, index) => {
        statsHTML += getStatsRowHTML(statNames[index], stat.base_stat);});
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
    let names = [chain.species.name];  // erste Evolution
    if (chain.evolves_to[0]) {          // schauen ob es zweite Evo gibt
        names.push(chain.evolves_to[0].species.name);
    }
    if (chain.evolves_to[0].evolves_to[0]) {        // dritte Evo 
        names.push(chain.evolves_to[0].evolves_to[0].species.name);  // jetzt sieht das array so aus. names = ["bulbasaur", "ivysaur", "venusaur"]
    }
    return getEvolutionStagesHTML(names);
}

function getEvolutionStagesHTML(names) {
    let html = '<div class="evolution-container">';
     names.forEach((name, i) => {
        if (i > 0) html += '<span class="arrow">→</span>';
        let sprite = getPokemonSpritesByName(name);
        let imgHTML = `<img src="${sprite}" alt="${name}">`;
        html += `
            <div class="evolution-stage">
                ${imgHTML}
                <div class="evolution-names"><p>${name.charAt(0).toUpperCase() + name.slice(1)}</p></div>
            </div>`;});
     html += '</div>';
     return html;
}
