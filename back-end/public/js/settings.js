'use strict';

let categButtons = document.querySelectorAll('.settings--categories-link');
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
const animalTable = document.querySelector('.book-table');
const categList = document.querySelector('.settings--categories-list');
const animalInput = document.querySelector('input[id="animal-name"]');
const binomialInput = document.querySelector('input[id="binomial-name"]');
const typeInput = document.querySelector('input[id="type"]');
const climateInput = document.querySelector('input[id="climate"]');
const regionInput = document.querySelector('input[id="region"]');
const conservationInput = document.querySelector('input[id="conservation"]');
const descriptionInput = document.querySelector('textarea[id="description"]');
const minWeightInput = document.querySelector('input[id="min-weight"]');
const maxWeightInput = document.querySelector('input[id="max-weight"]');
const animalPhotoInput = document.querySelector('input[id="animal-photo"]');
const btnAddAnimal = document.querySelector('.btn-animal');

const getSelf = async () => {
    const response = await fetch('http://localhost:3000/api/users/self', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    return await response.json();
}

getSelf().then((data) => {
   if(data.data.role === 'admin'){
       const adminBtn = document.createElement('button');
       adminBtn.classList.add('settings--categories-link');
       adminBtn.textContent = 'Admin';
       categList.insertBefore(adminBtn, categList.children[2]);
       categButtons = document.querySelectorAll('.settings--categories-link');
   }

    categButtons[0].addEventListener('click', function () {
        addActive(categButtons[0]);
        openPanel(settingsPanels[0]);
        for(let i = 1; i < categButtons.length; i++){
            if(!categButtons[i].classList.contains('active')) continue;
            removeActive(categButtons[i]);
            closePanel(settingsPanels[i]);
        }
    });

    categButtons[1].addEventListener('click', function () {
        addActive(categButtons[1]);
        openPanel(settingsPanels[1]);
        for(let i = 0; i < categButtons.length; i++){
            if(i === 1) continue;
            if(!categButtons[i].classList.contains('active')) continue;
            removeActive(categButtons[i]);
            closePanel(settingsPanels[i]);
        }
    });

    if(categButtons.length > 3){
        categButtons[2].addEventListener('click', function () {
            addActive(categButtons[2]);
            openPanel(settingsPanels[2]);
            for(let i = 0; i < categButtons.length; i++){
                if(i === 2) continue;
                if(!categButtons[i].classList.contains('active')) continue;
                removeActive(categButtons[i]);
                closePanel(settingsPanels[i]);
            }
        });
    }
});

const getAnimals = async () => {
    const response = await fetch('http://localhost:3000/api/animals', {
        method: 'GET'
    });
    return await response.json();
};

const deleteAnimal = async (id) => {
    const response = await fetch(`http://localhost:3000/api/animals/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if(response.status === 204){
        return true;
    }
    const data = await response.json();
    console.log(data);
    return false;
}

getAnimals().then((data) => {
    const animals = data;
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Delete</th>
            </tr>
        </thead>
    `;
    const tbody = document.createElement('tbody');
    animals.forEach((animal) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${animal.id}</td>
            <td>${animal.name}</td>
            <td>
                <button class="btn-delete" data-id="${animal.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="delete-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    animalTable.appendChild(table);

    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach((btn) => {
        btn.addEventListener('click', function () {
            const id = this.dataset.id;
            deleteAnimal(id).then((result) => {
                if(result){
                    this.parentElement.parentElement.remove();
                } else{
                    alert('Something went wrong!');
                }
            });
        });
    });

});

const setPanelInfo = async() => {
    const result = await fetch('http://localhost:3000/api/users/self', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const response = await result.json();
    if(response.status === 'success') {
        panelTitle.textContent = response.data.username;
        panelName.textContent = `${response.data.first_name} ${response.data.last_name}`;
        panelEmail.textContent = response.data.email;
        panelPhone.textContent = response.data.phone;
        emailInput.value = response.data.email;
        phoneInput.value = response.data.phone;
        if(response.data.theme === 'DARK'){
            localStorage.setItem('darkMode', 'true');
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


const logoutEvent = function () {
    localStorage.clear();
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
        localStorage.setItem('darkMode', 'true');
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
        localStorage.setItem('darkMode', 'false');
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
    if(response.status !== 204){
        alert('Error changing password');
    }
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
                <a href="/animal=${animal.name}" class="btn-card">Learn more</a>
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

const conservationList = ['Not Evaluated', 'Least Concern', 'Near Threatened', 'Vulnerable', 'Endangered', 'Critically Endangered'];
const climateList = ['Desert', 'Temperate', 'Rainforest', 'Savannah', 'Taiga', 'Tundra'];
const typeList = ['Mammal', 'Bird', 'Reptiles', 'Amphibian', 'Fish', 'Arthropod'];
const regionList = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'Antarctica'];

const updateAnimal = async function (id, requestBody) {
    delete requestBody['name'];
    for(const key in requestBody){
        if(requestBody[key] === '' || requestBody[key] === null || requestBody[key] === undefined || requestBody[key] === 0
            || requestBody[key].trim() === ''){
            delete requestBody[key];
        }
    }
    for(const key in requestBody){
        if(key === 'conservation' && !conservationList.includes(requestBody[key])){
            alert('Conservation needs to be one of the following: Not Evaluated, Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered');
            return;
        }
        if(key === 'climate' && !climateList.includes(requestBody[key])){
            alert('Climate needs to be one of the following: Desert, Temperate, Rainforest, Savannah, Taiga, Tundra');
            return;
        }
        if(key === 'type' && !typeList.includes(requestBody[key])){
            alert('Type needs to be one of the following: Mammal, Bird, Reptiles, Amphibian, Fish, Arthropod');
            return;
        }
        if(key === 'origin' && !regionList.includes(requestBody[key])){
            alert('Origin needs to be one of the following: Africa, Asia, Europe, North America, South America, Australia, Antarctica');
            return;
        }
    }
    if(Object.keys(requestBody).length !== 0){
        console.log(requestBody);
        const response = await fetch(`http://localhost:3000/api/animals/${id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(requestBody)
        });
        if(response.status !== 204) {
            alert('Error updating animal');
        }
    }
    if(animalPhotoInput.files.length !== 0){
        console.log('here');
        const file = animalPhotoInput.files[0];
        const formData = new FormData();
        formData.append('photo', file);
        console.log(formData);
        const photoResponse = await fetch(`http://localhost:3000/api/animals/${id}/photo`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        if(photoResponse.status !== 204){
            alert('Error updating animal photo');
        }
    }
}

const addAnimal = async function () {
    const requestBody = {
        name: animalInput.value,
        binomial_name: binomialInput.value,
        origin: regionInput.value,
        type: typeInput.value,
        climate: climateInput.value,
        conservation: conservationInput.value,
        description: descriptionInput.value,
        min_weight: Number(minWeightInput.value),
        max_weight: Number(maxWeightInput.value)
    };

    // search if the animal name already exists
    const animalExists = await fetch(`http://localhost:3000/api/animals/${requestBody.name}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if(animalExists.status === 200){
        const ani = await animalExists.json();
        await updateAnimal(ani.id, requestBody);
    } else{
        if(!conservationList.includes(requestBody.conservation)){
            alert('Conservation status must be one of the following: Not Evaluated, Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered');
            return;
        }
        if(!climateList.includes(requestBody.climate)){
            alert('Climate must be one of the following: Desert, Temperate, Rainforest, Savannah, Taiga, Tundra');
            return;
        }
        if(!typeList.includes(requestBody.type)){
            alert('Type must be one of the following: Mammal, Bird, Reptiles, Amphibian, Fish, Arthropod');
            return;
        }
        if(!regionList.includes(requestBody.origin)){
            alert('Origin must be one of the following: Africa, Asia, Europe, North America, South America, Australia, Antarctica');
            return;
        }
        if(requestBody.min_weight > requestBody.max_weight){
            alert('Minimum weight must be less than maximum weight');
            return;
        }
        const response = await fetch('http://localhost:3000/api/animals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(requestBody)
        });
        if(!response.ok){
            alert('Error adding animal');
            return;
        }
        const animal = await response.json();
        const file = animalPhotoInput.files[0];
        const formData = new FormData();
        formData.append('photo', file);
        console.log(formData);
        const photoResponse = await fetch(`http://localhost:3000/api/animals/${animal.data.animal.id}/photo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        if(!photoResponse.ok){
            await deleteAnimal(animal.data.animal.id);
            const error = await photoResponse.json();
            alert('Error adding animal photo');
            return;
        }
    }
    window.location.reload();
}

btnAddAnimal.addEventListener('click', async(e) => {
    e.preventDefault();
    await addAnimal();
});