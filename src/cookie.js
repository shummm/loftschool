/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');
// let addBlock = homeworkContainer.querySelector('#add-block');

let result = [];

function rendering(arr) {
    if (result.length > 0) {
        if (listTable.children.length > 0) {
            let remNode = listTable.querySelectorAll('TR');

            remNode.forEach(el => el.remove());
        }
        if (filterNameInput.value.length === 0) {
            view(result);
        } else if (filterNameInput.value.length > 0) {
            let chunk = filterNameInput.value;
            let r = isMatching(chunk);

            view(r);
        } else if (arr) {
            view(arr);
        }
    }
}

function view(arrResult) {
    if (arrResult instanceof Array && arrResult.length > 0) {
        arrResult.forEach(obj => {
            let button = document.createElement('button');

            button.textContent = 'Remove';
            let newRow = listTable.insertRow(0);
            let newCell = newRow.insertCell(0);

            newCell.textContent = obj.name;
            newCell = newRow.insertCell(1);
            newCell.textContent = obj.value;
            newCell = newRow.insertCell(2);
            newCell.appendChild(button);
        });
    }
}

function cookieInResult() {
    result = [];

    let arrCookie = document.cookie.split('; ');

    arrCookie.forEach(ck => {
        let item = ck.split('=');
        let obj = {};

        if (item[0] !== '') {
            obj.name = item[0];
            obj.value = item[1];
            result.push(obj);
        }
    });
    rendering();
}

function createCookie() {
    let name = addNameInput.value;
    let value = addValueInput.value;

    document.cookie = `${name} = ${value}`;
    cookieInResult();
    addNameInput.value = '';
    addValueInput.value = '';
}

function isMatching(chunk) {
    let arrSort = [];

    result.forEach(obj => {
        if (obj.name.includes(chunk)) {
            arrSort.push(obj);
        }
    });

    return arrSort;
}

function deleteCookie(name, value) {
    let date = new Date();
    let idx = result.indexOf(name);

    if (idx !== -1) {
        result.splice(idx, 1);
    }
    date.setTime(date.getTime() - 1);
    document.cookie = `${name}=${value}; expires=${date.toGMTString()}`;
}

addButton.addEventListener('click', () => {
    createCookie();
});

filterNameInput.addEventListener('keyup', function (e) {
    let chunk = e.target.value;
    let resultSort = isMatching(chunk);

    rendering(resultSort);
});

listTable.addEventListener('click', (e) => {
    let buttons = listTable.querySelectorAll('button');

    buttons.forEach(button => {
        if (button === e.target) {
            e.target.parentNode.parentNode.remove();
            let name = e.target.parentNode.parentNode.firstChild.textContent;
            let value = e.target.parentNode.parentNode.firstChild.nextSibling.textContent;

            deleteCookie(name, value);
        }
    });
    cookieInResult();
});
document.addEventListener('DOMContentLoaded', () => {
    cookieInResult();
});
