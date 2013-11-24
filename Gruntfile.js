/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/**\n' +
            '* <%= pkg.name %>.js v<%= pkg.version %> by @fat and @mdo\n' +
            '* Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            '* <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
            '*/\n',
    // jqueryCheck: 'if (!jQuery) { throw new Error(\"Bootstrap requires jQuery\") }\n\n',

    // Task configuration.
    clean: {
      dist: ['target/build/','target/distribution/']
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['dict/js/*.js']
      },
      test: {
        src: ['dict/js/test/*.js']
      }
    },

    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['dict/css/dict.common.css']
      },
      lax: {
        options: {
          import: false
        },
        src: ['dict/css/dict.common.css']
      }
    },

    cssmin: {
      compress: {
        files: {
          'target/distribution/dict_ui.min.css':[
              'lib/jwe/jquery.windows-engine.css',
              'lib/tooltip/tipsy.css',
              'dict/css/dict.common.css',
          ],
          'target/distribution/dict_proxy.min.css':[
              'lib/bootstrap/css/bootstrap.css',
              'dict/css/dict.common.css',
          ],
        },
      }
    },

    concat: {
      options: {
        // banner: '<%= banner %><%= jqueryCheck %>',
        // stripBanners: false
      },
      dict_bookmarklet: {
        src: ['dict/js/dict.util.sharebml.js',
              'dict/js/dict.bookmarklet.js'],
        dest: 'target/distribution/<%= pkg.name %>_bookmarklet.js'
      },
      dict_ui_dev: {
        src: [
          'lib/jquery.min.js',
          'lib/jquery.cookie.js',
          'lib/jquery.plaintext.js',
          'lib/tooltip/jquery.tipsy.js',
          'lib/jwe/jquery.windows-engine.js',
          'dict/js/conf.js',
          'dict/js/dict.util.js',
          'dict/js/dict.util.sharebml.js',
          'dict/js/dict.ui.js',
          'dict/js/dict.ui.navi.js',
          'dict/js/end.js',
        ],
        dest: 'target/distribution/<%= pkg.name %>_ui_dev.js'
      },
      dict_ui_rls: {
        src: [
          'dict/js/conf.release.js',
          '<%= concat.dict_ui_dev.src %>'
        ],
        dest: 'target/distribution/<%= pkg.name %>_ui_rls.js'
      },
      dict_proxy: {
        src: [
          'lib/jquery.min.js',
          'lib/jquery.cookie.js',
          'lib/bootstrap/js/bootstrap.min.js',
          'dict/js/dict.util.js',
          'dict/js/dict.proxy.js',
          'dict/js/dict.formatter.js',
          'dict/js/dict.formatter.weblio.js',
          'dict/js/dict.formatter.weblios.js',
        ],
        dest: 'target/distribution/<%= pkg.name %>_proxy.js'
      },
    },

    uglify: {
      options: {
        //banner: '<%= banner %>'
      },
      dict_bookmarklet: {
        src: ['<%= concat.dict_bookmarklet.dest %>'],
        dest: 'target/distribution/<%= pkg.name %>_bookmarklet.min.js'
      },
      dict_ui: {
        src: ['<%= concat.dict_ui_rls.dest %>'],
        dest: 'target/distribution/<%= pkg.name %>_ui.min.js'
      },
      dict_proxy: {
        src: ['<%= concat.dict_proxy.dest %>'],
        dest: 'target/distribution/<%= pkg.name %>_proxy.min.js'
      },
    },

/*
    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: ['js/tests/*.html']
    },
*/
    connect: {
      // grunt connect:server:keepalive
      server: {
        options: {
          protocol : 'https',
          port : 8443,
          keepalive: true,
          base: '.'
        }
      },
    },

    copy: {
      main: {
        files: [
          //{src: ['lib/jwe/default/*'], dest: 'lib/pkg/default/', filter: 'isFile'}, // includes files in path
          //{src: ['path/**'], dest: 'dest/'}, // includes files in path and its subdirs
          //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'}, // makes all src relative to cwd
          {expand:true, cwd: 'lib/jwe/default/',src: ['*_mid.gif'], dest: 'target/distribution/default/', filter: 'isFile'}, 
          {expand:true, cwd: 'dict/sprite/',src: ['*.png','*.gif'], dest: 'target/distribution/default/', filter: 'isFile'}, 
          //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'} // flattens results to a single level
        ]
      }
    },
 //   validation: {
 //     options: {
 //       reset: true,
 //     },
 //     files: {
 //       src: ["_gh_pages/**/*.html"]
 //     }
 //   },

    spritepacker: {
      default_options: {
        options: {
          // Path to the template for generating metafile:
          template: 'dict/sprite/dict-sprite.styl.tpl',
          // Destination metafile:
          destCss:  'dict/sprite/dict-sprite.styl',
          // Base URL for sprite image, used in template
          baseUrl: 'default/',
          padding: 2,
        },
        files: {
          'dict/sprite/sprites.png': [
            'lib/jwe/default/icons/*.*',
            'dict/img/icons/*.*',
          ]
        }
      }
    },

    stylus: {
      compile: {
        options: {
          paths: ['dict/sprite/'],
          import : ['dict-sprite'],
        },
        files: {
          'dict/css/dict.common.css': ['dict/css/dict.common.styl' ], // compile and concat into single file
          'lib/jwe/jquery.windows-engine.css': ['lib/jwe/jquery.windows-engine.styl'], 
        }
      }
    },

    watch: {
      script: {
        files: ['dict/js/*.js',
                'lib/**/*',
        ],
        tasks: ['jshint','dist']
      },
      css: {
        files : [
          'dict/css/*.styl',
          'lib/jwe/jquery.windows-engine.styl',
        ],
        tasks: ['stylus','dist-css']
      },
      // test: {
      //   files: '<%= jshint.test.src %>',
      //   tasks: ['jshint:test']
      // }
    },
  

  }); // End grunt.initConfig


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sprite-packer');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // TODO
  //grunt.loadNpmTasks('grunt-imagine');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  //grunt.loadNpmTasks('grunt-html-validation');


  // Docs HTML validation task
  //grunt.registerTask('validate-docs', ['jekyll', 'validation']);

  // Test task.
  // var testSubtasks = ['jshint', 'qunit', 'validate-docs'];
  var testSubtasks = ['jshint'];

  grunt.registerTask('test', testSubtasks);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['cssmin']);

  // Sprite 
  grunt.registerTask('sprite', ['spritepacker','stylus']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'copy', 'dist-css', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['dist']);

  // task for building customizer
  grunt.registerTask('build-min', 'Modify html files using minimized scripts/css.', function () {
    var fs = require('fs')

    function getFiles(type) {
      var files = {}
      fs.readdirSync(type)
        .filter(function (path) {
          return new RegExp('\\.' + type + '$').test(path)
        })
        .forEach(function (path) {
          return files[path] = fs.readFileSync(type + '/' + path, 'utf8')
        })
      return 'var __' + type + ' = ' + JSON.stringify(files) + '\n'
    }

    var customize = fs.readFileSync('test.html', 'utf-8')
    var files = '<!-- generated -->\n<script id="files">\n' + getFiles('js') + getFiles('less') + '<\/script>\n<!-- /generated -->'
    fs.writeFileSync('customize.html', customize.replace(/<!-- generated -->(.|[\n\r])*<!-- \/generated -->/, files))
  });
};

