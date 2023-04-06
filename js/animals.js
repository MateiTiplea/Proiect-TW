'use strict';

const dropDowns = document.querySelectorAll('.drop-icon');
const dropItems = document.querySelectorAll('.item');

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


const animals = [
    {
        name: 'Lion',
        image: 'images/animals/lion-min.jpg',
        binomialName: 'Panthera leo',
        origin: 'Africa',
        weight: '180-250 kg',
    },
    {
        name: 'Tiger',
        image: 'images/animals/tiger.jpg',
        binomialName: 'Panthera tigris',
        origin: 'Asia',
        weight: '100-310 kg',
    },
    {
        name: 'Bear',
        image: 'images/animals/bear.jpg',
        binomialName: 'Ursus arctos',
        origin: 'North America',
        weight: '150-680 kg',
    },
    {
        name: 'Wolf',
        image: 'images/animals/wolf.jpg',
        binomialName: 'Canis lupus',
        origin: 'Europe',
        weight: '20-45 kg',
    },
    {
        name: 'Elephant',
        image: 'images/animals/elephant.jpg',
        binomialName: 'Elephas maximus',
        origin: 'Africa',
        weight: '2,700-5,000 kg',
    },
    {
        name: 'Giraffe',
        image: 'images/animals/giraffe.jpg',
        binomialName: 'Giraffa camelopardalis',
        origin: 'Africa',
        weight: '1,000-1,500 kg',
    },
    {
        name: 'Rhinoceros',
        image: 'images/animals/rhinoceros.jpg',
        binomialName: 'Rhinoceros unicornis',
        origin: 'Africa',
        weight: '1,000-1,500 kg',
    },
    {
        name: 'Hippopotamus',
        image: 'images/animals/hippopotamus.jpg',
        binomialName: 'Hippopotamus amphibius',
        origin: 'Africa',
        weight: '1,000-1,500 kg',
    },
    {
        name: 'Leopard',
        image: 'images/animals/leopard.jpg',
        binomialName: 'Panthera pardus',
        origin: 'Africa',
        weight: '40-70 kg',
    },
    {
        name: 'Zebra',
        image: 'images/animals/zebra.jpg',
        binomialName: 'Equus quagga',
        origin: 'Africa',
        weight: '350-550 kg',
    },
    {
        name: 'Crocodile',
        image: 'images/animals/crocodile.jpg',
        binomialName: 'Crocodylus niloticus',
        origin: 'Africa',
        weight: '500-1,000 kg',
    },
    {
        name: 'Red panda',
        image: 'images/animals/red_panda-min.jpg',
        binomialName: 'Ailurus fulgens',
        origin: 'Asia',
        weight: '3-6 kg',
    }
];


const animalList = document.querySelector('.elements-container');

const createAnimal = function (animalList, animal) {
    const htmlString = `
        <div class="animal-card grid grid--card">
            <img src="${animal.image}" alt="Animal picture" class="animal-img">
            <div class="card-text">
                <h3 class="tertiary-heading">${animal.name}</h3>
                <ul class="card-description">
                    <li><span>Binomial name: ${animal.binomialName}</span></li>
                    <li><span>Origin: ${animal.origin}</span></li>
                    <li><span>Weight: ${animal.weight}</span></li>
                </ul>
                <a href="animal-description.html" class="btn">Learn more</a>
            </div>
            <div class="fav-button">
              <label class="fav-container">
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
    for(let i=animalsPage.length-1; i>=0; i--){
        createAnimal(animalList, animalsPage[i]);
    }
}


const createPagination = function (nrPages, currentPage, pagesList, posForDots) {
    
    const pagination = document.querySelector('.pagination');
    
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



showAnimals(animalList, animals, 1, 10);
console.log(animals.length);
let nrPages = Math.ceil(animals.length / 10);
console.log(nrPages);
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
