'use strict';

const mobileNav = document.querySelector('.btn-mobile-nav');
const header = document.querySelector('.header');

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


const accountButton = document.querySelector('.nav-cta');

const accountEvent = function () {
  const isLogged = localStorage.getItem('logged');
  if (isLogged) {
    if(isLogged === 'true') {
      window.location.href = 'account_settings.html';
    }
    else{
      window.location.href = 'login.html';
    }
  }
  else{
    window.location.href = 'login.html';
  }
}

accountButton.addEventListener('click', accountEvent);