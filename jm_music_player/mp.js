// import * as id3 from "id3js";

function jmLoadTotal(url, callback, reader) {
    let listJson = {};
    var startDate = new Date().getTime();
    ID3.loadTags(
        url,
        function() {
            var endDate = new Date().getTime();
            if (typeof console !== "undefined")
            // console.log("Time: " + (endDate - startDate) / 1000 + "s");
                var tags = ID3.getAllTags(url);
            listJson.artist = tags.artist || "";
            listJson.title = tags.title || "";
            if ("picture" in tags) {
                var image = tags.picture;
                var base64String = "";
                for (var i = 0; i < image.data.length; i++) {
                    base64String += String.fromCharCode(image.data[i]);
                }
                listJson.art =
                    "data:" + image.format + ";base64," + window.btoa(base64String);
            } else {
                listJson.art = "";
            }
            if (callback) {
                callback(listJson);
            }
        }, {
            tags: [
                "artist",
                "title",
                "album",
                "year",
                "comment",
                "track",
                "genre",
                "lyrics",
                "picture",
            ],
            dataReader: reader,
        }
    );
}
const bindProgressLine = () => {
    let inner = e(".inner");
    let outer = e(".outer");
    let dot = e(".dot");
    let audio = e("audio");

    // 获取最外层 outer 元素的宽度, 进度条不能超过这个值
    let max = outer.offsetWidth;
    // 用开关来表示是否可以移动, 可以按下开关的时候才能移动
    let moving = false;

    // 初始偏移量
    let offset = 0;

    dot.addEventListener("mousedown", (event) => {
        log("event", event.clientX, dot.offsetLeft, event.clientX - dot.offsetLeft);
        // event.clientX 是浏览器窗口边缘到鼠标的距离
        // dot.offsetLeft 是 dot 元素左上角到父元素左上角的距离
        // offset 就是父元素距离浏览器窗口边缘的距离, 注意这个值基本上是不变的
        offset = event.clientX - dot.offsetLeft;
        moving = true;
    });

    document.addEventListener("mouseup", (event) => {
        moving = false;

        playAudio(isPlayActive);
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
            let timePersentage = x / max;
            if (timePersentage > 0.99) {
                timePersentage = 0.99;
            }
            let width = timePersentage * 100;
            inner.style.width = String(width) + "%";

            audio.currentTime = timePersentage * audio.duration;
        }
    });
};
const timerGo = function() {
    clearInterval(timerNum);
    timerNum = 0;
    let interval = 500;
    timerNum = setInterval(function() {
        refreshCurrent();
    }, interval);
};

const changeTimeToMin = function(timeNum) {
    if (isNaN(timeNum)) {
        return "0:00";
    }
    let m = parseInt(timeNum / 60);
    let n = parseInt(timeNum) - m * 60;
    let mPart = `${m}:`;
    let sPart = n < 10 ? `0${n}` : `${n}`;
    return mPart + sPart;
};

const changeMinToTime = function(s, delimiter = ":") {
    let l = [];
    let time = 0;
    let space = delimiter.length;
    let start = 0;
    for (let i = 0; i < s.length; i++) {
        if (s.slice(i, i + space) === delimiter) {
            log(start, i);
            l.push(s.slice(start, i));
            start = i + space;
        }
    }
    l.push(s.slice(start));

    time = 60 * parseInt(l[0]) + parseInt(l[1]);

    return time;
};

const refreshCurrent = function() {
    let a = e("audio");
    let currentTimeDom = e("#id-span-currentTime");
    let inner = e(".inner");
    currentTimeDom.innerHTML = changeTimeToMin(a.currentTime);
    inner.style.width = String((a.currentTime / a.duration) * 100) + "%";
};

function SearchAnim(opts) {
    for (var i in SearchAnim.DEFAULTS) {
        if (opts[i] === undefined) {
            opts[i] = SearchAnim.DEFAULTS[i];
        }
    }
    this.opts = opts;
    this.timer = null;
    this.elem = document.getElementById(opts.elemId);
    // this.startAnim();
}

const changeSingleButton = function() {
    let icon = e("#id-single-icon");

    if (isSingle) {
        icon.classList.add("fa-circle");
        icon.classList.remove("fa-circle-notch");
    } else {
        icon.classList.remove("fa-circle");
        icon.classList.add("fa-circle-notch");
    }
};

