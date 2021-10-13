const log = console.log.bind(console);

const e = function(selector) {
    let element = document.querySelector(selector);
    if (element === null) {
        let s = `元素没找到, 选择器 ${selector} 错误`;
        alert(s);
        return null;
    } else {
        return element;
    }
};
const eAll = function(selector) {
    let elements = document.querySelectorAll(selector);
    if (elements === null) {
        let s = `元素没找到, 选择器 ${selector} 错误`;
        alert(s);
        return null;
    } else {
        return elements;
    }
};

const randomMine = function(rate) {
    return Math.random() > rate ? 9 : 0;
};

const creatMineArray = function(row, col, rate) {
    let r = 1 - rate;

    let datas = [];
    for (let i = 0; i < row * col; i++) {
        datas.push(randomMine(r));
    }
    datas = shuffleWithArray(datas);
    let square = [];
    for (let i = 0; i < row * col; i += col) {
        square.push(datas.slice(i, i + col));
    }

    log(square);
    return square;
};

const rowArray = function(array) {
    let s = "";
    for (let i = 0; i < array.length; i++) {
        let n = `<div class="mine-row" id="row-${i}">${array[i]}</div> \n`;
        s += n;
    }
    return s;
};

const colArray = function(array) {
    let s = "";
    for (let i = 0; i < array.length; i++) {
        let n = `<div class="mine-col" id="col-${i}">${array[i]}</div>`;
        s += n;
    }
    return s;
};

const divSquareWithRowCol = function(square) {
    let s = [];
    for (let i = 0; i < square.length; i++) {
        let l = "";
        for (let j = 0; j < square[i].length; j++) {
            let n = `<div class="mine-col iconfont value-${square[i][j]}" id="${i}-${j}-${square[i][j]}"></div>`;
            l += n;
        }
        let f = `<div class="mine-row">${l}</div>`;
        s += f;
    }
    return s;
};

const divSquare = function(square) {
    let s = [];
    for (let i = 0; i < square.length; i++) {
        s.push(colArray(square[i]));
    }
    return rowArray(s);
};

const split = function(s, delimiter = " ") {
    let l = [];
    let space = delimiter.length;
    let start = 0;
    for (let i = 0; i < s.length; i++) {
        if (s.slice(i, i + space) === delimiter) {
            l.push(s.slice(start, i));

            start = i + space;
        }
    }
    l.push(s.slice(start));
    return l;
};

const plus1 = function(array, x, y) {
    let n = array.length;
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] !== 9) {
            array[x][y] += 1;
        }
    }
};
const uncover = function(valueArray, array, x, y) {
    let n = array.length;
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] === 0 && valueArray[x][y] !== 9) {
            array[x][y] = 1;
            if (valueArray[x][y] === 0) {
                uncoverSquare(valueArray, x, y, array);
            }
        } else {
            array[x][y] = 1;
        }
    }
};
const uncoverSquare = function(valueArray, x, y, array) {
    let n = valueArray.length;
    if (x >= 0 && x < n && y >= 0 && y < n) {
        array[x][y] = 1;
        if (valueArray[x][y] === 0) {
            uncover(valueArray, array, x - 1, y - 1);
            uncover(valueArray, array, x, y - 1);
            uncover(valueArray, array, x + 1, y - 1);
            uncover(valueArray, array, x - 1, y);
            uncover(valueArray, array, x + 1, y);
            uncover(valueArray, array, x - 1, y + 1);
            uncover(valueArray, array, x, y + 1);
            uncover(valueArray, array, x + 1, y + 1);
        } else {
            uncover(valueArray, array, x, y);
        }
        return array;
    } else {
        return array;
    }
};

const checkBoomByClickMine = function(valueArray, coverA, x, y) {
    if (valueArray[x][y] === 9 && coverA[x][y] === 1) {
        return true;
    }
    return false;
};

const checkBoomByClickNum = function(valueArray, flagA, x, y) {
    if (valueArray[x][y] === 0 && flagA[x][y] === 1) {
        return true;
    }
    return false;
};

