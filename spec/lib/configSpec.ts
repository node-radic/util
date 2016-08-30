import { Config, IConfig } from '../../lib/config'



describe("Config", () => {
    let defaultConfig = {
        foo     : 'bar',
        fooNum  : 1,
        fooBool : true
    }

    let config: IConfig = new Config(defaultConfig)

    beforeEach(() => {
        config = new Config({ foo : 'bar' })
    })

    describe('when creating', ()=> {
        it('should accept defaults', () => {
            expect(config.get('foo')).toEqual('bar')
        })
        it('can override defaults', () => {
            config.set('foo', 'foobar')
            expect(config.get('foo')).toEqual('foobar')
        })
        it('can process values from defaults', () => {
            config.set('barfoo', 'is:<%= foo %>')
            expect(config.get('barfoo')).toEqual('is:bar')
        })
    })



    it("should be able to set config", function () {
        config.set('path.to.config.foo', 'bar')
        expect(config.get('path.to.config.foo')).toEqual('bar')
    })


    //
    // describe("when song has been paused", function() {
    //     beforeEach(function() {
    //         player.play(song)
    //         player.pause()
    //     })
    //
    //     it("should indicate that the song is currently paused", function() {
    //         expect(player.isPlaying).toBeFalsy()
    //
    //         // demonstrates use of 'not' with a custom matcher
    //         expect(player).not.toBePlaying(song)
    //     })
    //
    //     it("should be possible to resume", function() {
    //         player.resume()
    //         expect(player.isPlaying).toBeTruthy()
    //         expect(player.currentlyPlayingSong).toEqual(song)
    //     })
    // })
    //
    // // demonstrates use of spies to intercept and test method calls
    // it("tells the current song if the user has made it a favorite", function() {
    //     spyOn(song, 'persistFavoriteStatus')
    //
    //     player.play(song)
    //     player.makeFavorite()
    //
    //     expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true)
    // })
    //
    // //demonstrates use of expected exceptions
    // describe("#resume", function() {
    //     it("should throw an exception if song is already playing", function() {
    //         player.play(song)
    //
    //         expect(function() {
    //             player.resume()
    //         }).toThrowError("song is already playing")
    //     })
    // })
})
