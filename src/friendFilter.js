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
        if (localStorage.getItem('data')) {
            let data = JSON.parse(localStorage.getItem('data'));

            data.forEach(el => {
                let dataName = `${el.last_name} ${el.first_name}`;

                listFriends.push(el);
                allFriends.forEach(elm => {
                    let name = `${elm.last_name} ${elm.first_name}`;

                    if (dataName === name) {
                        let idx = allFriends.indexOf(elm);

                        if (idx !== 1) {
                            allFriends.splice(idx, 1);
                        }
                    }
                })
            });

        }
        render(allFriends, filterFriends, listFriends, filterListFriends);
    } catch (e) {
        console.error(e);
    }
})();

/*Проверка на совпадение и добавление в массив*/
function isMatching(full, chunk) {
    if (chunk.value.length > 0) {
        if (chunk.name === 'filter-left') {
            chunk = chunk.value.toLowerCase();
            filterFriends = [];
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

                if (friend.first_name.toLowerCase().includes(chunk) || friend.last_name.toLowerCase().includes(chunk) || `${friend.first_name.toLowerCase()} ${friend.last_name.toLowerCase()}`.includes(chunk) || `${friend.last_name.toLowerCase()} ${friend.first_name.toLowerCase()}`.includes(chunk)) {
                    filterFriends.push(friend);
                }
            });
        }
        if (chunk.name === 'filter-right') {
            filterListFriends = [];
            chunk = chunk.value.toLowerCase();
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
                if (friend.first_name.toLowerCase().includes(chunk) || friend.last_name.toLowerCase().includes(chunk) || `${friend.first_name.toLowerCase()} ${friend.last_name.toLowerCase()}`.includes(chunk) || `${friend.last_name.toLowerCase()} ${friend.first_name.toLowerCase()}`.includes(chunk)) {
                    filterListFriends.push(friend);
                }
            });
        }
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
        friendBlock.setAttribute('draggable', 'true');
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

function render(allFriends, filterFriends, listFriends, filterListFriends) {
    if (input.value.length > 0) {
        friendTemplate(filterFriends);
    } else {
        friendTemplate(allFriends);
    }
    if (inputList.value.length > 0) {
        friendTemplateList(filterListFriends);
    } else {
        friendTemplateList(listFriends);
    }
}

/*Установка события на кнопку*/
filterBlock.addEventListener('keyup', e => {
    if (input === e.target) {
        let chunk = e.target;

        isMatching(allFriends, chunk);
    }
    if (inputList === e.target) {
        let chunk = e.target;

        isMatching(listFriends, chunk);
    }

    render(allFriends, filterFriends, listFriends, filterListFriends);
});

