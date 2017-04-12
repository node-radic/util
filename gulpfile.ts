import * as gulp from "gulp";
import * as karma from "karma";
import * as fs from 'fs';
import * as chalk from 'chalk'
import * as _ from 'lodash'
import * as path from 'path'
import { GulpPlugin, SrcMethod, TaskCallback } from "gulp";

//import * as gulp from 'gulp'

/**
 * https://www.npmjs.com/package/gulp-git
 */
declare interface GulpGit {
    /** Adds files to repo **/
    add(opts?: { args?: string, quiet?: boolean, maxBuffer?: number }): this | any
    addRemote(...opts: any[]): this | any
    addSubmodule(...opts: any[]): this | any
    branch(...opts: any[]): this | any
    catFile(...opts: any[]): this | any
    checkout(...opts: any[]): this | any
    checkoutFiles(...opts: any[]): this | any
    clean(...opts: any[]): this | any
    clone(...opts: any[]): this | any
    commit(message?: string, opts?: { args?: string, cwd?: string, maxBuffer?: number, quiet?: boolean, disableMessageRequirement?: boolean, disableAppendPaths?: boolean, multiline?: boolean }): this | any
    diff(...opts: any[]): this | any
    exec(...opts: any[]): this | any
    fetch(...opts: any[]): this | any
    init(...opts: any[]): this | any
    merge(...opts: any[]): this | any
    pull(...opts: any[]): this | any
    push(remote?: string, branch?: string | null, opt?: { args?: string, cwd?: string, quiet?: boolean }, cb?: (err: Error) => void): this | any
    removeRemote(...opts: any[]): this | any
    reset(...opts: any[]): this | any
    revParse(...opts: any[]): this | any
    rm(...opts: any[]): this | any
    stash(...opts: any[]): this | any
    status(...opts: any[]): this | any
    tag(...opts: any[]): this | any
    updateSubmodule(...opts: any[]): this | any
}
import * as inquirer from 'inquirer';
import { Questions } from "inquirer";
import { inspect } from "./src/functions";


interface GulpPrompt {
    confirm(msg?: string)
    confirm(opts?: { message: string, default: boolean })
    prompt(opts?: Questions, cb?: (res: any) => void)
}


/**
 * @type {gulp}
 */
const  //gulp        = require("gulp"),
    pump               = require('pump'),
    browserify         = require("browserify"),
    git: GulpGit       = require('gulp-git'),
    source             = require("vinyl-source-stream"),
    buffer             = require("vinyl-buffer"),
    tslint             = require("gulp-tslint"),
    tsc                = require("gulp-typescript"),
    sourcemaps         = require("gulp-sourcemaps"),
    uglify             = require("gulp-uglify"),
    rollup             = require('gulp-rollup'),
    prompt: GulpPrompt = require('gulp-prompt'),
    rename             = require("gulp-rename"),
    runSequence        = require("run-sequence"),
    mocha              = require("gulp-mocha"),
    istanbul           = require("gulp-istanbul"),
    jasmine            = require("gulp-jasmine"),
    clean              = require('gulp-clean'),

    SpecReporter       = require('jasmine-spec-reporter')
;

const c = {
    src          : [ 'src/**/*.ts' ],
    fileName     : 'util',
    moduleName   : '@radic/util',
    umdModuleName: 'radic.util'
}

gulp.task('clean', [ 'clean:src', 'clean:build' ])
gulp.task('clean:build', () => gulp.src([ 'dist', 'dts', 'es', 'lib', 'umd', 'coverage' ]).pipe(clean()))
gulp.task('clean:src', () => gulp.src([ '{src,spec}/*.{js,js.map}', '*.{js,js.map}' ]).pipe(clean()))

//******************************************************************************
//* LINT
//******************************************************************************
// gulp.task("lint", function() {
//
//     var config =  { formatter: "verbose", emitError: (process.env.CI) ? true : false };
// return gulp.run
//     return gulp.src([
//         "src/**/**.ts",
//         "test/**/**.test.ts"
//     ])
//         .pipe(tslint(config))
//         .pipe(tslint.report());
// });

//******************************************************************************
//* BUILD
//******************************************************************************
var tsLibProject = tsc.createProject("tsconfig.json", { module: "es2015", declaration: true, typescript: require("typescript") });

