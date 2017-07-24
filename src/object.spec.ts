import { everyKey, omap } from "./object";
import Dictionary = _.Dictionary;
describe("object", () => {
    describe('When creating', () => {
        it('should be awesome', () => {
            expect(true).toEqual(true)
        })
    });

    type OT = Dictionary<Dictionary<Array<string | number | boolean>>>;

    let obj: OT;
    beforeEach(() => {
        obj = {
            foo   : { foo: [ 'bar' ], bar: [ 'foo' ] },
            bar   : { foo: [ 1 ], bar: [ 1 ] },
            foobar: { foo: [ true ], bar: [ false ] }
        }

    })
    // describe('everyKey', () => {
    //     omap(obj, (obj: OT, key: string) => {
    //         obj.foo.foo = [ 1 ]
    //         obj.bar.foo = [ 'as' ]
    //         return obj;
    //     })
    // })
});