const uncoverAll = function(
    valueArray,
    coverA,
    markA,
    flagA,
    x,
    y,
    judgeByNum = false
) {
    for (let i = 0; i < coverA.length; i++) {
        for (let j = 0; j < coverA[i].length; j++) {
            coverA[i][j] = 1;
        }
    }

    let gameSquare = eAll(".mine-col");
    for (let i = 0; i < gameSquare.length; i++) {
        let vs = splitOutId(gameSquare[i].id);
        let r = vs.r;
        let c = vs.c;
        if (coverA[r][c] === 1) {
            // gameSquare[i].innerHTML = markA[r][c] == 0 ? "" : vs.v;
            gameSquare[i].innerHTML = iconOfNum(vs.v);

            gameSquare[i].style.background = "url('uncoveredBlock.png') no-repeat";

            if (parseInt(r) === x && parseInt(c) === y && valueArray[r][c] === 9) {
                gameSquare[i].style.background = "tomato";
            } else if (valueArray[r][c] === 9) {
                gameSquare[i].style.background = "plum";
            }

            if (
                valueArray[r][c] === 0 &&
                isAround(x, y, r, c) &&
                flagA[r][c] === 1 &&
                judgeByNum
            ) {
                gameSquare[i].style.background = "pink";
            } else if (valueArray[r][c] === 9 && isAround(x, y, r, c) && judgeByNum) {
                gameSquare[i].style.background = "orange";
            }
        }
    }
};
const isAround = function(x, y, r, c) {
    let xr = parseInt(r);
    let xc = parseInt(c);
    let aroundArray = [{
            x: x - 1,
            y: y - 1,
        },

        {
            x: x,
            y: y - 1,
        },

        {
            x: x + 1,
            y: y - 1,
        },

        {
            x: x - 1,
            y: y,
        },
        {
            x: x + 1,
            y: y,
        },
        {
            x: x - 1,
            y: y + 1,
        },

        {
            x: x,
            y: y + 1,
        },
        {
            x: x + 1,
            y: y + 1,
        },
    ];
    let xs = [];
    let ys = [];
    for (let i = 0; i < aroundArray.length; i++) {
        xs.push(aroundArray[i].x);
        ys.push(aroundArray[i].y);
    }

    if (xs.indexOf(xr) !== -1 && ys.indexOf(xc) !== -1) {
        return true;
    } else {
        return false;
    }
};

const checkFlag = function(valueArray, flagArray, x, y) {
    let n = valueArray.length;
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (valueArray[x][y] === 9 && flagArray[x][y] === 1) {
            return { x: x, y: y, c: true };
        } else if (valueArray[x][y] === 0 && flagArray[x][y] === 1) {
            return { x: x, y: y, c: false };
        } else if (valueArray[x][y] === 0 && flagArray[x][y] === 2) {
            return -2;
        } else {
            return -1;
        }
    }
};

const shuffleWithArray = function(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = arr[randomIndex];

        arr[randomIndex] = arr[i];
        arr[i] = itemAtIndex;
    }
    return arr;
};

const correctFlagPositions = function(valueArray, flagArray, x, y) {
    let po = [];

    po.push(checkFlag(valueArray, flagArray, x - 1, y - 1));
    po.push(checkFlag(valueArray, flagArray, x, y - 1));
    po.push(checkFlag(valueArray, flagArray, x + 1, y - 1));
    po.push(checkFlag(valueArray, flagArray, x - 1, y));
    po.push(checkFlag(valueArray, flagArray, x + 1, y));
    po.push(checkFlag(valueArray, flagArray, x - 1, y + 1));
    po.push(checkFlag(valueArray, flagArray, x, y + 1));
    po.push(checkFlag(valueArray, flagArray, x + 1, y + 1));
    let np = [];
    let isQ = false;
    for (i in po) {
        if (po[i] === -2) {
            isQ = true;
        }
    }
    np = po.filter(function(element) {
        return element !== -1 && element !== undefined;
    });

    let finalp = [];
    for (let i = 0; i < np.length; i++) {
        if (!np[i].c) {
            finalp = np.filter(function(element) {
                return !element.c;
            });
            finalp.push(-2);
            finalp.push(isQ);
            return finalp;
        }
    }
    np.push(isQ);
    return np;
};

