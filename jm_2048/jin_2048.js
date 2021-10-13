const divSquareWithRowCol = function(square) {
    let s = [];
    for (let i = 0; i < square.length; i++) {
        let l = "";
        for (let j = 0; j < square[i].length; j++) {
            let n = `<div class="block-col " id="r-${i}-c-${j}" data-row="${i}" data-col="${j}" data-val="${square[i][j]}"></div>`;
            l += n;
        }
        let f = `<div class="block-row">${l}</div>`;
        s += f;
    }
    return s;
};
const divBackWithRowCol = function(square) {
    let s = [];
    for (let i = 0; i < square.length; i++) {
        let l = "";
        for (let j = 0; j < square[i].length; j++) {
            let n = `<div class="block-back"></div>`;
            l += n;
        }
        let f = `<div class="block-back-row">${l}</div>`;
        s += f;
    }
    return s;
};
const appendBlocks = function(ele, html) {
    let div = document.querySelector(ele);
    // div.innerHTML = ''
    div.insertAdjacentHTML("beforeend", html);
};

const randomInArray = function(array) {
    let a = Math.random(array.length);
    let b = parseInt(a * array.length);

    return array[b];
};

const judgeIsLoseWhenSquareNotChange = function(gs) {
    let ca = [];
    let cnij = {};
    for (let i = 0; i < gs.length; i++) {
        for (let j = 0; j < gs[i].length; j++) {
            if (gs[i][j] === 0) {
                ca.push({ i: parseInt(i), j: parseInt(j) });
            }
        }
    }
    if (ca.length === 0) {
        if (judgeIsLose()) {
            return;
        } else {
            loseHint(true);
            return;
        }
    }
};

const randomBlockNum = function(gs) {
    let ca = [];
    let cnij = {};
    for (let i = 0; i < gs.length; i++) {
        for (let j = 0; j < gs[i].length; j++) {
            if (gs[i][j] === 0) {
                ca.push({ i: parseInt(i), j: parseInt(j) });
            }
        }
    }
    if (ca.length === 0) {
        if (judgeIsLose()) {
            return;
        } else {
            loseHint(true);
            return;
        }
    }

    cnij = randomInArray(ca);
    gs[cnij.i][cnij.j] = 2;
    refreshSquare();

    let gameDivSquare = es(".block-col");
    for (let i = 0; i < gameDivSquare.length; i++) {
        let gs = gameDivSquare[i];
        let r = Number(gs.dataset.row);
        let c = Number(gs.dataset.col);

        if (r === cnij.i && c === cnij.j) {
            gs.classList.add("random-target");
            gs.classList.add("number-active");
        } else {
            gs.classList.remove("random-target");
        }
    }

    return gs;
};

const judgeIsLose = () => {
    console.log("-----------------------------");
    let gs = gameSquare;
    let index = 0;
    for (i = 0; i < gs.length; i++) {
        for (j = 0; j < gs[i].length; j++) {
            let value = gs[i][j];
            let leni = gs.length;
            let lenj = gs[i].length;
            let arr = [];
            //lt
            if (i === 0 && j === 0) {
                arr = [gs[i][j + 1], gs[i + 1][j]];
            } else if (i === 0 && j === lenj - 1) {
                arr = [gs[i][j - 1], , gs[i + 1][j]];
            } else if (i === leni - 1 && j === 0) {
                arr = [gs[i - 1][j], , gs[i][j + 1]];
            } else if (i === leni - 1 && j === lenj - 1) {
                arr = [gs[i - 1][j], gs[i][j - 1]];
            } else if (i === 0 && j > 0 && j < lenj - 1) {
                arr = [gs[i][j - 1], gs[i][j + 1], gs[i + 1][j]];
            } else if (i === leni - 1 && j > 0 && j < lenj - 1) {
                arr = [gs[i - 1][j], gs[i][j - 1], gs[i][j + 1]];
            } else if (j === 0 && i > 0 && i < leni - 1) {
                arr = [gs[i - 1][j], gs[i][j + 1], gs[i + 1][j]];
            } else if (j === lenj - 1 && i > 0 && i < leni - 1) {
                arr = [gs[i - 1][j], gs[i][j - 1], gs[i + 1][j]];
            } else {
                arr = [gs[i - 1][j], gs[i][j - 1], gs[i][j + 1], gs[i + 1][j]];
            }
            index = arr.indexOf(value);

            if (index >= 0) {
                return true;
            }
        }
    }

    return false;
};

