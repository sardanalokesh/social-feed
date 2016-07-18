// Gruntfile.js

module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      build: ['Gruntfile.js', 'src/**/*.js']
    },

    concat: {
      options: {
        separator: ";"
      },
      dist: {
        src: ['src/app/app.js', 'src/app/**/*.js'],
        dest: 'public/js/main.js'
      }

    },

    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'public/js/main.min.js': ['public/js/main.js']
        }
      }
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/style',
          src: ['*.scss'],
          dest: 'public/css',
          ext: '.css'
        }]
      }
    },

    cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'public/css/main.min.css': 'public/css/main.css'
        }
      }
    },

    bowercopy: {
      options: {
        srcPrefix: 'bower_components'
      },
      scripts: {
        options: {
          destPrefix: 'public/'
        },
        files: {
          'js/lib/angular.min.js': 'angular/angular.min.js',
          'js/lib/angular-ui-router.min.js': 'angular-ui-router/release/angular-ui-router.min.js',
          'js/lib/angular-storage.min.js': 'a0-angular-storage/dist/angular-storage.min.js',
          'js/lib/jquery.min.js': 'jquery/dist/jquery.min.js',
          'js/lib/bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js',
          'js/lib/moment.min.js': 'moment/min/moment.min.js',
          'css/lib/bootstrap.css': 'bootstrap/dist/css/bootstrap.css',
          'css/lib/font-awesome.min.css': 'components-font-awesome/css/font-awesome.min.css',
          'css/fonts/': ['bootstrap/dist/fonts/', 'components-font-awesome/fonts/'],
          'js/lib/bootstrap-datetimepicker.min.js': 'eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
          'css/lib/bootstrap-datetimepicker.css': 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css',
          'js/lib/numbro.min.js': 'numbro/dist/numbro.min.js',
          'js/lib/languages.min.js': 'numbro/dist/languages.min.js',
          'js/lib/alasql.min.js': 'alasql/dist/alasql.min.js',
          'js/lib/xlsx.core.min.js': 'js-xlsx/dist/xlsx.core.min.js',
          'js/lib/tether.min.js': 'tether/dist/js/tether.min.js',
          'css/lib/tether.min.css': 'tether/dist/css/tether.min.css',
          'js/lib/select2.min.js': 'select2/dist/js/select2.min.js',
          'css/lib/select2.min.css': 'select2/dist/css/select2.min.css'
        }
      }
    },


    watch: {
      stylesheets: {
        files: ['src/style/*.scss'],
        tasks: ['sass', 'cssmin']
      },
      scripts: {
        files: ['src/app/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify']
      },
      less: {
        files: [ 'bower.json' ],
        tasks: [ 'exec:bower_install' , 'bowercopy']
      },
    },

    exec: {
        bower_install: {
          cmd: "bower install"
        }
    }

  });

  //load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'sass', 'cssmin']); 
  grunt.registerTask('bower', ['exec:bower_install', 'bowercopy']);
};

