#!/usr/bin/node --harmony
var path = require('path'),
    fs   = require('fs');


var args = process.argv.splice(2);
var command = args.shift();

var tasks = {
    declarations: function () {

        var dir = path.join(__dirname, 'lib');
        var files = fs.readdirSync(dir);
        var out = '';

        files.filter(function (name) {
            return /^.*?\.d\.ts$/m.test(name) !== false;
        }).forEach((function (fileName) {
            out += fs.readFileSync(path.join(dir, fileName), 'utf-8');
        }))

        fs.writeFileSync('index.d.ts', out)

        console.log(files)
    },
    test: function () {

        var Jasmine = require('jasmine');
        var jrunner = new Jasmine();
        var SpecReporter = require('jasmine-spec-reporter');
        var noop = function () {
        };

        jrunner.configureDefaultReporter({print: noop});
        jasmine.getEnv().addReporter(new SpecReporter());
        jrunner.loadConfigFile('spec/support/jasmine.json');
        jrunner.onComplete(function (passed) {
            if ( passed ) {
                console.log('All specs have passed');
            }
            else {
                console.log('At least one spec has failed');
            }
        });
        jrunner.execute();
    },
    concat: function () {

        var order = ['general', 'object', 'functions', 'JSON', 'material', 'config', 'storage'];
        var destFilePath = path.join(__dirname, 'radic-util.js');
        if (fs.existsSync(destFilePath)) {
            fs.unlinkSync(destFilePath);
        }
        fs.writeFileSync(destFilePath, '');
        order.forEach(function (name) {
            var filePath = path.join(__dirname, 'lib', name + '.js');
            fs.appendFileSync(destFilePath, fs.readFileSync(filePath, 'utf-8') + '\n\n;\n')
        })
    },
    build: function () {
        throw new Error('deprecated');
        var order = ['general', 'object', 'functions', 'JSON', 'material', 'config', 'storage'];
        var files = order.map(function (item) {
            return path.join('lib', item + '.ts')
        })
        var opts = '--module system --target es5 --emitDecoratorMetadata --experimentalDecorators --declaration --removeComments'
        var cmd = 'tsc ' + opts + ' ' + files.join(' ')
        var res = require('child_process').execSync(cmd).toString();
        console.log('res', res);
    }
}


if (!tasks[command]){
    throw new Error('Not a workinng command')
}
tasks[command]();


process.exit()
