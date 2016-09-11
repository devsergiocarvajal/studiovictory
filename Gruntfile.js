'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadTasks('grunt');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jscs: {
      options: {
        config: '.jscsrc',
        reporter: 'checkstyle'
      },
      src: [
        'Gruntfile.js',
        'src/**/*.js',
        '!src/public/bower_components/**'
      ]
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: 'checkstyle'
      },
      src: [
        'Gruntfile.js',
        'src/**/*.js',
        '!src/public/bower_components/**'
      ]
    },
    githooks: {
      all: {
        options: {
          endMarker: ''
        },
        'pre-commit': 'analyze',
        'pre-push': 'test',
        'post-checkout': 'shell:gitLog',
        'post-commit': 'shell:gitLog',
        'post-merge': 'shell:gitLog shell:npmInstall'
      }
    },
    shell: {
        gitLog: {
            command: 'git log -1 > git-info.txt'
        },
        npmInstall: {
            command: 'npm install'
        },
        vagrantLogs: {
            command: 'vagrant ssh -c "cd /vagrant && pm2 logs"'
        },
        vagrantStatus: {
            command: 'vagrant ssh -c "cd /vagrant && pm2 list"'
        },
        vagrantStop: {
            command: 'vagrant ssh -c "cd /vagrant && pm2 kill"'
        },
        vagrantDelete: {
            command: 'vagrant ssh -c "cd /vagrant && pm2 delete pm2.json"'
        },
        vagrantStart: {
            command: 'vagrant ssh -c "cd /vagrant && pm2 start pm2.json"'
        }
    },
    mochaTest: {
        all: {
            reporter: 'spec'
        },
        src: ['test/**/*Test.js', '!test/public/js/*Test.js']
    },
    karma: {
        client: {
            configFile: 'karma.config.js'
        }
    },
    stylus: {
        compile: {
            options: {
                compress: true,
                paths: ['source/stylus']
            },
            files: {
                'src/public/css/stylus.css': 'src/stylus/style.styl'
            }
        }
    }
});

 // Code tasks
grunt.registerTask('default', ['test']);
grunt.registerTask('test', 'Runs unit tests', ['mochaTest','karma:client']);
grunt.registerTask('analyze', 'Validates code style', ['jshint','jscs']);

grunt.registerTask('status', 'Shows status of node processes', ['shell:vagrantStatus']);
grunt.registerTask('stop', 'Stop node processes', ['shell:vagrantStatusStop']);
grunt.registerTask('start', 'Start node processes', ['shell:vagrantStart']);
grunt.registerTask('restart', 'Restart node processes', ['stop', 'start']);
grunt.registerTask('logs', 'Tail logs for all pm2 processes', ['shell:vagrantLogs']);
};