gulp.task("build-lib", function () {
    return gulp.src([
        "src/**/*.ts",
        "!src/**/*.spec.ts"
    ])
        .pipe(tsLibProject())
        .on("error", function (err) {
            process.exit(1);
        })
        .pipe(gulp.dest("lib/"))
});

// var tsEsProject = tsc.createProject("tsconfig.json", { module: "es2015", typescript: require("typescript") });
//
// gulp.task("build-es", function () {
//     return gulp.src([
//         "src/**/*.ts"
//     ])
//         .pipe(tsEsProject())
//         .on("error", function (err) {
//             process.exit(1);
//         })
//         .js.pipe(gulp.dest("es/"));
// });
//
// var tsDtsProject = tsc.createProject("tsconfig.json", {
//     declaration: true,
//     noResolve  : false,
//     typescript : require("typescript")
// });
//
// gulp.task("build-dts", function () {
//     return gulp.src([
//         "src/**/*.ts"
//     ])
//         .pipe(tsDtsProject())
//         .on("error", function (err) {
//             process.exit(1);
//         })
//         .dts.pipe(gulp.dest("dts"));
//
// });
//
// gulp.task('build-dts:concat', [ 'build-dts' ], (done: any) => {
//     let dtsPath = path.join(process.cwd(), 'dts')
//     let dest    = path.join(process.cwd(), 'radic.util.d.ts')
//     fs.existsSync(dest) && fs.unlinkSync(dest);
//
//     let result          = require('dts-bundle').bundle({
//         name                : c.moduleName,
//         main                : 'dts/index.d.ts',
//         outputAsModuleFolder: true,
//         out                 : dest
//     })
//     let content: string = fs.readFileSync(dest, 'utf-8');
//     fs.unlinkSync(dest);
//     fs.writeFile(dest, `
// declare module "@radic/util" {
//     ${content.replace(/declare/g, '')}
// }
// `, done)
//
//
// })


gulp.task('build-umd', [ 'build-lib' ], (cb) => {
    pump([
        gulp.src('lib/**/*.js'),
        rollup({
            entry     : './lib/index.js',
            format    : 'umd',
            moduleName: 'radic.util',
            globals   : { lodash: '_' }
        }),
        gulp.dest('./'),
        clean(),
        rename('radic.util.js'),
        gulp.dest('./')
    ], cb)
});

gulp.task('build-umd:minify', [ 'build-umd' ], (cb) => {
    pump([
        gulp.src('./radic.util.js'),
        uglify(),
        rename('radic.util.min.js'),
        gulp.dest('./')
    ], cb)
})

//******************************************************************************
//* TESTS NODE
//******************************************************************************
var tstProject = tsc.createProject("tsconfig.json", { typescript: require("typescript") });

gulp.task("build-src", function () {
    return gulp.src([
        "src/**/*.ts"
    ])
        .pipe(tstProject())
        .on("error", function (err) {
            process.exit(1);
        })
        .js.pipe(gulp.dest("src/"));
});

var tsTestProject = tsc.createProject("tsconfig.json", { typescript: require("typescript") });

gulp.task("build-test", function () {
    return gulp.src([
        "spec/**/*.ts"
    ])
        .pipe(tsTestProject())
        .on("error", function (err) {
            process.exit(1);
        })
        .js.pipe(gulp.dest("spec/"));
});

gulp.task("jasmine", function () {
    return gulp.src([
        "src/**/*.spec.js"
    ])
        .pipe(jasmine({
            reporter: new SpecReporter(),
            config  : require('./jasmine.json')
        }))
});
//
// gulp.task("istanbul:hook", function () {
//     return gulp.src(["src/**/*.js"])
//         .pipe(istanbul())
//         .pipe(sourcemaps.write("."))
//         .pipe(istanbul.hookRequire());
// });

