'use strict';

const categButtons = document.querySelectorAll('.settings--categories-link');
const settingsPanels = document.querySelectorAll('.settings-panel');
const panelTitle = document.querySelector('.settings-panel-title');
const panelName = document.querySelector('.settings-info-name');
const panelEmail = document.querySelector('.settings-info-email');
const panelPhone = document.querySelector('.settings-info-phone');
const emailInput = document.querySelector('input[name="email"]');
const phoneInput = document.querySelector('input[name="phone"]');
const logoutBtn = document.querySelector('.logout');
const darkModeBtn = document.querySelectorAll('.btn');
const isDarkMode = localStorage.getItem('darkMode');
const infoBtn = document.querySelector('.btn-info');
const passwordBtn = document.querySelector('.btn-password');
const inputFields = document.querySelectorAll('.input-field');
const animalsList = document.querySelector('.grid--card-view');

const setPanelInfo = async() => {
    const result = await fetch('http://localhost:3000/api/users/self', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const response = await result.json();
    /*console.log(response);*/
    if(response.status === 'success') {
        panelTitle.textContent = response.data.username;
        panelName.textContent = `${response.data.first_name} ${response.data.last_name}`;
        panelEmail.textContent = response.data.email;
        panelPhone.textContent = response.data.phone;
        emailInput.value = response.data.email;
        phoneInput.value = response.data.phone;
        if(response.data.theme === 'DARK'){
            // add darkMode to true in localStorage
            localStorage.setItem('darkMode', 'true');
            // add dark-mode class to body
            document.body.classList.add('dark-mode');
        }
    }
};

setPanelInfo().then(() => {
    console.log("Panel info set");
});

const addActive = function (button) {
    button.classList.add('active');
}

const removeActive = function (button) {
    button.classList.remove('active');
}

const openPanel = function (panel) {
    panel.classList.remove('panel-inactive');
}

const closePanel = function (panel) {
    panel.classList.add('panel-inactive');
}

categButtons[0].addEventListener('click', function () {
    addActive(categButtons[0]);
    removeActive(categButtons[1]);
    openPanel(settingsPanels[0]);
    closePanel(settingsPanels[1]);
});

categButtons[1].addEventListener('click', function () {
    addActive(categButtons[1]);
    removeActive(categButtons[0]);
    openPanel(settingsPanels[1]);
    closePanel(settingsPanels[0]);
});

const logoutEvent = function () {
    localStorage.clear();
    /*localStorage.setItem('logged', false);*/
    window.location.href = '/';
}

logoutBtn.addEventListener('click', logoutEvent);

//Dark mode

if (isDarkMode === 'true') {
    darkModeBtn[0].classList.remove('btn-light');
    darkModeBtn[0].classList.add('btn-full');
    darkModeBtn[1].classList.remove('btn-full');
    darkModeBtn[1].classList.add('btn-light');
    document.body.classList.add('dark-mode');
}
else {
    darkModeBtn[0].classList.remove('btn-full');
    darkModeBtn[0].classList.add('btn-light');
    darkModeBtn[1].classList.remove('btn-light');
    darkModeBtn[1].classList.add('btn-full');
    document.body.classList.remove('dark-mode');
}

darkModeBtn[0].addEventListener('click', async function () {
    const response = await fetch('http://localhost:3000/api/users/updateSelf', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            theme: 'DARK'
        })
    });
    if(response.status === 204){
        darkModeBtn[0].classList.remove('btn-light');
        darkModeBtn[0].classList.add('btn-full');
        darkModeBtn[1].classList.remove('btn-full');
        darkModeBtn[1].classList.add('btn-light');
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', true);
    } else {
        alert('Error');
    }
}
);