const correctFlagUncover = function(valueArray, x, y, array, correctFlags) {
    let n = array.length;

    let uncoversArray = [{
            x: x - 1,
            y: y - 1,
        },

        {
            x: x,
            y: y - 1,
        },

        {
            x: x + 1,
            y: y - 1,
        },

        {
            x: x - 1,
            y: y,
        },
        {
            x: x + 1,
            y: y,
        },
        {
            x: x - 1,
            y: y + 1,
        },

        {
            x: x,
            y: y + 1,
        },
        {
            x: x + 1,
            y: y + 1,
        },
    ];

    let realUncover = [];
    for (let i = 0; i < correctFlags.length; i++) {
        for (let j = 0; j < uncoversArray.length; j++) {
            let ux = uncoversArray[j].x;
            let uy = uncoversArray[j].y;
            if (ux >= 0 && ux < n && uy >= 0 && uy < n) {
                if (!(ux === correctFlags[i].x && uy === correctFlags[i].y) &&
                    valueArray[ux][uy] !== 9
                ) {
                    realUncover.push(uncoversArray[j]);
                }
            }
        }
    }
    for (let i = 0; i < realUncover.length; i++) {
        array = uncoverSquare(
            valueArray,
            realUncover[i].x,
            realUncover[i].y,
            array
        );
    }
};

const cleanMine = function(array, x, y) {
    let n = array.length;
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] === 9) {
            array[x][y] = 0;
        }
    }
};
const cleanAround = function(array, x, y) {
    cleanMine(array, x, y);

    cleanMine(array, x - 1, y - 1);
    cleanMine(array, x, y - 1);
    cleanMine(array, x + 1, y - 1);

    cleanMine(array, x - 1, y);
    cleanMine(array, x + 1, y);

    cleanMine(array, x - 1, y + 1);
    cleanMine(array, x, y + 1);
    cleanMine(array, x + 1, y + 1);

    return array;
};

const markAround = function(array, x, y) {
    if (array[x][y] === 9) {
        // 标记周围 8 个
        // 标记的时候还需要判断是不是可以标记
        // 比如要标记左上角, 要判断 x > 0, y > 0
        // 这种判断很麻烦
        // 我们直接用函数来做
        // 具体的处理逻辑扔给函数

        // 先判断左边 3 个
        plus1(array, x - 1, y - 1);
        plus1(array, x, y - 1);
        plus1(array, x + 1, y - 1);

        // 再判断中间 2 个
        plus1(array, x - 1, y);
        plus1(array, x + 1, y);

        // 再判断右边 3 个
        plus1(array, x - 1, y + 1);
        plus1(array, x, y + 1);
        plus1(array, x + 1, y + 1);

        // array[i++]++
    }
};
const clonedArray = function(array) {
    return array.slice(0);
};
const clonedSquare = function(array) {
    let l = [];
    for (let i = 0; i < array.length; i++) {
        l.push(clonedArray(array[i]));
    }
    return l;
};

const markedSquare = function(array) {
    let square = clonedSquare(array);
    for (let i = 0; i < square.length; i++) {
        let line = square[i];
        for (let j = 0; j < line.length; j++) {
            markAround(square, i, j);
        }
    }
    return square;
};

const bindEventDelegate = function(
    element,
    eventName,
    callback,
    responseClass
) {
    element.addEventListener(eventName, function(event) {
        let self = event.target;
        if (self.classList.contains(responseClass)) {
            callback(event.target);
        }
    });
};
const bindAll = function(selector, eventName, callback, responseClass) {
    let sAll = document.querySelectorAll(selector);
    for (let i = 0; i < sAll.length; i++) {
        if (responseClass !== undefined) {
            bindEventDelegate(sAll[i], eventName, callback, responseClass);
        } else {
            sAll[i].addEventListener(eventName, callback);
        }
    }
};

const appendMineBlocks = function(html) {
    let div = document.querySelector(".game-window");
    div.innerHTML = "";
    div.insertAdjacentHTML("beforeend", html);
};

const unarchive = function(str) {
    for (let i = 0; i < str.length; i++) {}
};

const changeUncover = function(mineBlock) {
    mineBlock.style.background = "#ff6699";
    let v = split(mineBlock.id, "-").splice(-1);
    mineBlock.innerHTML = iconOfNum(v);
};

