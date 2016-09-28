function getParts(str) {
    return str.replace(/\\\./g, '\uffff').split('.').map(function (s) {
        return s.replace(/\uffff/g, '.');
    });
}
function objectGet(obj, parts, create) {
    if (typeof parts === 'string') {
        parts = getParts(parts);
    }
    var part;
    while (typeof obj === 'object' && obj && parts.length) {
        part = parts.shift();
        if (!(part in obj) && create) {
            obj[part] = {};
        }
        obj = obj[part];
    }
    return obj;
}
function objectSet(obj, parts, value) {
    parts = getParts(parts);
    var prop = parts.pop();
    obj = objectGet(obj, parts, true);
    if (obj && typeof obj === 'object') {
        return (obj[prop] = value);
    }
}
function objectExists(obj, parts) {
    parts = getParts(parts);
    var prop = parts.pop();
    obj = objectGet(obj, parts);
    return typeof obj === 'object' && obj && prop in obj;
}
function recurse(value, fn, fnContinue) {
    function recurse(value, fn, fnContinue, state) {
        var error;
        if (state.objs.indexOf(value) !== -1) {
            error = new Error('Circular reference detected (' + state.path + ')');
            error.path = state.path;
            throw error;
        }
        var obj, key;
        if (fnContinue && fnContinue(value) === false) {
            return value;
        }
        else if (typeof value === 'array') {
            return value.map(function (item, index) {
                return recurse(item, fn, fnContinue, {
                    objs: state.objs.concat([value]),
                    path: state.path + '[' + index + ']',
                });
            });
        }
        else if (typeof value === 'object') {
            obj = {};
            for (key in value) {
                obj[key] = recurse(value[key], fn, fnContinue, {
                    objs: state.objs.concat([value]),
                    path: state.path + (/\W/.test(key) ? '["' + key + '"]' : '.' + key),
                });
            }
            return obj;
        }
        else {
            return fn(value);
        }
    }
    return recurse(value, fn, fnContinue, { objs: [], path: '' });
}
function copyObject(object) {
    var objectCopy = {};
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            objectCopy[key] = object[key];
        }
    }
    return objectCopy;
}
function dotize(obj, prefix) {
    if (!obj || typeof obj != "object") {
        if (prefix) {
            var newObj = {};
            newObj[prefix] = obj;
            return newObj;
        }
        else
            return obj;
    }
    var newObj = {};
    function recurse(o, p, isArrayItem) {
        for (var f in o) {
            if (o[f] && typeof o[f] === "object") {
                if (Array.isArray(o[f]))
                    newObj = recurse(o[f], (p ? p : "") + (isNumber(f) ? "[" + f + "]" : "." + f), true);
                else {
                    if (isArrayItem)
                        newObj = recurse(o[f], (p ? p : "") + "[" + f + "]");
                    else
                        newObj = recurse(o[f], (p ? p + "." : "") + f);
                }
            }
            else {
                if (isArrayItem || isNumber(f))
                    newObj[p + "[" + f + "]"] = o[f];
                else
                    newObj[(p ? p + "." : "") + f] = o[f];
            }
        }
        if (isEmptyObj(newObj))
            return obj;
        return newObj;
    }
    function isNumber(f) {
        return !isNaN(parseInt(f));
    }
    function isEmptyObj(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }
    return recurse(obj, prefix);
}
export var StringType = (function () {
    function StringType(value) {
        this.value = value;
    }
    StringType.prototype.toString = function () {
        return this.value;
    };
    StringType.prototype.valueOf = function () {
        return this.value;
    };
    StringType.all = function () {
        var _this = this;
        return Object.getOwnPropertyNames(this).filter(function (item) {
            if (['length', 'name', 'prototype'].indexOf(item) === -1 && typeof _this[item] === 'object') {
                return true;
            }
        }).map(function (item) { return _this[item]; });
    };
    return StringType;
}());
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
export var DependencySorter = (function () {
    function DependencySorter() {
        this.items = [];
        this.dependencies = {};
        this.dependsOn = {};
        this.missing = {};
        this.circular = {};
        this.hits = {};
        this.sorted = {};
    }
    DependencySorter.prototype.add = function (items) {
        var _this = this;
        Object.keys(items).forEach(function (name) {
            _this.addItem(name, items[name]);
        });
    };
    DependencySorter.prototype.addItem = function (name, deps) {
        if (typeof deps === 'undefined') {
            deps = deps || [];
        }
        else if (typeof deps === 'string') {
            deps = deps.toString().split(/,\s?/);
        }
        this.setItem(name, deps);
    };
    DependencySorter.prototype.setItem = function (name, deps) {
        var _this = this;
        this.items.push(name);
        deps.forEach(function (dep) {
            _this.items.push(dep);
            if (!_this.dependsOn[dep]) {
                _this.dependsOn[dep] = {};
            }
            _this.dependsOn[dep][name] = name;
            _this.hits[dep] = 0;
        });
        this.items = _.uniq(this.items);
        this.dependencies[name] = deps;
        this.hits[name] = 0;
    };
    DependencySorter.prototype.sort = function () {
        var _this = this;
        this.sorted = [];
        var hasChanged = true;
        while (this.sorted.length < this.items.length && hasChanged) {
            hasChanged = false;
            Object.keys(this.dependencies).forEach(function (item) {
                if (_this.satisfied(item)) {
                    _this.setSorted(item);
                    _this.removeDependents(item);
                    hasChanged = true;
                }
                _this.hits[item]++;
            });
        }
        return this.sorted;
    };
    DependencySorter.prototype.satisfied = function (name) {
        var _this = this;
        var pass = true;
        this.getDependents(name).forEach(function (dep) {
            if (_this.isSorted(dep)) {
                return;
            }
            if (!_this.exists(name)) {
                _this.setMissing(name, dep);
                if (pass) {
                    pass = false;
                }
            }
            if (_this.hasDependents(dep)) {
                if (pass) {
                    pass = false;
                }
            }
            else {
                _this.setFound(name, dep);
            }
            if (_this.isDependent(name, dep)) {
                _this.setCircular(name, dep);
                if (pass) {
                    pass = false;
                }
            }
        });
        return pass;
    };
    DependencySorter.prototype.setSorted = function (item) {
        this.sorted.push(item);
    };
    DependencySorter.prototype.exists = function (item) {
        return this.items.indexOf(item) !== -1;
    };
    DependencySorter.prototype.removeDependents = function (item) {
        delete this.dependencies[item];
    };
    DependencySorter.prototype.setCircular = function (item, item2) {
        this.circular[item] = this.circular[item] || {};
        this.circular[item][item2] = item2;
    };
    DependencySorter.prototype.setMissing = function (item, item2) {
        this.missing[item] = this.missing[item] || {};
        this.missing[item][item2] = item2;
    };
    DependencySorter.prototype.setFound = function (item, item2) {
        if (typeof this.missing[item] !== 'undefined') {
            delete this.missing[item][item2];
            if (Object.keys(this.missing[item]).length > 0) {
                delete this.missing[item];
            }
        }
    };
    DependencySorter.prototype.isSorted = function (item) {
        return typeof this.sorted[item] !== 'undefined';
    };
    DependencySorter.prototype.requiredBy = function (item) {
        return typeof this.dependsOn[item] !== 'undefined' ? this.dependsOn[item] : [];
    };
    DependencySorter.prototype.isDependent = function (item, item2) {
        return typeof this.dependsOn[item] !== 'undefined' && typeof this.dependsOn[item][item2] !== 'undefined';
    };
    DependencySorter.prototype.hasDependents = function (item) {
        return typeof this.dependencies[item] !== 'undefined';
    };
    DependencySorter.prototype.hasMissing = function (item) {
        return typeof this.missing[item] !== 'undefined';
    };
    DependencySorter.prototype.isMissing = function (dep) {
        var _this = this;
        var missing = false;
        Object.keys(this.missing).forEach(function (item) {
            var deps = _this.missing[item];
            if (deps.indexOf(dep) !== -1) {
                missing = true;
            }
        });
        return missing;
    };
    DependencySorter.prototype.hasCircular = function (item) {
        return typeof this.circular[item] !== 'undefined';
    };
    DependencySorter.prototype.isCircular = function (dep) {
        var _this = this;
        var circular = false;
        Object.keys(this.circular).forEach(function (item) {
            var deps = _this.circular[item];
            if (deps.indexOf(dep) !== -1) {
                circular = true;
            }
        });
        return circular;
    };
    DependencySorter.prototype.getDependents = function (item) {
        return this.dependencies[item];
    };
    DependencySorter.prototype.getMissing = function (str) {
        if (typeof str === 'string') {
            return this.missing[str];
        }
        return this.missing;
    };
    DependencySorter.prototype.getCircular = function (str) {
        if (typeof str === 'string') {
            return this.circular[str];
        }
        return this.circular;
    };
    DependencySorter.prototype.getHits = function (str) {
        if (typeof str === 'string') {
            return this.hits[str];
        }
        return this.hits;
    };
    return DependencySorter;
}());
export { getParts, objectExists, objectGet, objectSet, copyObject, applyMixins, recurse, dotize };