'use strict';

const favContainer = document.querySelector('.fav-container input');
const titleContainer = document.querySelector('.title-container');
const animalName = titleContainer.querySelector('h1').textContent;
const animalImg = document.querySelector('.photo');
const commentSubmit = document.querySelector('.comment-submit');
const commentTextarea = document.querySelector('.comment-textarea');
const stars = document.querySelectorAll('[id^=star]');
const ratingAvg = document.querySelector('.rating-average');
const mapImg = document.querySelector('.map-photo');


const getAnimalImg = function (id) {
    return `http://localhost:3000/api/animals/${id}/photo`;
};

const getAnimalData = async () => {
    const response = await fetch(`http://localhost:3000/api/animals/${animalName}`, {
        method: 'GET'
    });
    return await response.json();
};

const getFavorites = async () => {
    return fetch('http://localhost:3000/api/users/favorites', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => {
        if(!response.ok){
            alert('Error getting user favourites');
            return;
        }
        return response.json();
    });
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

getAnimalData().then((animal) => {
    if(animal.origin === 'North America'){
        mapImg.src = '/images/maps/North_America.png';
    } else if(animal.origin === 'South America'){
        mapImg.src = '/images/maps/South_America.png';
    } else {
        mapImg.src = `/images/maps/${animal.origin}.png`;
    }
    animalImg.src = getAnimalImg(animal.id);
    if(localStorage.getItem('token')){
        getFavorites().then((data) => {
            const fav = data.data.favorites;
            if(fav){
                fav.forEach((fav) => {
                    if(fav.name === animal.name){
                        favContainer.checked = true;
                    }
                });
            }
        })
    }
    favContainer.addEventListener('change', function () {
        const usersToken = localStorage.getItem('token');
        if(usersToken){
            if(!favContainer.checked){
                removeFavorite(usersToken, animal.id).then(function () {
                    alert('Animal removed from favourites');
                }).catch(function () {
                    alert('Error removing animal from favourites');
                    favContainer.checked = true;
                });
            } else {
                addAnimalToFavourites(usersToken, animal.id).then(function () {
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
})

const addComment = async function() {
    const usersToken = localStorage.getItem('token');
    if(!usersToken){
        alert('You need to log in to add a comment');
        return;
    }
    const comment = commentTextarea.value;
    if(!comment){
        alert('You need to write a comment');
        return;
    }
    const reqBody = {
        comment
    };
    const currentAnimal = await getAnimalData();
    const response = await fetch(`http://localhost:3000/api/animals/${currentAnimal.id}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usersToken}`
        },
        body: JSON.stringify(reqBody)
    });
    if(response.status !== 204){
        alert('Error adding comment');
        return;
    }
    alert('Comment added');
    window.location.reload();
};

commentSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    await addComment();
})

const getUserRating = async function () {
    const usersToken = localStorage.getItem('token');
    if(!usersToken){
        return;
    }
    const currentAnimal = await getAnimalData();
    const response = await fetch(`http://localhost:3000/api/animals/${currentAnimal.id}/myRating`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usersToken}`
        }
    });
    if(!response.ok){
        return;
    }
    const data = await response.json();
    return data.data.rating;
};

const getAnimalRating = async function () {
    const currentAnimal = await getAnimalData();
    const response = await fetch(`http://localhost:3000/api/animals/${currentAnimal.id}/rating`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(!response.ok){
        return;
    }
    const data = await response.json();
    return {
        rating: data.rating,
        count: data.numberRatings
    };
};

const setRating = async function (action, rating) {
    const usersToken = localStorage.getItem('token');
    if(!usersToken){
        alert('You need to log in to rate an animal');
        return;
    }
    const currentAnimal = await getAnimalData();
    const response = await fetch(`http://localhost:3000/api/animals/${currentAnimal.id}/rating`, {
        method: action,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usersToken}`
        },
        body: JSON.stringify({
            rating
        })
    });
    if(!response.ok){
        alert('Error adding rating');
        return;
    }
    alert('Rating added');
};

const setRatingStars = async function () {
    const usersToken = localStorage.getItem('token');
    if(!usersToken){
        stars.forEach((star) => {
            star.checked = false;
            star.disabled = true;
        });
        return;
    }
    const userRating = await getUserRating();
    if(!userRating){
        stars.forEach((star) => {
            star.checked = false;
        });
        return;
    }
    // check the star that corresponds to the user rating
    stars[5 - userRating].checked = true;
}

const updateRatingAvg = async function () {
    const animalRating = await getAnimalRating();
    if(!animalRating){
        ratingAvg.textContent = 'No ratings yet';
        return;
    }
    ratingAvg.innerText = `Rating: ${animalRating.rating} (${animalRating.count})`;
}

setRatingStars().then(() => {
    console.log('Rating stars set');
    updateRatingAvg().then(() => {
        console.log('Rating average updated');
    });
});

stars.forEach((star) => {
    star.addEventListener('change', async (e) => {
        const rating = e.target.value;
        const usersToken = localStorage.getItem('token');
        if(!usersToken){
            alert('You need to log in to rate an animal');
            return;
        }
        const userRating = await getUserRating();
        if(userRating){
            if(userRating === rating){
                alert('You already rated this animal');
                return;
            }
            await setRating('PUT', rating);
        }
        else{
            await setRating('POST', rating);
        }
        window.location.reload();
    });
});