const creatCoverStatusArray = function(x, y) {
    let array = [];
    for (let i = 0; i < x; i++) {
        let l = [];
        for (let j = 0; j < y; j++) {
            l.push(0);
        }
        array.push(l);
    }
    return array;
};

const splitOutId = function(idStr) {
    let vs = split(idStr, "-");
    let v = vs[2];
    let r = vs[0];
    let c = vs[1];
    return {
        v: v,
        r: r,
        c: c,
    };
};

const isDefeatUncoverSquareByClickNum = function(
    valueArray,
    flagStatusArray,
    coverStatusArray,
    markedArray,
    r,
    c
) {
    let cf = correctFlagPositions(valueArray, flagStatusArray, r, c);
    let cfp = cf.slice(0, cf.length - 1);
    log(cfp);
    if (!cf.slice(-1).shift()) {
        if (cfp.length > 0) {
            if (cfp[cfp.length - 1] === -2) {
                let nfp = [];
                nfp = cfp.filter(function(element) {
                    return element !== -2;
                });
                for (let i = 0; i < nfp.length; i++) {
                    let fpx = nfp[i].x;
                    let fpy = nfp[i].y;

                    if (checkBoomByClickNum(valueArray, flagStatusArray, fpx, fpy)) {
                        // log("标记错误，游戏失败");
                        changeFace("flagFalse");

                        uncoverAll(
                            valueArray,
                            coverStatusArray,
                            markedArray,
                            flagStatusArray,
                            r,
                            c,
                            true
                        );
                        return true;
                    }
                }
            } else if (cfp.length === markedArray[r][c]) {
                // log("点击处数量正确,即将翻开周围格子");
                changeFace("countRight");
                correctFlagUncover(markedArray, r, c, coverStatusArray, cfp);
                return false;
            } else if (cfp.length < markedArray[r][c]) {
                // log("标记不够，不能翻开");
                changeFace("countFalse");

                return false;
            }
        }
    } else {
        log("含有问号，不能翻开");
        return false;
    }
};

const iconOfNum = function(v) {
    // return
    switch (v) {
        case "1":
            return "&#xe626";
        case "2":
            return "&#xe628";
        case "3":
            return "&#xe605";
        case "4":
            return "&#xe629";
        case "5":
            return "&#xe69b";
        case "6":
            return "&#xe627";
        case "7":
            return "&#xe70f";
        case "8":
            return "&#xe710";
        case "9":
            return "&#xe800";
        default:
            return "";
    }
};

const isObject = function(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
};
const isArray = function(o) {
    return Array.isArray(o);
};

const deepClone = function(value) {
    let no = {};
    let na = [];
    if (isObject(value)) {
        let oKeys = Object.keys(value);
        for (let i = 0; i < oKeys.length; i++) {
            let ok = oKeys[i];
            let ov = value[ok];
            no[ok] = deepClone(ov);
        }
        return no;
    } else if (isArray(value)) {
        for (let i = 0; i < value.length; i += 1) {
            na.push(deepClone(value[i]));
        }
        return na;
    } else {
        return value;
    }
};
const checkWin = function() {
    let flagS = deepClone(flagStatusArray);
    let coverS = deepClone(coverStatusArray);
    log(coverS, flagS);
    for (let i = 0; i < coverS.length; i++) {
        for (let j = 0; j < coverS[i].length; j++) {
            if (flagS[i][j] === 1) {
                flagS[i][j] = 0;
            } else if (flagS[i][j] === 0) {
                flagS[i][j] = 1;
            }
        }
    }
    if (JSON.stringify(flagS) === JSON.stringify(coverS)) {
        log("游戏胜利");
        changeFace("A");
    }
};
const changeFace = function(v) {
    let self = e(".start-button");
    let hint = e(".hint-speech");

    if (v === "O") {
        hint.innerHTML = "调整难度后，点我可以刷新哦";
        self.style.backgroundImage = `url('./${v}.png')`;
    } else if (v === "X") {
        hint.innerHTML = "哎呀，游戏失败了...";
        self.style.backgroundImage = `url('./${v}.png')`;
    } else if (v === "A") {
        hint.innerHTML = "好厉害！点我可以再来一把哦!";
        self.style.backgroundImage = `url('./${v}.png')`;
    } else if (v === "countRight") {
        hint.innerHTML = "这个数字周围的旗子都对啦~";
    } else if (v === "countFalse") {
        hint.innerHTML = "这个数字周围的旗子没标完哦~";
    } else if (v === "mineFalse") {
        hint.innerHTML = "哎呀,踩到地雷了,游戏失败!";
        self.style.backgroundImage = `url('./X.png')`;
    } else if (v === "flagFalse") {
        hint.innerHTML = "哎呀,旗子标错了,游戏失败!";
        self.style.backgroundImage = `url('./X.png')`;
    }
};

