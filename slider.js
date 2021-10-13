// 轮播图
/*
1. 写一个 div 里面有 3 个 img 标签
2. 只显示当前活动的 img 标签
3. 加 1 个按钮，点击的时候切换图片
*/
const nextIndex = function(slide, offset) {
    let numberOfImgs = parseInt(slide.dataset.imgs, 10);
    let activeIndex = parseInt(slide.dataset.active, 10);
    let index = (activeIndex + offset + numberOfImgs) % numberOfImgs;
    return index;
};

const showImageAtIndex = function(slide, index) {
    slide.dataset.active = String(index);
    let nextSelector = "#id-jmimage-" + String(index);
    let className = "jm-slide-image-active";
    removeClassAll(className);
    let img = e(nextSelector);
    img.classList.add(className);
    let images = e(".jm-slide-images");
    log("image", images);
    let width = -1 * 800 * index;
    images.style.left = String(width) + "px";
};

const showDotAtIndex = function(index) {
    removeClassAll("jm-dot-active");
    let dotSelector = "#id-dot-" + String(index);
    let dot = e(dotSelector);
    dot.classList.add("jm-dot-active");
};

const showAtIndex = function(slide, index) {
    showImageAtIndex(slide, index);
    showDotAtIndex(index);
};

const bindEventSlide = function() {
    let selector = ".jm-slide-button";
    bindAll(selector, "click", function(event) {
        let self = event.target;
        let slide = self.closest(".jm-slide");
        let offset = Number(self.dataset.offset);
        let index = nextIndex(slide, offset);
        showAtIndex(slide, index);
    });
};

const bindEventDot = function() {
    let selector = ".jm-slide-dot";
    bindAll(selector, "mouseover", function(event) {
        let self = event.target;
        let index = Number(self.dataset.index);
        // 直接播放第 n 张图片
        let slide = self.closest(".jm-slide");
        showAtIndex(slide, index);
    });
};

const playNextImage = function() {
    let slide = e(".jm-slide");
    let index = nextIndex(slide, 1);
    showAtIndex(slide, index);
};

const autoPlay = function() {
    let interval = 2000;
    setInterval(function() {
        // 每 2s 都会调用这个函数
        playNextImage();
    }, interval);
};

const bindEvents = function() {
    bindEventSlide();

    bindEventDot();

    let slide = e(".jm-slide");
    let index = nextIndex(slide, 0);
    showAtIndex(slide, index);
};

const demoTimer = function() {
    // 第一个参数是定时会被调用的函数
    // 第二个参数是延迟的时间, 以毫秒为单位, 1s = 1000ms
    log("begin", new Date());
    setTimeout(function() {
        log("时间到", new Date());
    }, 2000);

    // setInterval 会无限执行函数
    // setTimeout 和 setInterval 函数都有一个返回值
    // 返回值可以用来清除定时器
    let clockId = setInterval(function() {
        log("time in interval", new Date());
    }, 2000);
    log("clockId", clockId);
};

const __main = function() {
    bindEvents();
    // demoTimer();
    // autoPlay();
};

__main();