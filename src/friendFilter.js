let filterBlock = document.querySelector('.filter-block');
let resultBlock = document.getElementById('result');
let input = document.querySelector('.filter-friends input');
let inputList = document.querySelector('.filter-sort input');
let content = document.querySelector('.content');
let resultListBlock = document.querySelector('#result-list');
let save = document.querySelector('#save');

let allFriends = [];
let filterFriends = [];
let listFriends = [];
let filterListFriends = [];

/*Получение друзей из VK*/
VK.init({
    apiId: 6320026
});

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 6);
    });
}

function callAPI(method, params) {
    params.v = '5.69';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    })
}

(async function friends() {
    try {
        await auth();

        const friends = await callAPI('friends.get', {fields: 'photo_50'});

        friends.items.forEach(item => {
            allFriends.push(item);
        });
        if (localStorage.data) {
                let data = JSON.parse(localStorage.data);
                data.forEach(e => {
                    let match = `${e.last_name} ${e.first_name}`;

                    moveFriendToArray(allFriends, filterFriends, listFriends, filterListFriends, match);
                });
            renderList(listFriends);
            }
        render(allFriends);
    } catch (e) {
        console.error(e);
    }
})();

/*Сортировать по фамилии*/
function sortLastName(val) {
    val.sort(function (a, b) {
        if (a.last_name > b.last_name) {
            return 1;
        }
        if (a.last_name < b.last_name) {
            return -1;
        }

        return 0;
    });
}

/*Проверка на совпадение и добавление в массив*/
function isMatching(full, chunk) {
    if (input.value.length > 0) {
        filterFriends = [];
        chunk = chunk.toLowerCase();
        full.forEach(item => {
            let friend = {
                name: '',
                lastName: '',
                avatar: ''
            };
            friend.first_name = `${item.first_name}`;
            friend.id = `${item.id}`;
            friend.last_name = `${item.last_name}`;
            friend.photo_50 = `${item.photo_50}`;

            if (friend.first_name.toLowerCase().includes(chunk) || friend.last_name.toLowerCase().includes(chunk)) {
                filterFriends.push(friend);
            }
        });
    } else {
        filterFriends = [];
    }
}

function isMatchingList(full, chunk) {
    if (inputList.value.length > 0) {
        filterListFriends = [];
        chunk = chunk.toLowerCase();

        full.forEach(item => {
            let friend = {
                name: '',
                lastName: '',
                avatar: ''
            };
            friend.first_name = `${item.first_name}`;
            friend.id = `${item.id}`;
            friend.last_name = `${item.last_name}`;
            friend.photo_50 = `${item.photo_50}`;

            if (friend.first_name.toLowerCase().includes(chunk) || friend.last_name.toLowerCase().includes(chunk)) {
                filterListFriends.push(friend);
            }
        });
    } else {
        filterListFriends = [];
    }
}

/*Шаблон для вставки элемента DOM в #result*/
function friendTemplate(arr) {
    resultBlock.innerHTML = '';

    for (let i = 0; i < arr.length; i++) {
        let friendBlock = document.createElement('div');
        let img = document.createElement('img');
        let p = document.createElement('p');
        let icon = document.createElement('i');

        if (arr[i].online === 1) {
            friendBlock.setAttribute('class', 'friends-block');
            friendBlock.setAttribute('draggable', 'true');
            resultBlock.appendChild(friendBlock);
            img.setAttribute('class', 'avatar');
            img.style.boxShadow = '0 0 7px red';
            img.setAttribute('src', `${arr[i].photo_50}`);
            friendBlock.appendChild(img);

            p.setAttribute('id', 'fullName');
            friendBlock.appendChild(p);
            p.textContent = `${arr[i].last_name} ${arr[i].first_name}`;

            icon.setAttribute('class', 'fa fa-plus fa-lg');
            p.appendChild(icon);
        } else {
            friendBlock.setAttribute('class', 'friends-block');
            friendBlock.setAttribute('draggable', 'true');
            resultBlock.appendChild(friendBlock);
            img.setAttribute('class', 'avatar');
            img.setAttribute('src', `${arr[i].photo_50}`);
            friendBlock.appendChild(img);

            p.setAttribute('id', 'fullName');
            friendBlock.appendChild(p);
            p.textContent = `${arr[i].last_name} ${arr[i].first_name}`;

            icon.setAttribute('class', 'fa fa-plus fa-lg');
            p.appendChild(icon);
        }
    }
}

