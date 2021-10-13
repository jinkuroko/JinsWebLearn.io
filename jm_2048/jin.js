const log = console.log.bind(console);

const e = function(selector) {
    let element = document.querySelector(selector);
    if (element === null) {
        let s = `根本没有${selector}这种选择器`;
        return null;
    } else {
        return element;
    }
};

const es = function(selector) {
    let elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
        let s = `根本没有${selector}这种选择器`;
        return [];
    } else {
        return elements;
    }
};
const appendHtml = function(element, html) {
    element.insertAdjacentHTML("beforeend", html);
};

const bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback);
};

const removeClassAll = function(className) {
    let selector = "." + className;
    let elements = es(selector);
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i];
        e.classList.remove(className);
    }
};

const bindAll = function(selector, eventName, callback) {
    let elements = es(selector);
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i];
        bindEvent(e, eventName, callback);
    }
};

// find 函数可以查找 element 的所有子元素
const find = function(element, selector) {
    let e = element.querySelector(selector);
    if (e === null) {
        let s = `根本没有${selector}这种选择器`;
        alert(s);
        return null;
    } else {
        return e;
    }
};

const closestClass = function(element, className) {
    let e = element;

    // 逐步往上查找 e 元素的父元素, 看看是否包含 className
    // 如果包含则直接返回这个元素, 否则就从 parentElement 往上找
    // 这个可以用递归来实现, 也可以用循环来实现
    while (e !== null) {
        if (e.classList.contains(className)) {
            return e;
        } else {
            e = e.parentElement;
        }
    }
    // 如果找到最上面都没有找到, 直接返回 null
    return null;
};

// 实现 closestId 函数
const closestId = function(element, idName) {
    let e = element;

    while (e !== null) {
        if (e.id === idName) {
            return e;
        } else {
            e = e.parentElement;
        }
    }
    // 如果找到最上面都没有找到, 直接返回 null
    return null;
};

const closestTag = function(element, tagName) {
    let e = element;

    while (e !== null) {
        if (e.tagName.toUpperCase() === tagName.toUpperCase()) {
            return e;
        } else {
            e = e.parentElement;
        }
    }
    // 如果找到最上面都没有找到, 直接返回 null
    return null;
};

const closest = function(element, selector) {
    let c = selector[0];
    if (c === ".") {
        // class 选择器
        let className = selector.slice(1);
        return closestClass(element, className);
    } else if (c === "#") {
        // id 选择器
        let idName = selector.slice(1);
        return closestId(element, idName);
    } else {
        // 元素选择器
        let tag = selector;
        return closestTag(element, tag);
    }
};