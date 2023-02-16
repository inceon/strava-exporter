import {copy} from 'esbuild-plugin-copy'
import {clean} from 'esbuild-plugin-clean'
import {build} from 'esbuild'

const publicDir = './public';
const publicOutputDir = './prod';

build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    minify: true,
    sourcemap: false,
    tsconfig: './tsconfig.json',
    target: [],
    outdir: publicOutputDir,
    assetNames: 'assets/[name]-[hash]',
    chunkNames: '[ext]/[name]-[hash]',
    plugins: [
        clean({
            patterns: [`${publicOutputDir}/*`],
            sync: true,
            verbose: false
        }),
        copy({
            resolveFrom: 'cwd',
            assets: {
                from: [`${publicDir}/**/*`],
                to: [`${publicOutputDir}`],
                keepStructure: true
            }
        })
    ]
}).then(result => {
    console.log('Build successful. ')
})