'use strict';

var warp = warp || {};

var connect = require('connect'),
    serveStatic = require('serve-static'),
    http = require('http');

warp.cache = {};
warp.get = function (key) { return this.cache[key]; };
warp.set = function (key, value) { 
    if (!this.cache) { this.cache = {}; }
    if (!this.events) { this.events = {}; }
    this.events[key] = new Event(key);
    this.cache[key] = value;
    this.trigger(key);
};


warp.trigger = function (key) {
    if (!this.cache[key] || !this.events[key]) {
        // console.warn('Event doesn\'t exist');
        // console.log(key);
        // console.dir(this.cache);
        return;
    }
    document.dispatchEvent(this.events[key]);
};
warp.on = function (key, callback) {
    document.addEventListener(key, callback, false);
};


warp.start = function () {
    if (!warp.get('rootDir')) {
        warp.ui.warn('Directory Not Selected');
        return;
    } else if (warp.get('server')) {
        warp.ui.warn('Server already running, stop it first');
        return;
    }

    var config,
        server;

    config = connect()
        .use(function (req, res, next) {
            if (req.originalUrl === undefined) {
                req.originalUrl = '/';
            }
            return next();
        }).use(serveStatic(warp.get('rootDir')));
    try {
        server = http.createServer(config).listen(9277);

        server.addListener('connection', function (stream) {
            stream.setTimeout(1000);
        });

        warp.set('server', server);

        server.on('listening', function () {
            // warp.trigger('start');
            warp.log('Server running on port 9227');
            gui.Shell.openExternal('http://localhost:9277/');
        });
    } catch (e) {
        warp.log(JSON.stringify(e));
    }
};



warp.stop = function () {
    if (!warp.get('server')) {
        warp.ui.warn('No Server Running');
        return;
    }

    var server;

    server = warp.get('server');

    server.on('close', function () {
        warp.set('server', null);
        warp.trigger('stop');
    });

    server.close();
    warp.log('Server Closed');
};

warp.historyMenu = new gui.Menu();
warp.historyItems = JSON.parse(localStorage.history);
console.log(warp.historyItems);
if (!warp.historyItems) warp.historyItems = [];

var addHistoryItem = function (path, add) {
    var item;

    // Add to local storage, only save 5 max
    if (add) {
        warp.historyItems.push(path);
        if (warp.historyItems.length > 5 ) {
            warp.historyItems.shift();
            warp.historyMenu.removeAt(0);
        }
        localStorage.history = JSON.stringify(warp.historyItems);
    }

    item = new gui.MenuItem({
        label: path,
        click: function () {
            warp.set('rootDir', this.path);
        }
    });

    item.path = path;
    warp.historyMenu.append(item);
    warp.ui.enableButton('history');
};

(function () {
    var i;
    for (i = warp.historyItems.length - 1; i >= 0; i--) {
        console.log(warp.historyItems[i]);
        addHistoryItem(warp.historyItems[i], false);
    }
})();

warp.on('rootDir', function () {
    var dir = warp.get('rootDir');
    if (dir !== '') {
        warp.ui.enableButton('start');
        if (warp.historyItems.indexOf(dir) === -1) {
            addHistoryItem(dir, true);
        }
    }
});
