var $ = function(e) {
    return document.getElementById(e);
};

function loadUrl(url, callback, reader) {
    var startDate = new Date().getTime();
    ID3.loadTags(
        url,
        function() {
            var endDate = new Date().getTime();
            if (typeof console !== "undefined")
                console.log("Time: " + (endDate - startDate) / 1000 + "s");
            var tags = ID3.getAllTags(url);
            $("artist").textContent = tags.artist || "";
            $("title").textContent = tags.title || "";
            $("album").textContent = tags.album || "";
            $("artist").textContent = tags.artist || "";
            $("year").textContent = tags.year || "";
            $("comment").textContent = (tags.comment || {}).text || "";
            $("genre").textContent = tags.genre || "";
            $("track").textContent = tags.track || "";
            $("lyrics").textContent = (tags.lyrics || {}).lyrics || "";
            if ("picture" in tags) {
                var image = tags.picture;
                var base64String = "";
                for (var i = 0; i < image.data.length; i++) {
                    base64String += String.fromCharCode(image.data[i]);
                }
                $("art").src =
                    "data:" + image.format + ";base64," + window.btoa(base64String);
                $("art").style.display = "block";
            } else {
                $("art").style.display = "none";
            }
            if (callback) {
                callback();
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

function loadFromLink(link) {
    var loading = link.parentNode.getElementsByTagName("img")[0];
    var url = link.href;

    loading.style.display = "inline";
    loadUrl(url, function() {
        loading.style.display = "none";
    });
}

function loadFromFile(file) {
    var url = file.urn || file.name;
    loadUrl(url, null, FileAPIReader(file));
}

function load(elem) {
    if (elem.id === "file") {
        loadAudio(elem.files[0]);
        loadFromFile(elem.files[0]);
    } else {
        loadAudio(elem);
        loadFromLink(elem);
    }
}

function loadAudio(file) {
    var audioUrl = getObjectURL(file);
    $("audio").src = audioUrl;
    $("audio").play();
}

function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
        console.info(url);
    } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
        console.info(url);
    } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
        console.info(url);
    }
    console.info("file:::::" + url);
    return url;
}