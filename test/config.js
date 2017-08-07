"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const src_1 = require("../src");
let defaultConfig = {
    foo: 'bar',
    fooNum: 1,
    fooBool: true
};
let ConfigTest = class ConfigTest {
    static before() {
    }
    before() {
        this.config = new src_1.Config(defaultConfig);
    }
    testPrepareArgumentVariations() {
        this.config.get('foo').should.eq('bar');
        this.config.get().should.keys(Object.keys(defaultConfig));
        this.config.has('foo').should.be.true;
        this.config.raw('foo').should.eq('bar');
        this.config.merge({ foo: 'foobar' });
        this.config.get('foo').should.eq('foobar');
        // this.config.unset('foo');
        this.config.set('foo', false);
        this.config.get('foo', false).should.be.false;
    }
};
__decorate([
    mocha_typescript_1.test
], ConfigTest.prototype, "testPrepareArgumentVariations", null);
ConfigTest = __decorate([
    mocha_typescript_1.suite
], ConfigTest);
//# sourceMappingURL=config.js.map