const changeRandomButton = function() {
    let icon = e("#id-random-icon");
    if (isRandom) {
        icon.classList.remove("fa-list");
        icon.classList.add("fa-random");
    } else {
        icon.classList.remove("fa-random");
        icon.classList.add("fa-list");
    }
};
const changePlayButton = function() {
    let audio = e("#id-audio-player");

    let controlB = e("#id-play-icon");

    // let currentSrcStr = audio.src;
    let path = audio.src.split("/").pop().split(".").shift();
    let icon = e(`#path-${path}`);
    let listBs = es(".list-state");
    for (let i = 0; i < listBs.length; i++) {
        listBs[i].classList.remove("fa-pause");
        listBs[i].classList.add("fa-play");
    }

    if (isPlayActive) {
        controlB.classList.add("fa-pause");
        icon.classList.add("fa-pause");
        icon.classList.remove("fa-play");
        controlB.classList.remove("fa-play");
    } else {
        icon.classList.remove("fa-pause");
        controlB.classList.remove("fa-pause");

        icon.classList.add("fa-play");
        controlB.classList.add("fa-play");
    }
};

const bindEventPre = function() {
    let button = e("#id-button-pre");
    button.addEventListener("click", function() {
        if (isRandom) {
            randomPlay();
        } else {
            playPre();
        }
    });
};
const bindEventNext = function() {
    let button = e("#id-button-next");
    button.addEventListener("click", function() {
        if (isRandom) {
            randomPlay();
        } else {
            playNext();
        }
    });
};

const bindEventPlay = function(audio) {
    let button = e("#id-button-play");
    button.addEventListener("click", function() {
        isPlayActive = !isPlayActive;
        // changePlayButton();
        playAudio(isPlayActive);
        // log(audio.src);
    });
};

const bindEventSingle = function(audio) {
    let button = e("#id-button-single");
    button.addEventListener("click", function() {
        isSingle = !isSingle;
        changeSingleButton();
    });
};
const bindEventRandom = function(audio) {
    let button = e("#id-button-random");
    button.addEventListener("click", function() {
        isRandom = !isRandom;
        log(isRandom);
        changeRandomButton();
    });
};

const bindPlayListEvent = function() {
    bindAll(".list-state", "click", function(event) {
        let self = event.target;
        let auE = e("audio");
        let pathC = auE.src.split("/").pop().split(".").shift();

        log(self.dataset.path);

        if (self.dataset.path === pathC) {
            isPlayActive = !isPlayActive;
            if (isPlayActive) {
                playAudio(true);
            } else {
                playAudio(false);
            }
        } else {
            isPlayActive = true;
            auE.src = `musics/${self.dataset.path}.mp3`;
            // changeCurrentInfo();
            playAudio(true);
        }
        // changePlayButton();
    });
};

const changeCurrentInfo = function() {
    let auE = e("audio");
    // let rSta = e(".random-status");

    // rSta.innerHTML = isRandom ? "随机" : "列表" + "-" + isSingle ? "循环" : "";

    let pathC = auE.src.split("/").pop().split(".").shift();
    log(songList);
    log(auE.src);
    let tags = songList[pathC];
    log(tags);
    e(".artist").innerHTML = tags.artist || "";
    e(".mtitle").innerHTML = tags.title || "";
    e(".art").src = tags.art || "";
};

// const bindEventPause = function(audio) {
//     let button = e("#id-button-pause");
//     button.addEventListener("click", function() {
//         playAudio(false);
//     });
// };
var isShowList = false;

const bindEventList = function() {
    let button = e(".list-button");
    button.addEventListener("click", function() {
        log(e(".play-list"));
        isShowList = !isShowList;
        e(".play-list").style.display = isShowList ? "block" : "none";
    });
};
const bindEvents = function() {
    let audio = e("#id-audio-player");
    bindEventPlay(audio);
    bindEventSingle();
    bindEventRandom();
    bindEventPre();
    bindEventNext();
    // bindEventPause(audio);
    bindEventCanplay(audio);
    bindEventEnded(audio);
    bindEventTimeUpdate(audio);
    bindEventList();
    bindPlayListEvent();

    randomPlay();
};

const bindEventCanplay = function(audio) {
    audio.addEventListener("canplay", function() {
        if (isFirstIn > 0) {
            let currentTimeDom = e("#id-span-currentTime");
            let duration = audio.duration;
            //**
            let canplayTime = changeTimeToMin(duration);
            // log("duration in canplay", duration);

            let totalTime = e("#id-span-totalTime");
            totalTime.innerHTML = canplayTime;
            playAudio(true);
            // timerGo()
        } else {
            isFirstIn += 1;
        }
    });
};

