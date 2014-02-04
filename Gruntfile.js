/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  var CONST = {
    dest: ['target/dict/','target/build/'],
    dest_css: ['target/dict/default/','target/build/default/']
  };

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! DICT, a second screen bookmarklet for your browser.\n' +
            '* v<%= pkg.version %>\n' +
            '* Copyright <%= grunt.template.today("yyyy")%> <%= pkg.author %> \n' +
            '* <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
            '*/\n',

    // Task configuration.
    clean: {
      dist: ['target/dict/','target/build/']
    },

    // Check javascript error
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['dict/**/*.js','lib/jquery.*.js']
      }
    },

    // Check CSS error
    csslint: {
      strict: {
        options: {
          // a value of 2 will set it to become an error. 
          import: 2
        },
        src: ['dict/_resource/css/*.css']
      },
      lax: {
        options: {
          // a value of false ignores the rule, 
          // Otherwise all rules are considered warnings.
          import: false
        },
        src: ['dict/_resource/css/*.css']
      }
    },

    // Build DICT
    concat: {
      options: {
        stripBanners: false
      },
      // Bookmark for browser (Only a loader for ui.js)
      dict_bookmarklet: {
        src: ['dict/_cmn/dict.util.share.js',
              'dict/bml/loader.js'],
        dest: 'target/build/<%= pkg.name %>_bookmarklet.js'
      },
      // Dict UI (Also is a loader for proxy.js)
      dict_ui: {
        src: [
          // lib
          'lib/jquery-1.10.2.js',
          'lib/jquery.cookie.js',
          'lib/jquery.selection.js',
          'lib/jquery.plaintext.js',
          'lib/tooltip/jquery.tipsy.js',
          'lib/jwe/jquery.windows-engine.js',
          // share
          'dict/_cmn/conf.js',
          'dict/_cmn/dict.util.js',
          'dict/_cmn/dict.util.share.js',
          // main
          'dict/bml/dict.ui.js',
          'dict/bml/dict.ui.navi.js',
          'dict/bml/dict.ui.end.js',
        ],
        dest: 'target/build/<%= pkg.name %>_ui.js'
      },
      // Dict iframe (Formatters for each sites)
      dict_proxy: {
        src: [
          // lib
          'lib/jquery-1.10.2.js',
          'lib/jquery.cookie.js',
          'lib/jquery.jsonp.js',
          'lib/bootstrap/js/bootstrap.js',
          // share
          'dict/_cmn/conf.js',
          'dict/_cmn/dict.util.js',
          // loader
          'dict/pxy/dict.proxy.loader.js',
          'dict/pxy/loaders/common.js',
          'dict/pxy/loaders/common.cache.js',
          //'dict/pxy/loaders/dict.load.gae.js', // Use yql 
          //'dict/pxy/loaders/util.gae_lb.js',
          'dict/pxy/loaders/dict.load.google.js',
          'dict/pxy/loaders/dict.load.yql.js',
          // formatter(Notice: Priority - Decide which is use, when google show both results in bellow formatter.)
          'dict/pxy/dict.proxy.formatter.js',
          'dict/pxy/formaters/common.js',
          'dict/pxy/formaters/dict.formatter.auto.js',
          'dict/pxy/formaters/dict.formatter.google.js',
          'dict/pxy/formaters/dict.formatter.weblio.js',
          'dict/pxy/formaters/dict.formatter.wiki_jp.js',
          'dict/pxy/formaters/dict.formatter.ewords.js',
          //'dict/pxy/formaters/dict.formatter.weblio_small.js',
          // main (MUST defined at last)
          'dict/pxy/dict.proxy.js', 
        ],
        dest: 'target/build/<%= pkg.name %>_proxy.js'
      },
      // CSS
      dict_ui_css: {
        src: [
          'lib/jwe/jquery.windows-engine.css',
          'lib/tooltip/tipsy.css',
          'dict/_resource/css/dict.ui.css',
        ],
        dest: 'target/build/<%= pkg.name %>_ui.css'
      },
      dict_proxy_css: {
        src: [
          'lib/bootstrap/css/bootstrap.css',
          'dict/_resource/css/dict.proxy.css',
        ],
        dest: 'target/build/<%= pkg.name %>_proxy.css'
      }
    },

    // Css minify for release
    cssmin: {
      compress: {
        files: {
          'target/dict/<%= pkg.name %>_ui.css':['<%= concat.dict_ui_css.dest %>'],
          'target/dict/<%= pkg.name %>_proxy.css':['<%= concat.dict_proxy_css.dest %>'],
        },
      }
    },

    // Remove console log for release
    removelogging: {
      dict_ui: {
        src: "<%= concat.dict_ui.dest %>",
        dest: "target/build/<%= pkg.name %>_ui_clean.js",
        options: {
          // Use default
        }
      },
      dict_proxy: {
        src: "<%= concat.dict_proxy.dest %>",
        dest: "target/build/<%= pkg.name %>_proxy_clean.js",
        options: {
          // Use default
        }
      }
    },

    // Javascript minify for release
    uglify: {
      options: {
        preserveComments: 'some',
      },
      // Bookmarklet: No sourceMap, No stripBanner!
      dict_bookmarklet: {
        src: ['<%= concat.dict_bookmarklet.dest %>'],
        dest: 'target/dict/<%= pkg.name %>_bookmarklet.js'
      },
      // Change for old browsers: "//# sourceMappingURL" to "//@ sourceMappingURL"
      // Or fix it in "node_modules\grunt-contrib-uglify"
      dict_ui: {
        options: {
          banner: '<%= banner %>',
          sourceMap: getMapPath,
          sourceMappingURL: '<%= pkg.name %>_ui.map',
          sourceMapIncludeSources: true,
          sourceMapPrefix: 2,
          sourceMapRoot: '/build'
        },
        files: {'target/dict/<%= pkg.name %>_ui.js': ['<%= concat.dict_ui.dest %>'],}
      },
      dict_proxy: {
        options: {
          banner: '<%= banner %>',
          sourceMap: getMapPath, // where to output sourcemap
          // If not set, it will be NG: sources="target/dict/dict_proxy.map" in map
          sourceMappingURL: '<%= pkg.name %>_proxy.map', 
          sourceMapIncludeSources: true, // Not work???
          // 1) + 2) = /build/dict_proxy.map (source path)
          sourceMapPrefix: 2,      // 1) target/dict/dict_proxy.map --> /dict_proxy.map (remove target/dict)
          sourceMapRoot: '/build', // 2) As source & minified file not in same folder. Source in `/build`
        },
        files: {
            'target/dict/<%= pkg.name %>_proxy.js': ['<%= concat.dict_proxy.dest %>'],
        },
        /* // Same as above
        files: [{
            expand: true,
            cwd :  'target/build/', // Remove 'target/' in map files
            src : ['<%= pkg.name %>_proxy.js'],
            dest:  'target/dict/',
            filter: 'isFile',
        }],
        */
      },
      dict_ui_clean: {
        options: {
          banner: '<%= banner %>',
        },
        src: ['<%= removelogging.dict_ui.dest %>'],
        dest: 'target/dict/<%= pkg.name %>_ui_clean.js'
      },
      dict_proxy_clean: {
        options: {
          banner: '<%= banner %>',
        },
        src: ['<%= removelogging.dict_proxy.dest %>'],
        dest: 'target/dict/<%= pkg.name %>_proxy_clean.js'
      },
    },

    // Start a default static web server(Need build)
    connect: {
      // grunt connect:server:keepalive
      server: {
        options: {
          protocol : 'https',
          port : 8443,
          keepalive: true,
          base: './target'
        }
      },
    },

    // Copy static resources
    copy: {
      main: {
        files: [
          //{src: ['lib/jwe/default/*'], dest: 'lib/pkg/default/', filter: 'isFile'}, // includes files in path
          //{src: ['path/**'], dest: 'dest/'}, // includes files in path and its subdirs
          //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'}, // makes all src relative to cwd
          //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'} // flattens results to a single level

          // Copy images
          // For test
          {expand:true, cwd: 'dict/bml/test/'   ,src: ['*'],      dest: 'target/build/test/'}, 
          {expand:true,                          src: ['lib/**'], dest: 'target/'}, 
        ]
      },
      html: {
        files: [].concat(copyToMulti('dict/pxy/',        'proxy.html', CONST.dest    ))
      },
      img: {
        files: [].concat(copyToMulti('lib/jwe/default/',  '*_mid.gif', CONST.dest_css))
                 .concat(copyToMulti('dict/_resource/sprite/','*.png', CONST.dest_css))
          .concat(copyToMulti('dict/_resource/img/',          ['*.*'], CONST.dest_css))
      }

    },