darkModeBtn[1].addEventListener('click', async function () {
        const response = await fetch('http://localhost:3000/api/users/updateSelf', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                theme: 'LIGHT'
            })
        });
    if(response.status === 204){
        darkModeBtn[0].classList.remove('btn-full');
        darkModeBtn[0].classList.add('btn-light');
        darkModeBtn[1].classList.remove('btn-light');
        darkModeBtn[1].classList.add('btn-full');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', false);
    } else {
        alert('Error');
    }
});

// END OF DARK MODE

// INFO SECTION

const changeInfo = async () => {
    const requestBody = {
        email: inputFields[0].value,
        phone: inputFields[1].value
    };
    const response = await fetch('http://localhost:3000/api/users/updateSelf', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
    })
    if(response.status === 204){
        setPanelInfo().catch(() => {
            alert('Error updating info');
        });
    } else{
        alert('Error updating info');
    }
}

infoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    changeInfo().catch(() => {
        alert('Error updating info');
    });
});

const changePassword = async () => {
    const requestBody = {
        email: panelEmail.textContent,
        password: inputFields[2].value,
        passwordConfirm: inputFields[3].value
    };
    const response = await fetch('http://localhost:3000/api/auth/resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    if(response.status === 204){
        alert('Password changed successfully');
    } else {
        alert('Error changing password');
    }
    // clear input fields after changing password
    inputFields[2].value = '';
    inputFields[3].value = '';
}

passwordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    changePassword().catch(() => {
        alert('Error changing password');
    });
});

// END OF INFO SECTION

const getUserFavourites = function (token) {
    return fetch('http://localhost:3000/api/users/favorites', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => {
        if(!response.ok){
            alert('Error getting user favourites');
            return;
        }
        return response.json();
    });
}

const removeFavorite = async function (token, id) {
    const response = await fetch(`http://localhost:3000/api/users/favorites/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if(!response.ok){
        alert('Error removing animal from favorites');
    }
}

const getAnimalImg = function (id) {
    return `http://localhost:3000/api/animals/${id}/photo`;
}

const createAnimal = function (animalList, animal) {

    const htmlString = `
        <div class="animal-card grid grid--card">
            <img alt="Animal picture" class="animal-img animal-${animal.id}">
            <div class="card-text">
                <h3 class="tertiary-heading">${animal.name}</h3>
                <ul class="card-description">
                    <li><span>Binomial name: ${animal.binomial_name}</span></li>
                    <li><span>Origin: ${animal.origin}</span></li>
                    <li><span>Weight: ${animal.min_weight} - ${animal.max_weight} kg</span></li>
                </ul>
                <a href="animal-description.html" class="btn-card">Learn more</a>
            </div>
            <div class="fav-button">
              <label class="fav-container fav-${animal.id}">
                <input type="checkbox">
                <svg viewBox="0 0 256 256" class="fav-checkmark">
                  <rect fill="none" height="256" width="256"></rect>
                  <path
                    d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z"
                    stroke-width="20px"
                    stroke="#FFF"
                    fill="none"
                  ></path>
                </svg>
              </label>
            </div>
          </div>
    `;
    animalList.insertAdjacentHTML('afterbegin', htmlString);
    const favContainer = document.querySelector(`.fav-${animal.id} input`);
    favContainer.checked = true;

    favContainer.addEventListener('change', function () {
        const token = localStorage.getItem('token');

        if(!favContainer.checked){
            removeFavorite(token, animal.id).then(function () {
                alert('Animal removed from favourites');
                showFavourites(animalList);
            }).catch(function () {
                alert('Error removing animal from favourites');
                favContainer.checked = true;
            });
        }
    });
    const animalImg = document.querySelector(`.animal-${animal.id}`);
    animalImg.src = getAnimalImg(animal.id);
}

const showFavourites = function (animalList) {
    getUserFavourites(localStorage.getItem('token')).then(function (data) {
        const animals = data.data.favorites;
        animalList.innerHTML = '';
        animals.forEach(animal => {
            createAnimal(animalList, animal);
        });
    }).catch(function () {
        alert('Error getting user favourites');
    });
};

showFavourites(animalsList);