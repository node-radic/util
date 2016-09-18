import typescript from 'rollup-plugin-typescript'
import uglify from 'rollup-plugin-uglify'

export default {
    entry: './index.ts',
    dest: './dist/radic.util.js',
    format: 'umd',
    moduleName: 'radic.util',
    plugins   : [
        typescript({
            typescript: require('typescript'),
            tsconfig: false
        }),

        //uglify()
    ]
}