/*
    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: ['js/tests/*.html']
    },

   validation: {
     options: {
       reset: true,
     },
     files: {
       src: ['_gh_pages/*.html']
     }
   },
*/
    spritepacker: {
      default_options: {
        options: {
          // Path to the template for generating metafile:
          template: 'dict/_resource/sprite/dict-sprite.styl.tpl',
          // Destination metafile:
          destCss:  'dict/_resource/sprite/dict-sprite.styl',
          // Base URL for sprite image, used in template
          baseUrl: 'default/',
          padding: 2,
        },
        files: {
          'dict/_resource/sprite/sprites.png': ['<%= watch.img_sprite.files %>']
        }
      }
    },

    stylus: {
      compile: {
        options: {
          paths: ['dict/_resource/sprite/'],
          import : ['dict-sprite'],
        },
        files: {
          'dict/_resource/css/dict.proxy.css': ['dict/_resource/css/dict.proxy.styl' ],
          'dict/_resource/css/dict.ui.css': ['dict/_resource/css/dict.ui.styl' ],
          'lib/jwe/jquery.windows-engine.css': ['lib/jwe/jquery.windows-engine.styl'], 
        }
      }
    },

    watch: {
      script: {
        files: ['dict/**/*.js',
                'lib/**/*',
                'Gruntfile.js'
        ],
        tasks: ['jshint','dist']
      },
      css_sprite: {
        files : [
          'dict/_resource/css/*.styl',
          'lib/jwe/jquery.windows-engine.styl',
        ],
        tasks: ['stylus','dist-css']
      },
      img_sprite: {
        files : [
          'lib/jwe/default/icons/*.*',
          'dict/_resource/img/icons/*.*'
        ],
        tasks: ['stylus','dist-css','copy']
      },
      html: {
        files: ['dict/**/*.html'],
        tasks: ['copy:html']
      },

      // test: {
      //   files: '<%= jshint.test.src %>',
      //   tasks: ['jshint:test']
      // }
    },

    htmlbuild: {
      dist: {
        src:  'target/dict/proxy.html',
        dest: 'target/dict/proxy-min.html',
        options: {
          beautify: false,// Keep tab
          relative: true,
          scripts: {
            dict_proxy: 'target/dict/dict_proxy.js',
          },
          styles: {
            dict_proxy: 'target/dict/dict_proxy.css',
          },
          data: {
            // Data to pass to templates
            version: '<%= pkg.version %>',
          },
        }
      }
    },
  

  }); // End grunt.initConfig

  // A shortcut for copy file to multi dirs at once (google keyword: grunt copy multi dest) : 
  // {expand:true, cwd: 'lib/jwe/default/', src: ['*_mid.gif'],     dest: 'target/dict/default/' },
  // {expand:true, cwd: 'lib/jwe/default/', src: ['*_mid.gif'],     dest: 'target/build/default/'},
  function copyToMulti(p_cwd, p_src, p_dests) {
    var arr = [];
    for (var i in p_dests) {
      arr.push({expand:true, cwd:p_cwd, src: p_src, dest: p_dests[i]});
    }
    return arr;
  }

  function getMapPath(path) { return path.replace(/.js/,".map")}

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.loadNpmTasks('grunt-sprite-packer');
  grunt.loadNpmTasks("grunt-remove-logging");

  grunt.loadNpmTasks('grunt-html-build');

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

  // JS build task.
  grunt.registerTask('dist-js', ['jshint','removelogging','uglify']);

  // CSS build task.
  grunt.registerTask('dist-css', ['cssmin']); // 'sprite' should manually because it depends imagick

  // HTML build task.
  grunt.registerTask('dist-html', ['htmlbuild']);

  // Sprite 
  grunt.registerTask('sprite', ['spritepacker','stylus']);

  // Full build task.
  grunt.registerTask('dist', ['clean', 'copy','concat', 'dist-css', 'dist-js', 'dist-html']);

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