const newGame = function() {
    changeFace("O");

    valueArray = [];
    markedArray = [];
    mineArray = [];
    coverStatusArray = [];
    flagStatusArray = [];

    valueArray = creatMineArray(h, w, r);
    markedArray = markedSquare(valueArray);
    mineArray = divSquareWithRowCol(markedArray);
    coverStatusArray = creatCoverStatusArray(h, w);
    flagStatusArray = creatCoverStatusArray(h, w);
    firstClick = 0;

    appendMineBlocks(mineArray);
    log("*************\n", coverStatusArray);

    // appendMineBlocks2(divSquareWithRowCol2(markedArray))
};

// const winHint = function(isShow) {
//     let self = e(".modal-mask");
//     let selfAlert = e(".modal-alert");

//     if (isShow) {
//         self.style.display = "block";
//         selfAlert.style.display = "block";
//     } else {
//         self.style.display = "none";
//         selfAlert.style.display = "none";
//     }
// };

// const loseHint = function(isShow) {
//     let self = e(".modal-mask");
//     let selfAlert = e(".modal-lose");

//     if (isShow) {
//         self.style.display = "block";
//         selfAlert.style.display = "block";
//     } else {
//         self.style.display = "none";
//         selfAlert.style.display = "none";
//     }
// };

const bindEvents = (str) => {
    let inner = e(`.inner-${str}`);
    let outer = e(`.outer-${str}`);
    let dot = e(`.dot-${str}`);
    let result = e(`#id-em-move-${str}`);

    // 获取最外层 outer 元素的宽度, 进度条不能超过这个值
    let max = outer.offsetWidth;
    // 用开关来表示是否可以移动, 可以按下开关的时候才能移动
    let moving = false;

    // 初始偏移量
    let offset = 0;

    dot.addEventListener("mousedown", (event) => {
        // log("event", event.clientX, dot.offsetLeft, event.clientX - dot.offsetLeft);
        // event.clientX 是浏览器窗口边缘到鼠标的距离
        // dot.offsetLeft 是 dot 元素左上角到父元素左上角的距离
        // offset 就是父元素距离浏览器窗口边缘的距离, 注意这个值基本上是不变的
        offset = event.clientX - dot.offsetLeft;
        moving = true;
    });

    document.addEventListener("mouseup", (event) => {
        moving = false;
    });

    document.addEventListener("mousemove", (event) => {
        if (moving) {
            // 离浏览器左侧窗口当前距离减去父元素距离浏览器左侧窗口距离就是
            // dot 移动的距离
            let x = event.clientX - offset;
            // dot 距离有一个范围, 即 0 < x < max
            if (x > max) {
                x = max;
            }
            if (x < 0) {
                x = 0;
            }
            let width = (x / max) * 100;
            inner.style.width = String(width) + "%";

            if (str === "count") {
                h = Math.floor(x / 10) + 5;
                w = h;
                result.innerHTML = h;
            } else {
                r = (Math.floor((x * 6) / 100) + 1) / 10;
                result.innerHTML = r;
            }
        }
    });
};

var h = 5;
var w = 5;
var r = 0.2;
var valueArray = creatMineArray(h, w, r);
var markedArray = markedSquare(valueArray);
var mineArray = divSquareWithRowCol(markedArray);
var coverStatusArray = creatCoverStatusArray(h, w);
var flagStatusArray = creatCoverStatusArray(h, w);

var firstClick = 0;
var lastClick;
var lastButton = -1;

