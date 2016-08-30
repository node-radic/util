"use strict";
var config_1 = require('../../lib/config');
describe("Config", function () {
    var defaultConfig = {
        foo: 'bar',
        fooNum: 1,
        fooBool: true
    };
    var _config = new config_1.Config();
    var config = config_1.Config.makeProperty(_config);
    beforeEach(function () {
        _config = new config_1.Config(defaultConfig);
        config = config_1.Config.makeProperty(_config);
    });
    it("should be able to config", function () {
        player.play(song);
        expect(player.currentlyPlayingSong).toEqual(song);
        //demonstrates use of custom matcher
        expect(player).toBePlaying(song);
    });
    //
    // describe("when song has been paused", function() {
    //     beforeEach(function() {
    //         player.play(song);
    //         player.pause();
    //     });
    //
    //     it("should indicate that the song is currently paused", function() {
    //         expect(player.isPlaying).toBeFalsy();
    //
    //         // demonstrates use of 'not' with a custom matcher
    //         expect(player).not.toBePlaying(song);
    //     });
    //
    //     it("should be possible to resume", function() {
    //         player.resume();
    //         expect(player.isPlaying).toBeTruthy();
    //         expect(player.currentlyPlayingSong).toEqual(song);
    //     });
    // });
    //
    // // demonstrates use of spies to intercept and test method calls
    // it("tells the current song if the user has made it a favorite", function() {
    //     spyOn(song, 'persistFavoriteStatus');
    //
    //     player.play(song);
    //     player.makeFavorite();
    //
    //     expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
    // });
    //
    // //demonstrates use of expected exceptions
    // describe("#resume", function() {
    //     it("should throw an exception if song is already playing", function() {
    //         player.play(song);
    //
    //         expect(function() {
    //             player.resume();
    //         }).toThrowError("song is already playing");
    //     });
    // });
});
//# sourceMappingURL=configSpec.js.map