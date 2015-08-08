module.exports = function (grunt){
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nw-builder');

    grunt.initConfig({
        nwjs: {
            options: {
                platforms: ['win'],
                buildDir: './builds'
            },
            src: ['./praw/**/*']
        },

        watch: {
            main: {
                files: ['./praw/**'],
                tasks: ['nwjs']
            }
        }
    });

    grunt.registerTask('default', 'nwjs');
};