const bindEventTimeUpdate = function(audio) {
    audio.addEventListener("timeupdate", function() {
        let currentTimeDom = e("#id-span-currentTime");
        let duration = audio.duration;
        // log("duration in canplay", duration);
        let totalTime = e("#id-span-totalTime");
        totalTime.innerHTML = changeTimeToMin(duration);

        // if (isFirstIn > 0) {
        // audio.play()
        refreshCurrent();
        // } else {
        //     isFirstIn += 1
        // }
    });
};

const cutToSimpleSrc = function(s) {
    let index = s.lastIndexOf("musics/");
    return s.substring(index, s.length);
};
const choice = function(array) {
    let a = Math.random(array.length);
    let b = parseInt(a * array.length);
    return b;
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
const bindEventEnded = function(audio) {
    audio.addEventListener("ended", function() {
        // let srcArray = ["musics/1.mp3", "musics/2.mp3", "musics/3.mp3"];
        // let ns = cutToSimpleSrc(audio.src)
        // log(ns)
        // let cI = srcArray.indexOf(ns)
        // let nI = (cI === srcArray.length - 1 ? 0 : cI + 1)

        if (isSingle) {
            playAudio(isPlayActive);
            return;
        }

        if (isRandom) {
            randomPlay();
        } else {
            playNext();
        }
    });
};

const playNext = function() {
    let auE = e("audio");
    let path = auE.src.split("/").pop().split(".").shift();
    let np = Number(path) + 1;
    log(np);
    if (np > srcArray.length - 1) {
        np = 0;
    }

    auE.src = srcArray[np];
    isPlayActive = true;
    playAudio(isPlayActive);
};
const playPre = function() {
    let auE = e("audio");
    let path = auE.src.split("/").pop().split(".").shift();
    let np = Number(path) - 1;
    if (np < 0) {
        np = srcArray.length - 1;
    }
    auE.src = srcArray[np];
    // changeCurrentInfo();
    isPlayActive = true;

    playAudio(isPlayActive);
};

const randomPlay = function() {
    let auE = e("audio");

    let path = auE.src.split("/").pop().split(".").shift();

    let nArr = deepClone(srcArray);
    for (let i = 0; i < nArr.length; i++) {
        if (i === Number(path)) {
            nArr.splice(i, 1);
        }
    }
    // log(nArr[choice(nArr)]);
    auE.src = nArr[choice(nArr)];
    isPlayActive = true;

    // changeCurrentInfo();
    playAudio(isPlayActive);
};

const playAudio = function(isPlay) {
    let audio = e("#id-audio-player");
    if (isPlay) {
        audio.play();
        sa.startAnim();
    } else {
        audio.pause();
        sa.stopAnim();
    }

    changeCurrentInfo();

    changePlayButton();
};
//CoverAnim=====================================
SearchAnim.prototype.startAnim = function() {
    this.stopAnim();
    this.timer = setInterval(() => {
        var startIndex = this.opts.startIndex;
        if (startIndex == 360) {
            this.opts.startIndex = 0;
        }
        this.elem.style.transform = "rotate(" + startIndex + "deg)";
        this.opts.startIndex += 0.5;
    }, this.opts.delay);
    setTimeout(() => {
        this.stopAnim();
    }, this.opts.duration);
};
SearchAnim.prototype.stopAnim = function() {
    if (this.timer != null) {
        clearInterval(this.timer);
    }
};
SearchAnim.DEFAULTS = {
    duration: 60000,
    delay: 200,
    direction: true,
    startIndex: 0,
    endIndex: 360,
};
var sa = new SearchAnim({
    elemId: "rotate-cover",
    delay: 20,
});
//CoverAnim=====================================

var isFirstIn = 0;
var timerNum = 0;
var isPlayActive = false;
var srcArray = [
    "./musics/0.mp3",
    "./musics/1.mp3",
    "./musics/2.mp3",
    "./musics/3.mp3",
];

var songList = {};
var isRandom = true;
var isSingle = false;

const __main = function() {
    // choice([1, 2, 3, 4, 5]);

    for (let i = 0; i < srcArray.length; i++) {
        jmLoadTotal(`./musics/${i}.mp3`, function(listInfo) {
            songList[i] = listInfo;
            e(`.title-${i}`).innerHTML = listInfo.title || "";
            e(`.artist-${i}`).innerHTML = listInfo.artist || "";
            e(`.img-${i}`).src = listInfo.art || "";
        });
    }

    let indexTimer = setInterval(() => {
        if (Object.keys(songList).length === srcArray.length) {
            clearInterval(indexTimer);

            bindEvents();
            bindProgressLine();
        } else {}
    }, 100);
};

__main();