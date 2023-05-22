'use strict';

const dropDowns = document.querySelectorAll('.drop-icon');
const pagination = document.querySelector('.pagination');
const animalList = document.querySelector('.elements-container');
const inputs = document.querySelectorAll('.container-checkbox input');
let animals = [];
let userFavourites = [];

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

const openDropDown = function (dropItem) {
    dropItem.classList.add('open');
}

const closeDropDown = function (dropItem) {
    dropItem.classList.remove('open');
}

dropDowns.forEach(function (dropDown) {
    dropDown.addEventListener('click', function () {
        const dropOpen = dropDown.parentElement.classList.contains('open');
        if (dropOpen) {
            closeDropDown(dropDown.parentElement);
        } else {
            openDropDown(dropDown.parentElement);
        }
    });
});

const getAnimals = async function () {
    const response = await fetch('http://localhost:3000/api/animals');
    if(!response.ok){
        alert('Error getting animals');
        return;
    }
    return await response.json();
}

const showLoadingText = function () {
    /*const animalList = document.querySelector('.elements-container');*/
    clearAnimalCards();
    const htmlString = `
        <div class="loading-container">
            <p class="loading-text">Loading animals...</p>
        </div>
    `;
    animalList.insertAdjacentHTML('afterbegin', htmlString);
}

const hideLoadingText = function () {
    const loadingText = document.querySelector('.loading-container');
    loadingText.parentElement.removeChild(loadingText);
}

const getAnimalImg = function (id) {
    return `http://localhost:3000/api/animals/${id}/photo`;
}

