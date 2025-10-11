// gen1.js — loads Gen I Pokemon (1-151) from PokéAPI and renders cards

const POKE_COUNT = 151;
const grid = document.getElementById('pokemonGrid');
const loading = document.getElementById('loading');

function typeClass(type) {
    return `type ${type.toLowerCase()}`;
}

function createCard(p) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = `
        <div class="pokemon-card-inner">
            <div class="pokemon-card-front">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p class="pokemon-number">#${String(p.id).padStart(3, '0')}</p>
                <div class="pokemon-types">
                    ${p.types.map(t => `<span class="${typeClass(t)}">${t}</span>`).join('')}
                </div>
            </div>
            <div class="pokemon-card-back">
                <h3>${p.name}</h3>
                <p class="pokemon-description">${p.description || 'No description available.'}</p>
                <div class="pokemon-stats">
                    <div class="stat"><span>HP:</span><span>${p.stats.hp}</span></div>
                    <div class="stat"><span>Attack:</span><span>${p.stats.attack}</span></div>
                    <div class="stat"><span>Defense:</span><span>${p.stats.defense}</span></div>
                    <div class="stat"><span>Sp. Atk:</span><span>${p.stats.sp_atk}</span></div>
                    <div class="stat"><span>Sp. Def:</span><span>${p.stats.sp_def}</span></div>
                    <div class="stat"><span>Speed:</span><span>${p.stats.speed}</span></div>
                    <div class="stat total"><span>Total:</span><span>${p.stats.total}</span></div>
                </div>
            </div>
        </div>
    `;
    return card;
}

async function fetchPokemon(id) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    const speciesRes = await fetch(data.species.url);
    const species = await speciesRes.json();

    return {
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
        types: data.types.map(t => t.type.name),
        stats: (function() {
            const hp = data.stats.find(s => s.stat.name === 'hp').base_stat;
            const attack = data.stats.find(s => s.stat.name === 'attack').base_stat;
            const defense = data.stats.find(s => s.stat.name === 'defense').base_stat;
            const sp_atk = data.stats.find(s => s.stat.name === 'special-attack').base_stat;
            const sp_def = data.stats.find(s => s.stat.name === 'special-defense').base_stat;
            const speed = data.stats.find(s => s.stat.name === 'speed').base_stat;
            return { hp, attack, defense, sp_atk, sp_def, speed, total: hp + attack + defense + sp_atk + sp_def + speed };
        })(),
        description: species.flavor_text_entries.find(e => e.language.name === 'en')?.flavor_text.replace(/\n|\f/g, ' ')
    };
}

async function loadAll() {
    loading.style.display = 'block';
    const promises = [];
    for (let i = 1; i <= POKE_COUNT; i++) {
        promises.push(fetchPokemon(i).catch(err => {
            console.error('Failed to load', i, err);
            return null;
        }));
    }

    const results = await Promise.all(promises);
    grid.innerHTML = '';
    results.forEach(p => {
        if (p) grid.appendChild(createCard(p));
    });
    loading.style.display = 'none';
}

if (grid) loadAll();
else console.error('pokemonGrid not found');