/*Установка события на добавление или удаления из списка друзей*/
content.addEventListener('click', e => {
    let col = e.target.parentNode.parentNode.parentNode;

    if (col.getAttribute('id') === 'result') {
        if (e.target.className === 'fa fa-plus fa-lg') {
            e.target.className = 'fa fa-times fa-lg';
            let nameFriendSend = e.target.parentNode.textContent;

            if (input.value.length > 0 && inputList.value.length === 0) {
                filterFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = filterFriends.indexOf(el);

                        listFriends.push(filterFriends[idx]);
                        if (idx !== -1) {
                            filterFriends.splice(idx, 1);
                        }
                    }
                });
                allFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = allFriends.indexOf(el);

                        if (idx !== -1) {
                            allFriends.splice(idx, 1);
                        }
                    }
                });
            } else if (input.value.length === 0 && inputList.value.length > 0) {
                allFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = allFriends.indexOf(el);

                        listFriends.push(allFriends[idx]);

                        if (idx !== -1) {
                            allFriends.splice(idx, 1);
                        }
                    }
                });

                isMatching(listFriends, inputList);

            } else if (input.value.length === 0 && inputList.value.length === 0) {
                allFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = allFriends.indexOf(el);

                        listFriends.push(allFriends[idx]);

                        if (idx !== -1) {
                            allFriends.splice(idx, 1);
                        }
                    }
                });
            } else if (input.value.length > 0 && inputList.value.length > 0) {
                filterFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = allFriends.indexOf(el);
                        let idxx = filterFriends.indexOf(el);

                        listFriends.push(filterFriends[idxx]);

                        if (idx !== -1) {
                            allFriends.splice(idx, 1);
                        }
                        if (idxx !== -1) {
                            filterFriends.splice(idxx, 1);
                        }
                    }
                });
                allFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = allFriends.indexOf(el);

                        if (idx !== -1) {
                            allFriends.splice(idx, 1);
                        }
                    }
                });

                isMatching(listFriends, inputList);

            }
        }
    } else if (col.getAttribute('id') === 'result-list') {
        if (e.target.className === 'fa fa-times fa-lg') {
            e.target.className = 'fa fa-plus fa-lg';
            let nameFriendSend = e.target.parentNode.textContent;

            if (input.value.length === 0 && inputList.value.length > 0) {
                filterListFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = filterListFriends.indexOf(el);

                        allFriends.push(filterListFriends[idx]);

                        if (idx !== -1) {
                            filterListFriends.splice(idx, 1);
                        }
                    }
                });

                listFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = listFriends.indexOf(el);

                        if (idx !== -1) {
                            listFriends.splice(idx, 1);
                        }
                    }
                });

                isMatching(allFriends, input);

            } else if (input.value.length > 0 && inputList.value.length === 0) {
                listFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = listFriends.indexOf(el);

                        allFriends.push(listFriends[idx]);

                        if (idx !== -1) {
                            listFriends.splice(idx, 1);
                        }
                    }
                });

                isMatching(allFriends, input);

            } else if (input.value.length === 0 && inputList.value.length === 0) {
                listFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = listFriends.indexOf(el);

                        allFriends.push(listFriends[idx]);
                        if (idx !== -1) {
                            listFriends.splice(idx, 1);
                        }
                    }
                });

            } else if (input.value.length > 0 && inputList.value.length > 0) {
                filterListFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = filterListFriends.indexOf(el);

                        allFriends.push(filterListFriends[idx]);

                        if (idx !== -1) {
                            filterListFriends.splice(idx, 1);
                        }
                    }
                });
                listFriends.forEach(el => {
                    let fullName = `${el.last_name} ${el.first_name}`;

                    if (fullName === nameFriendSend) {
                        let idx = listFriends.indexOf(el);

                        if (idx !== -1) {
                            listFriends.splice(idx, 1);
                        }
                    }
                });

                isMatching(allFriends, input);

            }
        }
    }

    render(allFriends, filterFriends, listFriends, filterListFriends);

});

/*d&d друзей*/
let dragableBlock;