const addAnimalToFavourites = async function (token, id) {
    const response = await fetch(`http://localhost:3000/api/users/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            animal_id: id
        })
    });
    if(!response.ok){
        alert('Error adding animal to favorites');
    }
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
                <a href="animal-description.html" class="btn">Learn more</a>
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

    userFavourites.forEach(function (favourite) {
        if(favourite.animal_id === animal.id){
            favContainer.checked = true;
        }
    });

    favContainer.addEventListener('change', function () {
        const token = localStorage.getItem('token');

        if(token){
            if(!favContainer.checked){
                removeFavorite(token, animal.id).then(function () {
                    alert('Animal removed from favourites');
                }).catch(function () {
                    alert('Error removing animal from favourites');
                    favContainer.checked = true;
                });
            } else {
                addAnimalToFavourites(token, animal.id).then(function () {
                    alert('Animal added to favourites');
                }).catch(function () {
                    alert('Error adding animal to favourites');
                    favContainer.checked = false;
                });
            }
        }
        else{
            alert('You need to log in to add an animal to your favourites');
            favContainer.checked = false;
        }
    });


    const animalImg = document.querySelector(`.animal-${animal.id}`);
    animalImg.src = getAnimalImg(animal.id);
}

const clearAnimalCards = function () {
    // remove all divs with class animal-card
    const animalCards = document.querySelectorAll('.animal-card');
    animalCards.forEach(function (animalCard) {
        animalCard.remove();
    });
}

const showAnimals = function (animalList, animals, currentPage, resultsPerPage){
    const start = (currentPage-1)*resultsPerPage;
    const end = currentPage*resultsPerPage;
    const animalsPage = animals.slice(start, end);
    clearAnimalCards();

    if(localStorage.getItem('token') === null){
        userFavourites = [];
        for(let i=animalsPage.length-1; i>=0; i--){
            createAnimal(animalList, animalsPage[i]);
        }
    } else{
        getUserFavourites(localStorage.getItem('token')).then(function (data) {
            userFavourites = data.data.favorites;
            for(let i=animalsPage.length-1; i>=0; i--){
                createAnimal(animalList, animalsPage[i]);
            }
        }).catch(function () {
            alert('Error getting user favourites');
        });
    }
}

const createPagination = function (nrPages, currentPage, pagesList, posForDots) {
    // set pagination to display flex
    /*pagination.style.display = 'flex';*/
    
    const paginationBtn = document.querySelector('.btn--pagination');
    paginationBtn.remove();

    const pageLinks = document.querySelectorAll('.page-link');
    pageLinks.forEach(function (pageLink) {
        pageLink.remove();
    });
    const dots = document.querySelectorAll('.dots');
    dots.forEach(function (dot) {
        dot.remove();
    });

    for(let i=pagesList.length-1; i>=0; i--){
        if(pagesList[i]===currentPage){
            const htmlString = `<button class="page-link page-link--active">${pagesList[i]}</button>`;
            pagination.insertAdjacentHTML('afterbegin', htmlString);
        }
        else{
            const htmlString = `<button class="page-link">${pagesList[i]}</button>`;
            pagination.insertAdjacentHTML('afterbegin', htmlString);
        }
        for(let j=0; j<posForDots.length; j++){
            if(i===posForDots[j]){
                const dotsString = `<p class="dots">...</p>`;
                pagination.insertAdjacentHTML('afterbegin', dotsString);
                break;
            }
        }
    }

    const pageLinksEvents = document.querySelectorAll('.page-link');
    for(let i=0; i<pageLinksEvents.length; i++){
        pageLinksEvents[i].addEventListener('click', pageEvent.bind(null, pagesList[i], nrPages));
    }
    
    const pagBtnHtml = `<button class="btn--pagination">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="btn-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
    </button>`;
    pagination.insertAdjacentHTML('afterbegin', pagBtnHtml);

    const pageBtns = document.querySelectorAll('.btn--pagination');
    if(currentPage===1){
        pageBtns[0].addEventListener('click', pageEvent.bind(null, currentPage, nrPages));
    }
    else{
        pageBtns[0].addEventListener('click', pageEvent.bind(null, currentPage-1, nrPages));
    }

    if(currentPage===nrPages){
        pageBtns[1].addEventListener('click', pageEvent.bind(null, currentPage, nrPages));
    }
    else{
        pageBtns[1].addEventListener('click', pageEvent.bind(null, currentPage+1, nrPages));
    }
}

const pageEvent = function (number, nrPages) {
    const currentPage = number;
    showAnimals(animalList, animals, currentPage, 10);
    let pagesList = [];
    for(let i=1; i<=nrPages; i++){
        if(i===1 && Math.abs(i-currentPage)>=2){
            pagesList.push(i);
        }
        if(Math.abs(i-currentPage)<2){
            pagesList.push(i);
        }
        if(i===nrPages && Math.abs(i-currentPage)>=2){
            pagesList.push(i);
        }
    }
    let posForDots = [];
    for(let i=0; i<pagesList.length-1; i++){
        if(pagesList[i+1]-pagesList[i]>1){
            posForDots.push(i+1);
        }
    }
    createPagination(nrPages, currentPage, pagesList, posForDots);
}

const showCardGrid = (animals) => {
    hideLoadingText();
    showAnimals(animalList, animals, 1, 10);
    let nrPages = Math.ceil(animals.length / 10);
    let pagesList = [];
    for(let i=1; i<=nrPages; i++){
        if(i===1 && Math.abs(i-1)>=2){
            pagesList.push(i);
        }
        if(Math.abs(i-1)<2){
            pagesList.push(i);
        }
        if(i===nrPages && Math.abs(i-1)>=2){
            pagesList.push(i);
        }
    }
    let posForDots = [];
    for(let i=0; i<pagesList.length-1; i++){
        if(pagesList[i+1]-pagesList[i]>1){
            posForDots.push(i+1);
        }
    }
    createPagination(nrPages, 1, pagesList, posForDots);
};

const getAnimalsFiltered = async function (filter) {
    const response = await fetch('http://localhost:3000/api/animals/criteria', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filter)
    });
    if(!response.ok){
        alert('Error getting animals');
        return;
    }
    return await response.json();
};

const searchAnimals = async function (search) {
    const response = await fetch(`http://localhost:3000/api/animals/search=${search}`);
    if(!response.ok){
        alert('Error getting animals');
        return;
    }
    return await response.json();
}

const receiveAndDisplayAnimals = function(action, filter){
    if(action === 'default'){
        getAnimals().then(data => {
            animals = data;
            showCardGrid(data);
        });
    } else if(action === 'filter'){
        getAnimalsFiltered(filter).then(data => {
            animals = data;
            showCardGrid(data);
        });
    } else if(action === 'search') {
        searchAnimals(filter).then(data => {
            animals = data;
            showCardGrid(data);
        });
    } else if(action === 'prefilter') {
        getAnimalsFiltered(filter).then(data => {
            animals = data;
            console.log(data);
            showCardGrid(data);
        });
    }
};

inputs.forEach(function (input) {
    input.addEventListener('change', function () {
        const checkedInputs = document.querySelectorAll('.container-checkbox input:checked');
        const filter = {};
        checkedInputs.forEach(function (checkedInput) {
            const filterType = checkedInput.parentElement.parentElement.parentElement.parentElement
                .parentElement.querySelector('p').textContent.toLowerCase();
            let filterName = filterType;
            if (filterType === 'region') {
                filterName = 'origin';
            } else if(filterType === 'climate conditions'){
                filterName = 'climate';
            } else if(filterType === 'conservation status'){
                filterName = 'conservation';
            }
            const filterValue = checkedInput.parentElement.parentElement.querySelector('p').textContent;
            if (filter[filterName]) {
                filter[filterName].push(filterValue);
            } else {
                filter[filterName] = [filterValue];
            }
        });
        if(Object.keys(filter).length === 0){
            receiveAndDisplayAnimals('default', null);
            showLoadingText();
            return;
        }
        receiveAndDisplayAnimals('filter', filter);
        showLoadingText();
    });
});

if(localStorage.getItem('search')){
    const search = localStorage.getItem('search');
    localStorage.removeItem('search');
    receiveAndDisplayAnimals('search', search);
    showLoadingText();
} else if(localStorage.getItem('prefilter')){
    const prefilter = localStorage.getItem('prefilter');
    const pref = {
        'type': [prefilter]
    }
    localStorage.removeItem('prefilter');
    receiveAndDisplayAnimals('prefilter', pref);
    showLoadingText();
} else {
    receiveAndDisplayAnimals('default', null);
    showLoadingText();
}
