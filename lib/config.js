"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var object_1 = require('./object');
var lodash_1 = require('lodash');
var Config = (function () {
    function Config(obj) {
        this.allDelimiters = {};
        this.addDelimiters('config', '<%', '%>');
        this.defaults = obj || {};
        this.data = lodash_1.cloneDeep(this.defaults);
    }
    Config.prototype.unset = function (prop) {
        prop = prop.split('.');
        var key = prop.pop();
        var obj = object_1.objectGet(this.data, Config.getPropString(prop.join('.')));
        delete obj[key];
    };
    Config.prototype.has = function (prop) {
        return object_1.objectExists(this.data, Config.getPropString(prop));
    };
    Config.prototype.raw = function (prop) {
        if (prop) {
            return object_1.objectGet(this.data, Config.getPropString(prop));
        }
        else {
            return this.data;
        }
    };
    Config.prototype.get = function (prop, def) {
        return this.process(this.raw(prop));
    };
    Config.prototype.set = function (prop, value) {
        object_1.objectSet(this.data, Config.getPropString(prop), value);
        return this;
    };
    Config.prototype.merge = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (args.length === 1) {
            this.data = lodash_1.merge(this.data, args[0]);
        }
        else {
            var prop = args[0];
            this.set(prop, lodash_1.merge(this.raw(prop), args[1]));
        }
        return this;
    };
    Config.prototype.process = function (raw) {
        var self = this;
        return object_1.recurse(raw, function (value) {
            if (typeof value !== 'string') {
                return value;
            }
            var matches = value.match(Config.propStringTmplRe);
            var result;
            if (matches) {
                result = self.get(matches[1]);
                if (result != null) {
                    return result;
                }
            }
            return self.processTemplate(value, { data: self.data });
        });
    };
    Config.prototype.addDelimiters = function (name, opener, closer) {
        var delimiters = this.allDelimiters[name] = {};
        delimiters.opener = opener;
        delimiters.closer = closer;
        var a = delimiters.opener.replace(/(.)/g, '\\$1');
        var b = '([\\s\\S]+?)' + delimiters.closer.replace(/(.)/g, '\\$1');
        delimiters.lodash = {
            evaluate: new RegExp(a + b, 'g'),
            interpolate: new RegExp(a + '=' + b, 'g'),
            escape: new RegExp(a + '-' + b, 'g')
        };
    };
    Config.prototype.setDelimiters = function (name) {
        var delimiters = this.allDelimiters[name in this.allDelimiters ? name : 'config'];
        return delimiters;
    };
    Config.prototype.processTemplate = function (tmpl, options) {
        if (!options) {
            options = {};
        }
        var delimiters = this.setDelimiters(options.delimiters);
        var data = Object.create(options.data || this.data || {});
        var last = tmpl;
        try {
            while (tmpl.indexOf(delimiters.opener) >= 0) {
                tmpl = lodash_1.template(tmpl)(data);
                if (tmpl === last) {
                    break;
                }
                last = tmpl;
            }
        }
        catch (e) {
        }
        return tmpl.toString().replace(/\r\n|\n/g, '\n');
    };
    Config.makeProperty = function (config) {
        var cf = function (prop) {
            return config.get(prop);
        };
        cf.get = config.get.bind(config);
        cf.set = config.set.bind(config);
        cf.unset = config.unset.bind(config);
        cf.merge = config.merge.bind(config);
        cf.raw = config.raw.bind(config);
        cf.process = config.process.bind(config);
        cf.has = config.has.bind(config);
        return cf;
    };
    Config.getPropString = function (prop) {
        return Array.isArray(prop) ? prop.map(this.escape).join('.') : prop;
    };
    Config.escape = function (str) {
        return str.replace(/\./g, '\\.');
    };
    Config.prototype.toString = function () {
        return this.raw();
    };
    Config.propStringTmplRe = /^<%=\s*([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)\s*%>$/i;
    return Config;
}());
exports.Config = Config;
var PersistentConfig = (function (_super) {
    __extends(PersistentConfig, _super);
    function PersistentConfig(obj, persistenceFilePath) {
        _super.call(this, obj);
        this.load();
    }
    PersistentConfig.prototype.save = function () {
    };
    PersistentConfig.prototype.load = function () {
    };
    PersistentConfig.prototype.unset = function (prop) {
        _super.prototype.unset.call(this, prop);
        this.save();
        return this;
    };
    PersistentConfig.prototype.merge = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.prototype.merge.call(this, args);
        this.save();
        return this;
    };
    PersistentConfig.prototype.set = function (prop, value) {
        _super.prototype.set.call(this, prop, value);
        this.save();
        return this;
    };
    return PersistentConfig;
}(Config));
exports.PersistentConfig = PersistentConfig;
