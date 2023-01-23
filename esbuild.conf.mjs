import { copy } from 'esbuild-plugin-copy'
import { clean } from 'esbuild-plugin-clean'
import { build, serve } from 'esbuild'

const publicDir = './public';
const publicOutputDir = './server';

build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: [],
    outdir: publicOutputDir,
    assetNames: 'assets/[name]-[hash]',
    chunkNames: '[ext]/[name]-[hash]',
    watch: {
        onRebuild(error, result) {
            if (error)
                console.log(
                    `[${chalk.grey(moment().format('h:mm:ss A'))}] esbuild: ${chalk.red('error while rebuilding code')}`
                )
            else
                console.log(
                    `[${chalk.grey(moment().format('h:mm:ss A'))}] esbuild: ${chalk.green('code rebuilt successfully')}`
                )
        },
    },
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
    console.log('watching...')
})