const __main = function() {
    // 点击 .todo-delete 按钮的时候会 log 「todo delete click」
    bindEvents("count");
    bindEvents("rate");

    document.oncontextmenu = function() {
        return false;
    };

    appendMineBlocks(mineArray);
    // appendMineBlocks2(divSquareWithRowCol2(markedArray))

    bindAll(".start-button", "click", function() {
        newGame();
    });

    bindAll(".game-window", "mousedown", function(mineBlock) {
        let self = mineBlock.target;
        let vs = splitOutId(mineBlock.target.id);
        let r = parseInt(vs.r);
        let c = parseInt(vs.c);
        let isD = false;

        let isLRClick = true;

        var nowClick = new Date();
        if (lastClick === undefined) {
            lastClick = nowClick;
            isLRClick = true;
        } else {
            if (Math.round(nowClick.getTime() - lastClick.getTime()) < 200) {
                lastClick = nowClick;
                isLRClick = true;
            } else {
                lastClick = nowClick;
                isLRClick = false;
            }
        }

        if (parseInt(flagStatusArray[r][c]) !== 0) {} else if (
            parseInt(flagStatusArray[r][c]) === 0 &&
            coverStatusArray[r][c] === 1
        ) {
            if (isLRClick && lastButton !== mineBlock.button) {
                lastButton = -1;
                isD = isDefeatUncoverSquareByClickNum(
                    valueArray,
                    flagStatusArray,
                    coverStatusArray,
                    markedArray,
                    r,
                    c
                );
                checkWin();
            } else {
                lastButton = mineBlock.button;
            }
        } else {}

        if (mineBlock.button === 0) {
            if (firstClick === 0) {
                markedArray = markedSquare(valueArray);

                if (markedArray[r][c] !== 0) {
                    valueArray = cleanAround(valueArray, r, c);
                }
                markedArray = markedSquare(valueArray);
                mineArray = divSquareWithRowCol(markedArray);
                appendMineBlocks(mineArray);
            }
            firstClick += 1;
            if (parseInt(flagStatusArray[r][c]) !== 0) {} else if (
                parseInt(flagStatusArray[r][c]) === 0 &&
                coverStatusArray[r][c] === 1
            ) {} else {
                coverStatusArray = uncoverSquare(markedArray, r, c, coverStatusArray);
            }
            checkWin();
        }

        if (mineBlock.button === 2) {
            if (firstClick === 0) {
                return;
            }

            if (
                parseInt(flagStatusArray[r][c]) === 0 &&
                coverStatusArray[r][c] === 0
            ) {
                flagStatusArray[r][c] = 1;
                // self.style.backgroundImage = "url('flag.png')";
                // self.style.backgroundSize = "50%";
                // self.style.backgroundPosition = "center";
                self.style.color = "red";
                self.innerHTML = "&#xed21";
            } else if (
                parseInt(flagStatusArray[r][c]) === 1 &&
                coverStatusArray[r][c] === 0
            ) {
                flagStatusArray[r][c] = 2;
                // self.style.backgroundImage = "url('questionMark1.png')";
                // self.style.backgroundSize = "50%";
                // self.style.backgroundPosition = "center";
                self.style.color = "red";
                self.innerHTML = "&#xe694";
            } else if (
                parseInt(flagStatusArray[r][c]) === 2 &&
                coverStatusArray[r][c] === 0
            ) {
                flagStatusArray[r][c] = 0;
                self.innerHTML = "";
                // self.style.background = "url('coveredBlock.png') no-repeat";
            } else {}

            checkWin();
        }

        let gameSquare = eAll(".mine-col");
        for (let i = 0; i < gameSquare.length; i++) {
            let qvs = splitOutId(gameSquare[i].id);
            let qr = qvs.r;
            let qc = qvs.c;
            if (coverStatusArray[qr][qc] === 1 && !isD) {
                // gameSquare[i].innerHTML = markedArray[qr][qc] == 0 ? "" : qvs.v;
                gameSquare[i].innerHTML = iconOfNum(qvs.v);
                gameSquare[i].style.background = "url('uncoveredBlock.png') no-repeat";
                if (checkBoomByClickMine(valueArray, coverStatusArray, qr, qc)) {
                    log("直接踩雷，游戏失败");
                    // loseHint(true);
                    changeFace("mineFalse");
                    uncoverAll(
                        valueArray,
                        coverStatusArray,
                        markedArray,
                        flagStatusArray,
                        r,
                        c
                    );
                    return;
                }
            }
        }
    });
};
__main();