function friendTemplateList(arr) {
    resultListBlock.innerHTML = '';
    for (let i = 0; i < arr.length; i++) {
        let friendBlock = document.createElement('div');
        let img = document.createElement('img');
        let p = document.createElement('p');
        let icon = document.createElement('i');

        friendBlock.setAttribute('class', 'friends-block');
        resultListBlock.appendChild(friendBlock);
        img.setAttribute('class', 'avatar');
        img.setAttribute('src', `${arr[i].photo_50}`);
        friendBlock.appendChild(img);
        p.setAttribute('id', 'fullName');
        friendBlock.appendChild(p);
        p.textContent = `${arr[i].last_name} ${arr[i].first_name}`;

        icon.setAttribute('class', 'fa fa-times fa-lg');
        p.appendChild(icon);
    }
}

/*Рендеринг относительно входного массива*/
function render(arr) {
    sortLastName(arr);
    if (input.value.length > 0) {
        friendTemplate(arr);
    } else if (input.value.length === 0) {
        friendTemplate(allFriends);
    }
}

function renderList(arr) {
    sortLastName(arr);
    if (inputList.value.length > 0) {
        friendTemplateList(arr);
    } else if (inputList.value.length === 0) {
        friendTemplateList(listFriends);
    }
}

/*Перемешение элементов из массива в массив*/
function moveFriendToArray(fromAll, fromFilter, toList, toFilter, isMatch) {
    fromAll.forEach(el => {
        if (`${el.last_name} ${el.first_name}` === isMatch) {
            let idx = fromAll.indexOf(el);
            let idxx = fromFilter.indexOf(el);
            toList.push(fromAll[idx]);
            let str = `${fromAll[idx].last_name} ${fromAll[idx].first_name}`.toLowerCase().split('');
            if (inputList.value.length > 0 && str.includes(inputList.value)) {
                toFilter.push(fromAll[idx]);
            }
            if (idx !== -1) {
                fromAll.splice(idx, 1);
                fromFilter.splice(idxx, 1);
            }
        }
    });
}

/*Установка события на кнопку*/
filterBlock.addEventListener('keyup', e => {
    if (input === e.target) {
        let chunk = e.target.value;

        isMatching(allFriends, chunk);
        render(filterFriends);
    }
    if (inputList === e.target) {
        let chunk = e.target.value;
        isMatchingList(listFriends, chunk);
        renderList(filterListFriends);
    }
});

/*Установка события на добавление или удаления из списка друзей*/
content.addEventListener('click', e => {
    if (e.target.className === 'fa fa-plus fa-lg') {
        e.target.className = 'fa fa-times fa-lg';
        let match = event.target.parentNode.textContent;
        moveFriendToArray(allFriends, filterFriends, listFriends, filterListFriends, match)
    } else if (e.target.className === 'fa fa-times fa-lg') {
        e.target.className = 'fa fa-plus fa-lg';
        let match = event.target.parentNode.textContent;
        moveFriendToArray(listFriends, filterListFriends, allFriends, filterFriends, match)
    }
    if (inputList.value.length > 0) {
        renderList(filterListFriends);
    } else {
        renderList(listFriends);
    }
    if (input.value.length > 0) {
        render(filterFriends);
    } else {
        render(allFriends);
    }
});

/*d&d друзей*/
content.addEventListener('dragstart', e => {
    if (e.target.className === 'friends-block') {
        let chunk = e.target.lastChild.textContent;

        if (input.value.length > 0) {
        } else {
            allFriends.forEach(el => {
                let str = `${el.last_name} ${el.first_name}`;

                if (str === chunk) {
                    e.dataTransfer.setData("text/plain", str);
                    e.dataTransfer.effectAllowed = "move";
                }
            })
        }
    }
});
content.addEventListener('dragenter', e => {
    e.preventDefault();
});
content.addEventListener('dragover', e => {
    e.preventDefault();
});
content.addEventListener('drop', e => {
    e.preventDefault();
    let data = e.dataTransfer.getData("text/plain");
    if (input.value.length > 0) {
        filterFriends.forEach(el => {
            let str = `${el.last_name} ${el.first_name}`;

            if (str === data) {
                moveFriendToArray(allFriends, filterFriends, listFriends, filterListFriends, data);
            }
        })
    } else {
        allFriends.forEach(el => {
            let str = `${el.last_name} ${el.first_name}`;

            if (str === data) {
                moveFriendToArray(allFriends, filterFriends, listFriends, filterListFriends, data);
            }
        })
    }
    if (inputList.value.length > 0) {
        renderList(filterListFriends);
    } else {
        renderList(listFriends);
    }
    if (input.value.length > 0) {
        render(filterFriends);
    } else {
        render(allFriends);
    }
});

// /*Сохранение в localStorage*/
save.addEventListener('click', () => {
    localStorage.clear();
    if (listFriends.length > 0) {
        localStorage.data = JSON.stringify(listFriends);
    }
    alert ('Сохранено');
});