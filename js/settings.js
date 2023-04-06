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