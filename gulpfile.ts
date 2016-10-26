import * as gulp from "gulp";
import * as karma from "karma";
import * as fs from 'fs';
import * as path from 'path'

//import * as gulp from 'gulp'

/**
 * @type {gulp}
 */
var //gulp        = require("gulp"),
    pump         = require('pump'),
    browserify   = require("browserify"),
    source       = require("vinyl-source-stream"),
    buffer       = require("vinyl-buffer"),
    tslint       = require("gulp-tslint"),
    tsc          = require("gulp-typescript"),
    sourcemaps   = require("gulp-sourcemaps"),
    uglify       = require("gulp-uglify"),
    rollup       = require('gulp-rollup'),
    rename       = require("gulp-rename"),
    runSequence  = require("run-sequence"),
    mocha        = require("gulp-mocha"),
    istanbul     = require("gulp-istanbul"),
    jasmine      = require("gulp-jasmine"),
    clean        = require('gulp-clean'),
    SpecReporter = require('jasmine-spec-reporter'),
    _            = require('lodash')
    ;

let c = {
    src          : [ 'src/**/*.ts' ],
    fileName     : 'util',
    moduleName   : '@radic/util',
    umdModuleName: 'radic.util'
}

gulp.task('clean', [ 'clean:src', 'clean:build' ])
gulp.task('clean:build', () => gulp.src([ 'dist', 'dts', 'es', 'lib', 'umd', 'coverage', 'radic.util.*' ]).pipe(clean()))
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
        "src/**/*.ts"
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

gulp.task('build-umd:minify', ['build-umd'], (cb) => {
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
        "spec/**/*Spec.js"
    ])
        .pipe(jasmine({
            reporter: new SpecReporter(),
            config  : require('./spec/support/jasmine.json')
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

gulp.task("default", (cb) => {
    runSequence(
        "build",
        "test",
        cb);
});
