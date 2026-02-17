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