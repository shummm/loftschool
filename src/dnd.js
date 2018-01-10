/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 * Запрощено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

import {randomNumber} from '../helper';

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function createDiv() {
    let div = document.createElement('DIV');

    function randomColor(min, max) {
        let arr = ['coral', 'black', 'yellow', 'blue', 'red', 'silver', 'grey', 'white', 'pink', 'smoke'];
        let numb = Math.floor(Math.random() * (max - min)) + min;

        for (let i = 0; i < arr.length; i++) {
            if (i === numb) {

                return arr[i];
            }
        }
    }

    function randomNumber(min = 0, max = 100) {

        return Math.round((max - min) * Math.random()) + min;
    }

    div.setAttribute('class', 'draggable-div');
    div.setAttribute('draggable', 'true');
    div.setAttribute('id', 'element_' + randomNumber());
    div.style.backgroundColor = randomColor(0, 9);
    div.style.position = 'absolute';
    div.style.width = randomNumber() + 'px';
    div.style.height = randomNumber() + 'px';
    div.style.top = randomNumber() + 'px';
    div.style.left = randomNumber() + '1px';

    return div;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
function addListeners(target) {
    // target.addEventListener('dragend', function (e) {
    //     e.preventDefault();
    //
    //     e.target.style.left = e.clientX+'px';
    //     e.target.style.top = e.clientY+'px';
    // })

    function getCoords(elem) {
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        }
    }

    target.addEventListener('mousedown', function (e) {
        var shiftX = e.pageX - getCoords(target).left,
            shiftY = e.pageY - getCoords(target).top;
        move(e);

        function move(e) {
            target.style.left = e.pageX - shiftX + 'px';
            target.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function (e) {
            move(e);
        };
        target.addEventListener('mouseup', function () {
            document.onmousemove = null;
            target.onmouseup = null;
        });
        target.ondragstart = function () {

            return false;
        }
    })
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
    // создать новый div
    let div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации d&d
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
