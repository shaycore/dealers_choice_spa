const axios = require('axios');
const heroForm = document.querySelector('form');
const partyList = document.querySelector('#party-list');
const heroList = document.querySelector('#hero-list');
const input = document.querySelector('input');
const dropdown = document.querySelector('#role');
const warning = document.querySelector('#warning');
const information = document.querySelector('#information');

const state = {};

window.addEventListener('hashchange', async()=> {
    fetchHeroes();
});

heroForm.addEventListener('submit', async(ev)=> {
    ev.preventDefault();
    const name = input.value;
    const role = dropdown.value;
    const partySize = state.heroes.length;
    const maxPartySize = 7;
    try {
        if (partySize < maxPartySize) {
            await axios.post('/api/heroes', {
                name,
                role
            });
            fetchHeroes();
            input.value = '';
            warning.innerHTML = '';
        }
        else {
            const warningMessage = `Warning! Party can only contain ${maxPartySize} Heroes! Please remove Heroes from your Party to add New Heroes!`;
            warning.innerHTML = warningMessage;
        }
    }
    catch(ex) {
        console.log(ex.response.data);
    }


});

heroList.addEventListener('click', async(ev)=> {
    if (ev.target.tagName === 'BUTTON') {
        const id = ev.target.getAttribute('data-id');
        await axios.delete(`/api/heroes/${id}`);
        fetchHeroes();
    }
});

const renderRoles = () => {
    const dropdownOptions = state.roles.map( role => {
        return `
            <option value="${ role.id }">
                ${ role.name }
            </option>
        `;
    }).join('');
    dropdown.innerHTML = dropdownOptions
};

const renderHeroes = ()=> {
    const id = window.location.hash.slice(1)*1;
    const html = state.heroes.map( hero => {
    const role = state.roles.find( role => role.id === hero.roleId );
        return `
            <li class='${ hero.id === id ? 'selected' : '' }'> 
                ${ hero.id === id ? '<b>Party Leader!</b>' : '' }
                <a href='#${hero.id}'><img src="/assets/${ role.name }.png" class="role-img"></a>
                Name: ${ hero.name }
                <div class="tooltip">Role: <b>${ role.name }</b>
                    <span class="tooltiptext">
                        <b>Base Stats</b>: <br>
                        Attack: ${ role.attack }<br>
                        Defense: ${ role.defense }<br>
                        Agility: ${ role.agility }<br>
                        Magic: ${ role.magic }<br>
                        Intelligence: ${ role.intelligence }
                    </span>
                </div>
                <button data-id='${ hero.id }'>Kick From Party</button>
            </li>
        `;
    }).join('');
    heroList.innerHTML = html;
};

const fetchRoles = async() => {
    let response = await axios.get('/api/roles');
    let data = response.data;
    state.roles = data;
    renderRoles();  
};

const fetchHeroes = async() => {
    response = await axios.get('/api/heroes');
    data = response.data;
    state.heroes = data;
    renderHeroes();
};

const start = async() => {
    fetchRoles();
    fetchHeroes();
};

start();