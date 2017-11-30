/* ДЗ 3 - работа с массивами и объеектами */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {

    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {

    let arr = [];

    for (let i = 0; i < array.length; i++) {
        arr.push(fn(array[i], i, array));
    }

    return arr;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {

    let result = initial === undefined ? array[0] : initial;

    if (initial) {
        for (let i = 0; i < array.length; i++) {
            result = fn(result, array[i], i, array);
        }
    } else {
        for (let i = 1; i < array.length; i++) {
            result = fn(result, array[i], i, array);
        }
    }

    return result;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {

    return delete(obj[prop]);
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {

    return obj.hasOwnProperty(prop);
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {

    let array = [];

    for (let propName in obj) {
        if (obj.hasOwnProperty(propName)) {
            array.push(propName);
        }
    }

    return array
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {

    let array = [],
        str,
        result;

    for (let propName in obj) {
        if (obj.hasOwnProperty(propName)) {
            array.push(propName);
            str = array.join(',').toUpperCase();
            result = str.split(',')
        }
    }

    return result;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from = 0, to = array.length) {

    let result = [];

    if (array instanceof Array && array !== 0) {
        from = from < 0 ? from + array.length : from;
        from = from > array.length ? array.length : from;
        from = from < -array.length ? 0 : from;
        to = to < 0 ? to + array.length : to;
        to = to > array.length ? array.length : to;
        to = to < -array.length ? 0 : to;

        for (let i = from; i < to; i++) {
            result.push(array[i]);
        }
    }

    return result;
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {

    return new Proxy(obj, {
        set(target, prop, value) {

            return target[prop] = value * value;
        }
    });
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
