const axios = require('axios');
const heroForm = document.querySelector('form');
const partyList = document.querySelector('#party-list');
const heroList = document.querySelector('#hero-list');
const input = document.querySelector('input');
const dropdown = document.querySelector('#role');
const warning = document.querySelector('#warning');
const state = {};


heroForm.addEventListener('submit', async(ev)=> {
    ev.preventDefault();
    const name = input.value;
    const role = dropdown.value;
    const partySize = state.heroes.length;
    const maxPartySize = 10;
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
    const html = state.heroes.map( hero => {
    const role = state.roles.find( role => role.id === hero.roleId );
        return `
            <li>
                <img src="/assets/${ role.name }.png" class="role-img">
                ${ hero.name } - ${ role.name } || ${ hero.roleId }
                <button data-id='${ hero.id }'>Remove From Party</button>
            </li>
        `;
    }).join('');
    heroList.innerHTML = html;
};

const fetchHeroes = async() => {
    let response = await axios.get('/api/roles');
    let data = response.data;
    state.roles = data;
    renderRoles();
    response = await axios.get('/api/heroes');
    data = response.data;
    state.heroes = data;
    renderHeroes();




};

const bootstrap = async() => {
};

fetchHeroes();