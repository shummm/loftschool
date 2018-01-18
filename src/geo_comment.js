ymaps.ready(init);

let myMap,
    iAm =[],
    myPlacemark,
    coords,
    points = [],
    clusterer,
    map = document.querySelector('#map'),
    popup = document.querySelector('#popup'),
    message = document.querySelector('.message-block'),
    address = document.querySelector('#address'),
    inputName = document.querySelector('.feedback-author input'),
    inputPlace = document.querySelector('.feedback-place input'),
    inputText = document.querySelector('.feedback-text textarea'),
    buttonClose = document.querySelector('#close'),
    buttonAdd = document.querySelector('#add');

function init() {
    myMap = new ymaps.Map("map", {
        center: [55.7522222, 37.6155556],
        zoom: 13
    }, {
        searchControlProvider: 'yandex#search'
    });

    /*Определение моего места нахождения*/
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            let lat = pos.coords.latitude;
            let lng = pos.coords.longitude;
            iAm = [lat, lng];
                myMap.geoObjects
                .add(new ymaps.Placemark(iAm, {
                    iconContent: '<strong>Я</strong>'
                }, {
                    preset: 'islands#blackStretchyIcon',
                    iconColor: '#0095b6'
                }));
        });
    }

    /*Метод создание кластера*/
    clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 5
    });
    clusterer.add(points);
    myMap.geoObjects.add(clusterer);

    /*Обработка клика по карте*/
    myMap.events.add('click', function (e) {
        coords = e.get('coords');
        message.innerHTML = 'Добавте свой первый комментарий';

        if (myMap.balloon.isOpen()) {
            myMap.balloon.close();
        }

        popupOpen();
        if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
        } else {
            myPlacemark = createPlacemark(coords);
        }

        getAddress(coords);
    });

    /*Создание метки*/
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {}, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: false
        });
    }

    /*Определяем адрес по координатам (обратное геокодирование).*/
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            let firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                  /*Формируем строку с данными об объекте.*/
                    iconCaption: [
                       /*Название населенного пункта или вышестоящее административно-территориальное образование.*/
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        /*Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.*/
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                  /*В качестве контента балуна задаем строку с адресом объекта.*/
                    balloonContent: firstGeoObject.getAddressLine()
                });
            /*Записываем адресс обьекта в хедер окна.*/
            address.textContent = firstGeoObject.getAddressLine();
        });
    }

    /*Дабавляем данные при нажатии на кнопку*/
    buttonAdd.addEventListener('click', function () {
        if (inputName.value.length > 0 && inputPlace.value.length > 0 && inputText.value.length > 0) {

            let addressLink = address.textContent;
            let newPlacemark = new ymaps.Placemark(coords, {
                balloonContentHeader: inputPlace.value,
                balloonContentBody: `<div class="popup-link"><a onclick="popupOpenFull()" >${addressLink}</a><p>${inputText.value}</p></div>`,
                balloonContentFooter: now()
            }, {
                preset: 'islands#violetDotIconWithCaption',
                draggable: false,
                openBalloonOnClick: false
            });

            myMap.geoObjects.add(newPlacemark);
            clusterer.add(newPlacemark);
            points.push(newPlacemark);
            console.log(points);
            /*Шаблон сообщения*/
            if (message.textContent === 'Добавте свой первый комментарий') message.textContent = '';
            newPlacemark.commentContent =
                `<div class="message">
            <div class="message-head">
                <span id="author">${inputName.value}  ${now()}</span>
                <p>${inputPlace.value}</p>
            </div>
            <div class="message-body">
                <p>${inputText.value}</p>
            </div>
        </div>`;
            message.innerHTML += newPlacemark.commentContent;
            newPlacemark.place = address.innerText;
            clearInputValue();
            newPlacemark.events.add('click', function () {
                popupOpen();
                message.innerHTML = newPlacemark.commentContent;
                coords = newPlacemark.geometry.getCoordinates();
                address.textContent = newPlacemark.place;
                return coords;
            });
        } else {
            alert('Заполните пустые поля');
        }
    });
}

/*Инициализация popup*/
let popupOpen = function () {
    popup.style.top = event.clientY + 'px';
    popup.style.left = event.clientX + 'px';
    popup.style.display = 'block';
    if (event.clientY < 550) {
        let scrollY = (550 - event.clientY);
        if (scrollY !== null) {
            popup.style.top = (event.clientY + scrollY) + 'px';
        }
        let action = new ymaps.map.action.Continuous();
        myMap.action.execute(action);

        let center = myMap.getGlobalPixelCenter(),
            zoom = myMap.getZoom();
            center[1] += -scrollY;
            action.tick({
                globalPixelCenter: center,
                zoom: zoom
            });
    }
};

/*popup с отзывами*/
let popupOpenFull = function () {
    clearInputValue();
    let a = document.querySelector('.popup-link');

    for (let i = 0; i < points.length; i++) {
        if (a.innerText === points[i].place) {
            address.innerText = points[i].place;
            message.innerHTML += points[i].commentContent;
        }
    }

    popupOpen();
    if (myMap.balloon.isOpen()) {
        myMap.balloon.close();
    }
};

/*Возвращает строку с датой и временем*/
function now() {
    let date = new Date(),
        hours = date.getHours().toString(),
        minutes = date.getMinutes().toString(),
        seconds = date.getSeconds().toString(),
        day = date.getDate().toString(),
        month = date.getMonth().toString() + 1,
        year = date.getFullYear().toString();

    return `${hours}:${minutes}:${seconds} [${day} - ${month} - ${year}]`;
}

/*Очистка полей инпутов*/
let clearInputValue = function () {
    inputName.value = '';
    inputPlace.value = '';
    inputText.value = '';
};

/*Закрытие popup окна*/
buttonClose.addEventListener('click', () => {
    popup.style.display = 'none';
    clearInputValue();
});