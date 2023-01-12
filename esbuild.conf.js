const esbuild = require('esbuild');
esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: [],
    outdir: 'public',
    assetNames: 'assets/[name]-[hash]',
    chunkNames: '[ext]/[name]-[hash]',
    watch: {
        onRebuild(error, result) {
            if (error) console.error('watch build failed:', error)
            else {
                console.log('watch build succeeded:', result);

                // copy main html file
                const fs = require('fs');
                fs.copyFile('index.html', 'public/index.html', (err) => {
                    if (err) throw err;
                    console.log('index.html was copied');
                });
            }
        },
    },
}).then(result => {
    console.log('watching...')
})