'use strict';

const mobileNav = document.querySelector('.btn-mobile-nav');
const header = document.querySelector('.header');
const accountButton = document.querySelector('.nav-cta');
const userToken = localStorage.getItem('token');
const isLogged = localStorage.getItem('logged');
const searchBar = document.querySelector('.search-bar');

if(isLogged !== null && userToken !== null) {
    if(isLogged === 'true') {
        accountButton.textContent = 'Account';
    }
    else{
        accountButton.textContent = 'Login';
    }
} else{
    accountButton.textContent = 'Login';
}

const openMobileNav = function () {
  header.classList.add('nav-open');
}

const closeMobileNav = function () {
  header.classList.remove('nav-open');
}

mobileNav.addEventListener('click', function () {
    const navOpen = header.classList.contains('nav-open');
    if (navOpen) {
        closeMobileNav();
    } else {
        openMobileNav();
    }
});


const accountEvent = function () {
  if (isLogged !== null && userToken !== null) {
    if(isLogged === 'true') {
      window.location.href = '/account';
    }
    else{
      window.location.href = '/login';
    }
  }
  else{
    window.location.href = '/login';
  }
}

accountButton.addEventListener('click', accountEvent);

const searchEvent = function () {
    const searchValue = searchBar.value;
    if(searchValue === '')
        return;
    localStorage.setItem('search', searchValue);
    window.location.href = '/animals';
}

searchBar.addEventListener('keypress', function (e) {
    if(e.key === 'Enter')
        searchEvent();
});