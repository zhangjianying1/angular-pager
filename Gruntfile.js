module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            options: {
                port: 8224,
                hostname: '*',
                base: '.',
                livereload: 8225
            },
            dev: {
                options: {
                    open: true,
                    base: ['.']
                }
            }
        },
        jshint: {
            all: ['js/utils/*.js', 'js/*.js']
        },
        watch: {
            script: {
                files: ["js/utils/*.js", "js/*.js"],
                tasks: ["jshint"],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            uglify: {
                files: ["js/utils/*.js", "js/app/*.js", "js/*.js"],
                tasks: ["uglify"],
                options: {
                    livereload: '<%= connect.options.livereload %>',
                    debounceDelay: 250
                }
            },
            compass: {
                files: ["sass/*.scss", "sass/**/*.scss"],
                tasks: ["compass"],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            cssmin: {
                files: ["sass/**/*.css", "sass/*.css"],
                tasks: ["cssmin"],
                options: {
                    debounceDelay: 250
                }
            },
            html: {
                files: ["**/*.html", "*.html"],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            }
        },
        uglify: {
            options: {
                //banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    "dist/utils/caimi-core-ajax.js": [ "js/utils/caimi-core-ajax.js" ]
                }
            }
        },
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    "dist/entry.min.css": [ "stylesheets/entry/login.css", "stylesheet/entry/register.css" ],
                    "dist/index.min.css": [ "stylesheets/index.css"],
                    "dist/user.min.css": [ "stylesheets/mynumber/mynumber-index.css", "stylesheets/mynumber/agent-agent-recharge.css"],
                    "dist/recharge.min.css": [ "stylesheets/mynumber/agent-recharge.css"],
                    "dist/morefn.min.css": [ "stylesheets/morefn/morefn.css"],
                }
            }

        },
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },
//        copy: {
//            main: {
//                files: [
//                    {expand: true, src: ['images/**/*'], dist: 'img/', filter: 'isFile'}
//                ]
//            }
//        },
        copy: {
            test: {
                flatten: true,
                expand: true,
                src: ['images/*'],
                dest: 'img/'
            }
        },
        imagemin: {
            dynamic: {
                files: [
                    {
                        expand: true,
                        cwd: 'img/',
                        src: ['**//*.{png,jpg,gif}'],
                        dist: 'images'
                    }
                ]
            }
        },
        requirejs: {
            build: {
                options: {
                    "baseUrl": "js",
                    "paths": {
                        "jquery": "libs/jquery-2.1.3.min",
                        "jquery": "empty:",
                        "template": 'libs/template.min',
                        "template": 'empty:',
                        "zepto": "libs/zepto.min",
                        "zepto": "empty:",
                        "recommandsoccer": "app/recommandsoccer-app",
                        "sendintegral": "app/sendintegral-app",
                        "iscroll": "libs/iscroll",
                        "iscroll": 'empty:'
                    },
                    "include": [
                        "sendintegral"
                    ],
                    "out": "dist/app/sendintegral-app.js"
                }
            }
//            compile: {
//                options: {
//                    baseUrl: 'js',
//                    name: 'test2',
//                    out: 'dist/test2.js'
//                }
//            }
        },
        clean: {
            files: ['img']
        },
        rev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            assets: {
                files: [
                    {
                        src: [
                            'img/**/*.{jpg,jpeg,gif,png}'
                        ]
                    }
                ]
            }
        },
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'tep'
            }
        },
        usemin: {
            html: ['*.html'],      // 注意此处是build/
            options: {
                assetsDirs: ['tpl/']
            }
        }
       /*,
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                   // paths：js源码位置；
                    //themedir：文档模板位置；
                    //outdir：文档输出位置。
                    paths: 'js/',
                    themedir: 'theme/',
                    outdir: 'docs/'
                }
            }
        }*/
    });
    

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');
    //grunt.loadNpmTasks('grunt-contrib-imagemin');
    //grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.registerTask('default', [ 'uglify', 'jshint', 'watch', 'cssmin', 'compass', 'copy', "requirejs", "rev", "usemin"]);
    grunt.registerTask('start', ['connect:dev', 'watch']);
    grunt.registerTask('md5', ['clean', 'copy', 'rev']);
    grunt.registerTask('rev', ['useminPrepare', 'usemin']);
    grunt.registerTask('rev', ['useminPrepare', 'usemin']);
};