'use strict';
var manifest = gui.App.manifest;
var warp = warp || {};
warp.ui = {
    textarea: document.getElementsByTagName('textarea')[0],
    buttons: {
        dev: document.getElementById('button_dev'),
        close: document.getElementById('button_close'),
        restore: document.getElementById('button_restore'),
        min: document.getElementById('button_min'),
        browse: document.getElementById('button_browse'),
        history: document.getElementById('button_history'),
        start: document.getElementById('button_start'),
        stop: document.getElementById('button_stop')
    },
    inputDir: document.getElementById('input_directory'),
    span: document.getElementById('span_workingDir')
};

warp.ui.enableButton = function (key) {
    var elem = warp.ui.buttons[key];
    elem.classList.remove('pure-button-disabled');
};

warp.ui.disableButton = function (key) {
    var elem = warp.ui.buttons[key];
    elem.classList.add('pure-button-disabled');
};

warp.ui.warn= function (string) {
    warp.log(string);
    alert(string);
};

warp.ui.textarea.placeholder = 
    manifest.name.toUpperCase() + '..v' + manifest.version + 
    '\nNW' + '....' + process.version;

warp.ui.buttons.dev.onclick = function () {
    win.showDevTools();
};

warp.ui.buttons.close.onclick = function () {
    //TODO: check if server is running, if so throw alert
    win.close();
};

warp.ui.buttons.min.onclick = function () {
    win.minimize();
};

warp.ui.buttons.browse.onclick = function () {
    var event = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    warp.ui.inputDir.dispatchEvent(event);
};

warp.ui.buttons.history.onclick = function () {
    var pos = {};
    pos.left = this.offsetLeft - 150;
    pos.top = this.offsetTop + this.offsetHeight;
    
    warp.historyMenu.popup(pos.left, pos.top);
};

warp.ui.buttons.start.onclick = function () {
    warp.start();
    warp.ui.disableButton('start');
    warp.ui.disableButton('browse');
    warp.ui.disableButton('history');
    warp.ui.enableButton('stop');
};

warp.ui.buttons.stop.onclick = function () {
    warp.stop();
    warp.ui.disableButton('stop');
    warp.ui.enableButton('start');
    warp.ui.enableButton('browse');
    warp.ui.enableButton('history');
};

warp.ui.inputDir.onchange = function () {
    var dir = this.value;

    warp.ui.span.innerHTML = dir;
    warp.set('rootDir', dir);
};

warp.log = function (string) {
    var past = this.ui.textarea.value;
    var log = past || '';
    if (past.length === 0) {
        log += this.ui.textarea.placeholder;
    }
    if (string) {
        log += '\n' + string;
    }

    this.ui.textarea.value = log;
    this.ui.textarea.scrollTop = this.ui.textarea.scrollHeight;
};

warp.ui.disableButton('stop');
warp.ui.disableButton('history');
warp.ui.disableButton('start');

