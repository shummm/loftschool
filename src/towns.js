/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');
let townsPromise;

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    let loader = {
        promise: null,
        load() {
            if (this.promise) {
                return this.promise;
            }

            let result = [];

            this.promise = new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();

                xhr.open('get', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        result = JSON.parse(xhr.response);
                        result.sort((a, b) => {
                            if (a.name > b.name) {
                                return 1;
                            }
                            if (a.name < b.name) {
                                return -1;
                            }

                            return 0;
                        });
                        resolve(result);
                    } else {
                        reject();
                    }
                });
                xhr.send();
            });
            this.promise.then(response => {
                loadingBlock.style.display = 'none';
                filterBlock.style.display = 'block';

                return response;
            }).catch(() => {
                let button = document.createElement('button');

                loadingBlock.style.display = 'none';
                button.textContent = 'Reload';
                homeworkContainer.appendChild(button);
                button.addEventListener('click', () => window.location.reload())
            });

            return this.promise;
        }
    };

    return loader.load();
}

townsPromise = loadTowns();

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    let result = [];

    chunk = chunk.toLowerCase();
    full.forEach((town) => {
        if (town.toLowerCase().includes(chunk)) {
            result.push(town);
        }
    });

    return result;
}

let towns = [];

townsPromise.then((arr) => {

    arr.forEach((obj, i) => {
        towns[i] = obj.name;
    });

});

filterInput.addEventListener('keyup', function (e) {
    let chunk = e.target.value;
    let filterTowns = isMatching(towns, chunk);
    let ul = document.createElement('ul');

    if (filterBlock.children.length > 0) {
        for (let i = 0; i < filterBlock.children.length; i++) {
            let el = filterBlock.children[i];

            if (el.tagName === 'UL') {
                el.remove();
            }
        }
    }
    if (chunk.length > 0) {
        filterBlock.appendChild(ul);
        if (filterTowns.length > 0) {
            filterTowns.forEach((town) => {
                let li = document.createElement('li');

                li.textContent = town;
                ul.appendChild(li);
            })
        }
    }
});

export {
    loadTowns,
    isMatching
};
