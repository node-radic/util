import * as gulp from "gulp";
import { WatchOptions } from "gulp";
import * as _ from "lodash";

const
    pump        = require('pump'),
    uglify      = require("gulp-uglify"),
    rollup      = require('gulp-rollup'),
    rename      = require("gulp-rename"),
    runSequence = require("run-sequence"),

    clean       = require('gulp-clean'),
    ghPages     = require("gulp-gh-pages"),
    size        = require("gulp-filesize"),

    tsc         = require('gulp-typescript'),
    ts          = require('typescript')
;
const c         = {
    src          : [ 'src/**/*.ts',
        "!src/**/*.spec.ts" ],
    fileName     : 'util',
    moduleName   : '@radic/util',
    umdModuleName: 'radic.util'
}

const tsProject = {
    es  : tsc.createProject("tsconfig.json", { typescript: ts, module: "es2015", }),
    src : tsc.createProject("tsconfig.json", { typescript: ts }),
    lib : tsc.createProject("tsconfig.json", { typescript: ts, module: 'commonjs' }),
    amd : tsc.createProject("tsconfig.json", { typescript: ts, module: 'amd' }),
    dts : tsc.createProject("tsconfig.json", { typescript: ts, declaration: true, noResolve: false }),
    test: tsc.createProject("tsconfig.json", { target: "es6", sourceMap: true, typescript: ts })
};
gulp.task('clean', [ 'clean:src:js', 'clean:build', 'clean:docs' ], (cb) => pump([ gulp.src([ '.nyc_output', 'coverage' ]), clean() ]))
gulp.task('clean:docs', (cb) => pump([ gulp.src([ 'docs', '.publish' ]), clean() ]))
gulp.task('clean:build', (cb) => pump([ gulp.src([ 'lib', 'lib-es6','es', 'dts', 'coverage', '.publish', 'docs' ]), clean() ]));
gulp.task('clean:watch', (cb) => pump([ gulp.src([ 'lib', 'dts' ]), clean() ]));

gulp.task('clean:src:js', (cb) => pump([ gulp.src([ '{src,examples}/*.{js,js.map}', '*.{js,js.map}' ]), clean() ]));
gulp.task('clean:test:js', (cb) => pump([ gulp.src([ '{tests}/*.{js,js.map}', '*.{js,js.map}' ]), clean() ]));

gulp.task('clean:dts:js', (cb) => pump([ gulp.src([ 'dts/**/*.js' ]), clean() ]))

gulp.task("build:lib:es", (cb) => pump([
    gulp.src(c.src),
    tsProject.es(),
    gulp.dest("es/")
]))

gulp.task("build:dts:ts", (cb) => pump([
    gulp.src(c.src),
    tsProject.dts(),
    gulp.dest('dts/')
]))

gulp.task('build:lib', (cb) => pump([
    gulp.src(c.src),
    tsProject.lib(),
    gulp.dest("lib/")
]))

gulp.task('build:src', (cb) => pump([
    gulp.src(c.src),
    tsProject.src(),
    gulp.dest("src/")
]))

gulp.task("build:test", [ 'build:src' ], (cb) => pump([
    gulp.src([ "tests/**/*.ts" ]),
    tsProject.test(),
    gulp.dest("tests/")
]))

gulp.task('build:dts', (cb) => runSequence('build:dts:ts', 'clean:dts:js', cb))

gulp.task("build:watch", (cb) => runSequence(
    "clean:watch",
    [ 'build:lib', 'build:dts' ],
    cb
));
gulp.task('watch', () => { gulp.watch(c.src, <WatchOptions>{ debounceDelay: 3000, interval: 3000 }, [ 'build:watch' ])})


gulp.task('build:umd', [ 'build:lib:es' ], () => pump([
    gulp.src('es/**/*.js'),
    rollup({
        entry     : './es/index.js',
        format    : 'umd',
        moduleName: 'radic.util',
        globals   : { lodash: '_' },

    }),
    gulp.dest('./'),
    clean(),
    rename('radic.util.js'),
    gulp.dest('./'),
    size()
]))

gulp.task('build:umd:minify', [ 'build:umd' ], () => pump([
    gulp.src('./radic.util.js'),
    uglify(),
    rename('radic.util.min.js'),
    gulp.dest('./'),
    size()
]))


gulp.task("build", (cb) => runSequence(
    "clean",
    [ "build:src", "build:lib", 'build:lib:es', 'build:dts', 'build:umd', 'build:umd:minify' ],
    "build:test", cb
));


gulp.task("default", [ 'build' ])


gulp.task('ghpages', () => pump([ gulp.src('./docs/**/*'), ghPages({
    remoteUrl: 'github.com:node-radic/util'
}) ]));