const calculateIndexMoving = (cr, direction, start, end) => {
    let index = gameSquare.length - 1;
    let realSi = 0;
    let realSj = 0;
    let realEi = 0;
    let realEj = 0;

    if (direction === "a" || direction === "A") {
        realSi = cr;
        realSj = start;
        realEi = realSi;
        realEj = end;
    } else if (direction === "w" || direction === "W") {
        realSi = start;
        realSj = cr;
        realEi = end;
        realEj = cr;
    } else if (direction === "d" || direction === "D") {
        realSi = cr;
        realSj = index - start;
        realEi = cr;
        realEj = index - end;
    } else if (direction === "s" || direction === "S") {
        realSi = index - start;
        realSj = cr;
        realEi = index - end;
        realEj = cr;
    }
    log(`(${realSi},${realSj}) ---> (${realEi},${realEj})`);

    let si = Number(realSi);
    let sj = Number(realSj);
    let ei = Number(realEi);
    let ej = Number(realEj);

    let moveType = "";
    let insertStyleStr = "";
    let gb = e(`#r-${si}-c-${sj}`);

    if (si === ei && sj === ej) {} else {
        if (si === ei && sj !== ej) {
            moveType = "X";
            insertStyleStr = `${ej - sj}00%`;
        } else {
            moveType = "Y";
            insertStyleStr = `${ei - si}00%`;
        }
        gb.classList.add("animation-target");
        gb.style.transition = `transform 0.2s`;
        gb.style.transform = `translate${moveType}(${insertStyleStr})`;
    }

    log(`transform: translate${moveType}(${insertStyleStr});`);
    setTimeout(() => {
        gb.style.transition = `none`;
        gb.style.transform = ``;
    }, 200);
};

const cleanAni = () => {
    let gameDivSquare = es(".block-col");
    for (let i = 0; i < gameDivSquare.length; i++) {
        let gs = gameDivSquare[i];
        gs.classList.remove("animation-target");
    }
};

const moveLineInner = (direction, arr, cunrrentRow) => {
    let fArr = [];
    let nArr = arr;
    for (let i = 0; i < nArr.length; i++) {
        let temp = nArr[i];
        if (temp !== 0) {
            for (let j = i + 1; j < nArr.length; j++) {
                if (nArr[j] !== 0) {
                    if (temp === nArr[j]) {
                        calculateIndexMoving(cunrrentRow, direction, j, fArr.length);
                        calculateIndexMoving(cunrrentRow, direction, i, fArr.length);

                        fArr.push(temp * 2);
                        nArr.splice(j, 1, 0);
                    } else {
                        calculateIndexMoving(cunrrentRow, direction, i, fArr.length);
                        fArr.push(temp);
                    }
                    break;
                } else {
                    if (j === nArr.length - 1) {
                        calculateIndexMoving(cunrrentRow, direction, i, fArr.length);
                        fArr.push(temp);
                    }
                }
            }
            if (i === nArr.length - 1) {
                calculateIndexMoving(cunrrentRow, direction, i, fArr.length);
                fArr.push(temp);
            }
        }
    }

    return fArr;
};

const moveLine = function(isStart, direction, arr, i) {
    let len = arr.length;
    // let nArr = arr.filter((item) => {
    //     return item !== 0
    // })
    let nArr = arr.filter((item) => {
        return item >= 0;
    });
    let fArr = [];
    if (!isStart) {
        nArr.reverse();
    }
    // for (let i = 0; i < nArr.length; i++) {
    //     if (nArr[i] === nArr[i + 1]) {
    //         fArr.push(nArr[i] * 2)
    //         nArr.splice(i, 1)
    //     } else {
    //         fArr.push(nArr[i])
    //     }
    // }
    fArr = moveLineInner(direction, nArr, i);
    if (!isStart) {
        fArr.reverse();
    }
    let wt = len - fArr.length;

    for (let i = 0; i < wt; i++) {
        if (isStart) {
            fArr.push(0);
        } else {
            fArr.unshift(0);
        }
    }
    return fArr;
};

const moveSquare = function(direction, gs) {
    let ngs = gs.filter((item) => {
        return item;
    });
    let rgs = reverseRowAndCol(gs);

    let fgs = [];
    if (direction === "a" || direction === "A") {
        for (let r in ngs) {
            ngs[r] = moveLine(true, direction, ngs[r], r);
        }
        fgs = ngs;
    } else if (direction === "w" || direction === "W") {
        for (let c in rgs) {
            rgs[c] = moveLine(true, direction, rgs[c], c);
        }
        fgs = reverseRowAndCol(rgs);
    } else if (direction === "d" || direction === "D") {
        for (let r in ngs) {
            ngs[r] = moveLine(false, direction, ngs[r], r);
        }
        fgs = ngs;
    } else if (direction === "s" || direction === "S") {
        for (let c in rgs) {
            rgs[c] = moveLine(false, direction, rgs[c], c);
        }
        fgs = reverseRowAndCol(rgs);
    }
    squareIsChange = !(JSON.stringify(fgs) === JSON.stringify(gameSquare));
    gameSquare = fgs;
};

