/**
 * central
 * =======
 * The "central" is always the apps global center - used to dispatch events between app modules and store global values.
 */
define([], function (){
    'use strict';

    var central,
        connect,
        http,
        gui;

    connect = nodeRequire('connect');
    http = nodeRequire('http');
    gui = nodeRequire('nw.gui');

    central = new Backbone.Model({
        rootDir: null,
        server: null,
        examplesServer: null
    });


    central.start = function (){
        if(!central.get('rootDir') || central.get('server')){
            return;
        }

        var config,
            server;

        config = connect()
            .use(function (req, res, next){
                if(req.originalUrl === undefined){
                    req.originalUrl = '/';
                }

                return next();
            })
            .use(connect.static(central.get('rootDir')));
        try {
            server = http.createServer(config).listen(9277);

            //This is necessary to be able to close down the server again.
            server.addListener('connection',function(stream) {
                stream.setTimeout(1000);
            });

            central.set('server', server);

            server.on('listening', function (){
                central.trigger('start');

                gui.Shell.openExternal('http://localhost:9277/');
            });
        }
        catch (e) {

        }
    };

    central.stop = function (){
        if(!central.get('server')){
            return;
        }

        var srv;

        srv = central.get('server');

        srv.on('close', function (){
            central.set('server', null);

            central.trigger('stop');
        });

        srv.close();
    };

    central.examplesStart = function (){
        var config,
            server;

        config = connect()
            .use(function (req, res, next){
                if(req.originalUrl === undefined){
                    req.originalUrl = '/';
                }

                return next();
            })
            .use(connect.static('./phaser-examples-master/examples'));
        try {
            server = http.createServer(config).listen(9278);

            //This is necessary to be able to close down the server again.
            server.addListener('connection',function(stream) {
                stream.setTimeout(1000);
            });

            central.set('examplesServer', server);

            server.on('listening', function (){
                central.trigger('examplesStart');

                gui.Shell.openExternal('http://localhost:9278/');
            });
        }
        catch (e) {

        }


        console.log('start');
    };

    central.examplesStop = function (){
        if(!central.get('examplesServer')){
            return;
        }

        var srv;

        srv = central.get('examplesServer');

        srv.on('close', function (){
            central.set('examplesServer', null);

            central.trigger('examplesStop');
        });

        srv.close();

        console.log('stop');
    };
    return central;
});