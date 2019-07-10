import * as path from 'path';
import { cp } from './ls/main';
import { rm } from './ls/rm';

const type = process.argv.slice(2)[0];
const dist = 'W:\\libs\\honor';
const src = 'D:\\zsytssk\\job\\legend\\honor\\src';

async function main() {
    console.time('costTime');
    const actions = {
        release,
        generateType,
        syncBack,
        syncTo,
    };
    if (actions[type]) {
        await actions[type]();
    }
    console.timeEnd('costTime');
}
main();

export function release() {
    const files = ['dist/honor.js', 'dist/honor.d.ts'];
    const target_folder = 'D:\\zsytssk\\job\\HonorLite\\demo\\libs';

    for (const file of files) {
        const filename = path.basename(file);
        const dist = path.resolve(target_folder, filename);
        cp(file, dist);
    }
    const rootDir = path.resolve(__dirname, '..');
    rm(path.resolve(rootDir, 'dist/src'));
    rm(path.resolve(rootDir, 'dist/script'));
}

export async function generateType() {
    const rootDir = path.resolve(__dirname, '..');
    const dts = require('dts-bundle');
    dts.bundle({
        name: 'honor',
        main: path.resolve(rootDir, 'dist/src/honor.d.ts'),
        out: path.resolve(rootDir, 'dist/honor.d.ts'),
        removeSource: true,
        outputAsModuleFolder: true,
    });
    console.log(1);
}
export async function generateType2() {
    const rootDir = path.resolve(__dirname, '..');

    require('dts-generator').default({
        name: 'honor',
        main: path.resolve(rootDir, 'src/honor.ts'),
        project: path.resolve(rootDir),
        out: 'honor.d.ts',
    });
}

async function syncBack() {
    await cp(dist, src);
}
async function syncTo() {
    await cp(src, dist);
}
