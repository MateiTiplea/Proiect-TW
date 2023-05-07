const categButtons = document.querySelectorAll('.settings--categories-link');
const settingsPanels = document.querySelectorAll('.settings-panel');

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

const logoutBtn = document.querySelector('.logout');
const logoutEvent = function () {
    localStorage.clear();
    localStorage.setItem('logged', false);
    window.location.href = 'index.html';
}

logoutBtn.addEventListener('click', logoutEvent);

//Dark mode
const darkModeBtn = document.querySelectorAll('.btn');
const isDarkMode = localStorage.getItem('darkMode');
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

darkModeBtn[0].addEventListener('click', function () {
    darkModeBtn[0].classList.remove('btn-light');
    darkModeBtn[0].classList.add('btn-full');
    darkModeBtn[1].classList.remove('btn-full');
    darkModeBtn[1].classList.add('btn-light');
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', true);
}
);

darkModeBtn[1].addEventListener('click', function () {
    darkModeBtn[0].classList.remove('btn-full');
    darkModeBtn[0].classList.add('btn-light');
    darkModeBtn[1].classList.remove('btn-light');
    darkModeBtn[1].classList.add('btn-full');
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', false);
}
);

