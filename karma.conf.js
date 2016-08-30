module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'lib/*.js',
            'spec/*.s',
            'spec/*.s[36jm',
            'spec/*.js',
            'spec/**/*.js',
            'spec/*/*.js',
            'spec/*/*.js',
            'spec/*.js'
        ],
        exclude: [],
        preprocessors: {},
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    });
};
//# sourceMappingURL=karma.conf.js.map