content.addEventListener('dragstart', e => {
    if (e.target.className === 'friends-block' && e.target.parentNode.getAttribute('id') === 'result') {
        dragableBlock = e.target.parentNode.parentNode.className;
        let nameFriend = e.target.lastChild.textContent;

        e.target.style.opacity = .5;

        if (input.value.length > 0) {
            filterFriends.forEach(el => {
                if (`${el.last_name} ${el.first_name}` === nameFriend) {
                    e.dataTransfer.setData("text/plain", JSON.stringify(el));
                    e.dataTransfer.effectAllowed = "move";
                }
            });
        } else {
            allFriends.forEach(el => {
                if (`${el.last_name} ${el.first_name}` === nameFriend) {
                    e.dataTransfer.setData("text/plain", JSON.stringify(el));
                    e.dataTransfer.effectAllowed = "move";
                }
            });
        }
    } else if (e.target.className === 'friends-block' && e.target.parentNode.getAttribute('id') === 'result-list') {
        dragableBlock = e.target.parentNode.parentNode.className;
        let nameFriend = e.target.lastChild.textContent;

        e.target.style.opacity = .5;

        if (inputList.value.length > 0) {
            filterListFriends.forEach(el => {
                if (`${el.last_name} ${el.first_name}` === nameFriend) {
                    e.dataTransfer.setData("text/plain", JSON.stringify(el));
                    e.dataTransfer.effectAllowed = "move";
                }
            });
        } else {
            listFriends.forEach(el => {
                if (`${el.last_name} ${el.first_name}` === nameFriend) {
                    e.dataTransfer.setData("text/plain", JSON.stringify(el));
                    e.dataTransfer.effectAllowed = "move";
                }
            });
        }
    }
}, false);
content.addEventListener("dragend", e => {
    e.target.style.opacity = "";
}, false);
content.addEventListener('dragenter', e => {
    e.preventDefault();
}, false);
content.addEventListener('dragover', e => {
    e.preventDefault();
}, false);
content.addEventListener('drop', e => {
    e.preventDefault();
    let data = JSON.parse(e.dataTransfer.getData("text/plain"));
    let nameFriendSend = `${data.last_name} ${data.first_name}`;

    if (e.target.className === 'friend-sorted' && dragableBlock === 'friend-list') {
        if (input.value.length > 0 && inputList.value.length === 0) {
            listFriends.push(data);
            allFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = allFriends.indexOf(el);

                    if (idx !== -1) {
                        allFriends.splice(idx, 1);
                    }
                }
            });
            filterFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = filterFriends.indexOf(el);

                    if (idx !== -1) {
                        filterFriends.splice(idx, 1);
                    }
                }
            });
        } else if (input.value.length === 0 && inputList.value.length === 0) {
            listFriends.push(data);
            allFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = allFriends.indexOf(el);

                    if (idx !== -1) {
                        allFriends.splice(idx, 1);
                    }
                }
            });
        } else if (input.value.length === 0 && inputList.value.length > 0) {
            listFriends.push(data);
            allFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = allFriends.indexOf(el);

                    if (idx !== -1) {
                        allFriends.splice(idx, 1);
                    }
                }
            });

            isMatching(listFriends, inputList)

        } else if (input.value.length > 0 && inputList.value.length > 0) {
            listFriends.push(data);
            allFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = allFriends.indexOf(el);

                    if (idx !== -1) {
                        allFriends.splice(idx, 1);
                    }
                }
            });
            filterFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = filterFriends.indexOf(el);

                    if (idx !== -1) {
                        filterFriends.splice(idx, 1);
                    }
                }
            });

            isMatching(listFriends, inputList);

        }
    } else if (e.target.className === 'friend-list' && dragableBlock === 'friend-sorted') {
        if (inputList.value.length > 0 && input.value.length === 0) {
            allFriends.push(data);
            listFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = listFriends.indexOf(el);

                    if (idx !== -1) {
                        listFriends.splice(idx, 1);
                    }
                }
            });
            filterListFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = filterListFriends.indexOf(el);

                    if (idx !== -1) {
                        filterListFriends.splice(idx, 1);
                    }
                }
            });
        } else if (inputList.value.length === 0 && input.value.length === 0) {
            allFriends.push(data);
            listFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = listFriends.indexOf(el);

                    if (idx !== -1) {
                        listFriends.splice(idx, 1);
                    }
                }
            });
        } else if (inputList.value.length === 0 && input.value.length > 0) {
            allFriends.push(data);
            listFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = listFriends.indexOf(el);

                    if (idx !== -1) {
                        listFriends.splice(idx, 1);
                    }
                }
            });

            isMatching(allFriends, input);

        } else if (inputList.value.length > 0 && input.value.length > 0) {
            allFriends.push(data);
            listFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = listFriends.indexOf(el);

                    if (idx !== -1) {
                        listFriends.splice(idx, 1);
                    }
                }
            });
            filterListFriends.forEach(el => {
                let fullName = `${el.last_name} ${el.first_name}`;

                if (fullName === nameFriendSend) {
                    let idx = filterListFriends.indexOf(el);

                    if (idx !== -1) {
                        filterListFriends.splice(idx, 1);
                    }
                }
            });

            isMatching(allFriends, input);

        }
    }

    render(allFriends, filterFriends, listFriends, filterListFriends);

}, false);

// /*Сохранение в localStorage*/
save.addEventListener('click', () => {
    if(localStorage.getItem('data')){
        localStorage.removeItem('data')
    }
    if (listFriends.length > 0) {
        localStorage.setItem('data', JSON.stringify(listFriends));
    }
    alert('Сохранено');
});