const tempFoundValue = (gs) => {
    for (let row in gs) {
        let r = gs[row];
        for (let i in r) {
            if (r[i] !== 0) {
                return {
                    i: row,
                    j: i,
                };
            }
        }
    }
};

const refreshSquare = () => {
    let gameDivSquare = es(".block-col");
    for (let i = 0; i < gameDivSquare.length; i++) {
        let gs = gameDivSquare[i];
        let r = Number(gs.dataset.row);
        let c = Number(gs.dataset.col);

        gs.dataset.val = gameSquare[r][c];

        if (Number(gs.dataset.val) === 2048) {
            winHint(true);
            return;
        }

        if (gs.dataset.val !== "0") {
            gs.classList.add("number-active");

            if (Number(gs.dataset.val) >= 8 && Number(gs.dataset.val) < 128) {
                gs.classList.remove("number-high");
                gs.classList.add("number-big");
            } else if (
                Number(gs.dataset.val) >= 128 &&
                Number(gs.dataset.val) <= 1024
            ) {
                gs.classList.remove("number-big");
                gs.classList.add("number-high");
            } else {
                gs.classList.remove("number-high");
                gs.classList.remove("number-big");
            }
            gs.innerHTML = gs.dataset.val;
        } else {
            gs.classList.remove("number-active");
            gs.classList.remove("number-big");
            gs.classList.remove("number-high");
            gs.innerHTML = "";
        }
    }
};

const reverseRowAndCol = (gs) => {
    let ngs = [];
    for (let i = 0; i < gs[0].length; i++) {
        ngs.push([]);
    }
    for (let i in gs) {
        let l = gs[i];
        for (let j in l) {
            let n = l[j];
            ngs[j].push(n);
        }
    }

    return ngs;
};

const bindKey = function() {
    document.addEventListener("keydown", (key) => {
        cleanAni();
        let keys = "awdsAWDS";

        if (keys.indexOf(key.key) !== -1 && pressing === false) {
            pressing = true;
            moveSquare(key.key, gameSquare);
            log(squareIsChange);
            if (squareIsChange) {
                setTimeout(() => {
                    randomBlockNum(gameSquare);
                }, 200);
            } else {
                judgeIsLoseWhenSquareNotChange(gameSquare);
            }
        }
    });

    document.addEventListener("keyup", (key) => {
        cleanAni();
        let keys = "awdsAWDS";

        if (keys.indexOf(key.key) !== -1 && pressing === true) {
            pressing = false;
        }
    });
};

const creatGame = function() {
    gameSquare = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    // log(gameSquare)
    randomBlockNum(gameSquare);
    appendBlocks(".game-back", divBackWithRowCol(gameSquare));
    appendBlocks(".game-window", divSquareWithRowCol(gameSquare));

    refreshSquare();
    bindKey();
};

const newGame = function() {
    gameSquare = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    randomBlockNum(gameSquare);
    refreshSquare();
};

const winHint = function(isShow) {
    let self = e(".modal-mask");
    let selfAlert = e(".modal-alert");

    if (isShow) {
        self.style.display = "block";
        selfAlert.style.display = "block";
    } else {
        self.style.display = "none";
        selfAlert.style.display = "none";
    }
};

const loseHint = function(isShow) {
    let self = e(".modal-mask");
    let selfAlert = e(".modal-lose");

    if (isShow) {
        self.style.display = "block";
        selfAlert.style.display = "block";
    } else {
        self.style.display = "none";
        selfAlert.style.display = "none";
    }
};

var lastClick;
var gameSquare = [];
var squareIsChange = false;

var pressing = false;

const __main = function() {
    creatGame();
    newGame();
    bindAll(".start-button", "click", function() {
        newGame();
    });
    bindAll(".win-hint", "click", function() {
        winHint(true);
    });
    bindAll(".close-refresh", "click", function() {
        newGame();
        winHint(false);
        loseHint(false);
    });
    bindAll(".close-only", "click", function() {
        winHint(false);
        loseHint(false);
    });
};

__main();