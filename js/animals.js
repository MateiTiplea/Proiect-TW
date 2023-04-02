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