//******************************************************************************
//* TESTS BROWSER
//******************************************************************************
gulp.task("bundle-test", function () {

    var mainJsFilePath = "test/inversify.test.js";
    var outputFolder   = "temp/";
    var outputFileName = "bundle.test.js";

    var bundler = browserify({
        debug     : true,
        standalone: "inversify"
    });

    return bundler.add(mainJsFilePath)
        .bundle()
        .pipe(source(outputFileName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(outputFolder));
});

gulp.task("karma", [ "bundle-test" ], function (done) {
    new karma.Server({
        configFile: __dirname + "/karma.conf.js"
    }, function (code) {
        if ( code === 1 ) {
            console.log('Browser test failures, exiting process');
            done('Browser test Failures');
        } else {
            console.log('Browser tests passed');
            done();
        }
    }).start();
});

// https://www.npmjs.com/package/gulp-git
gulp.task('git:commit', (cb) => {
    // pump(makeGitSteps({}), cb)
    return makeGitSrc()
        .pipe(gulp.dest('./'))
        .on('error', err => console.error(err))
})
gulp.task('git:commit:auto', (cb) => {
    pump(makeGitSteps({ auto: true }).concat, cb)
})

const defautlGitOptions = {
    src : './**',
    msg : 'updates',
    push: true,
    auto: false
}

function makeGitSteps(o: any = {}): any[] {
    _.merge(o, defautlGitOptions)

    let steps = [ git.add({ args: '-A' }) ];
    if ( ! o.auto ) {
        steps.push(prompt.prompt([
            { name: 'message', type: 'input', message: 'Commit message?', default: o.msg },
            { name: 'push?', type: 'confirm', default: o.push }
        ], (res) => {
            _.merge(o, res)
        }))
    }
    steps.push(git.commit(o.msg))
    if ( o.push ) steps.push(git.push())

    return steps;
}
function makeGitSrc(o: any = {}): NodeJS.ReadWriteStream {
    _.merge(o, defautlGitOptions)
    let g: NodeJS.ReadWriteStream = gulp.src(o.src);
    makeGitSteps(o).forEach(step => g.pipe(step));
    return g;
}

// Run browser testings on AppVeyor not in Travis CI

gulp.task("test", function (cb) {
    if ( process.env.APPVEYOR ) {
        runSequence("jasmine", "karma", cb);
    } else {
        runSequence("jasmine", cb);
    }
});


//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task("build", (cb) => {
    runSequence(
        "clean",
        [ "build-src", "build-lib", 'build-umd', 'build-umd:minify' ],   // tests + build es and lib
        "build-test", cb);
});

interface TaskList {
    [name: string]: { fn: Function, dep?: string[], name: string }
}
gulp.task("default", function (cb: Function) {
    // debugger;

    const listAllTasks = (taskInstance: any, opts: any = {}) => {

        opts = _.merge({
            table: {
                head : [ 'task', 'deps' ],
                style: { compact: true }
            }
        }, opts);

        const Table           = require('cli-table')
        const tasks: TaskList = taskInstance[ 'tasks' ];
        let colWidths         = [ 0, 100 ];
        let taskNames         = Object.keys(tasks);
        let rows              = taskNames.map(key => {
            let task = tasks[ key ]
            let name = chalk.reset.green(task.name);
            let deps = task.dep.map(depName => chalk.reset.yellow(depName)).join(', ');

            if ( task.name.length > colWidths[ 0 ] )
                colWidths[ 0 ] = task.name.length + 10;
            if ( deps.length > colWidths[ 1 ] )
                colWidths[ 1 ] = deps.length;

            return [ name, deps ];
        })

        const table: any = new Table(_.merge({}, opts.table, { colWidths }));

        rows.forEach(row => table.push(row))
        console.log(table.toString());
    }

    let choices                        = [ 'List all tasks', 'clean', 'test', 'build' ];
    let questions: inquirer.Question[] = [
        { name: 'todo', type: 'list', choices, message: 'What to do?', default: choices[ 0 ] }
    ];
    inquirer.prompt(questions).catch(err => console.log(err)).then((res: any) => {
        if ( res.todo.length === 0 ) return gulp.stop();
        if ( res.todo === 'List all tasks' ) return listAllTasks(this);
        gulp.start(res.todo);
        cb();
    })

    // runSequence(
    //     "build",
    //     "test",
    //     cb);

});

gulp.task("git", (cb) => {
    runSequence(
        "default",
        "test",
        "git:commit",
        cb);
});


