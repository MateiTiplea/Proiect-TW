'use strict';

const isDarkMode = localStorage.getItem('darkMode');
if(isDarkMode === 'true') {
    document.body.classList.add('dark-mode');
}
else {
    document.body.classList.remove('dark-mode');
}

