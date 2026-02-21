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
            <button class="tab-btn active" onclick="showTab('main', event)">Main</button>
            <button class="tab-btn" onclick="showTab('stats', event)">Stats</button>
            <button class="tab-btn" onclick="showTab('evolution', event)">Evolution</button>
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
        <div class="stats-row">
            <div class="stat-names">
                <p>${statNames[index]}:</p>
            </div>
            <div class="progress progress-row">
                <div class="progress-bar" role="progressbar" style="width: ${stat.base_stat}%;">${stat.base_stat}</div>
            </div>
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

function getEvolutionHTML(chain) {
    if (!chain) return '<p>Keine Evolution Chain verfügbar</p>';

    let names = [chain.species.name];  // erste Evolution

    if (chain.evolves_to[0]) {          // schauen ob es zweite Evo gibt
        names.push(chain.evolves_to[0].species.name);
    }

    if (chain.evolves_to[0].evolves_to[0]) {        // dritte Evo 
        names.push(chain.evolves_to[0].evolves_to[0].species.name);  // jetzt sieht das array so aus. names = ["bulbasaur", "ivysaur", "venusaur"]
    }

     let html = '<div class="evolution-container">';

     names.forEach((name, i) => {
        if (i > 0) html += '<span class="arrow">→</span>';
        let sprite = getPokemonSpritesByName(name);

        let imgHTML = `<img src="${sprite}" alt="${name}">`;

        html += `
            <div class="evolution-stage">
                ${imgHTML}
                <p>${name.charAt(0).toUpperCase() + name.slice(1)}</p>
            </div>
        `;
     });

     html += '</div>';

     return html;
}

