export var getCallerFile = function getCallerFile(_position) {
    if (_position === void 0) { _position = 2; }
    var oldPrepareStackTrace = Error['prepareStackTrace'];
    Error['prepareStackTrace'] = function (err, stack) {
        return stack;
    };
    var stack = (new Error()).stack;
    Error['prepareStackTrace'] = oldPrepareStackTrace;
    var position = _position ? _position : 2;
    return stack[position] ? stack[position].getFileName() : undefined;
};
function inspect() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    args.forEach(function (arg) { return console.dir(arg, { colors: true, depth: 5, showHidden: true }); });
}
export { inspect };
