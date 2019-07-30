import * as path from 'path';
import { cp } from './ls/main';
import { rm } from './ls/rm';
import { rmdir } from './ls/asyncUtil';

const type = process.argv.slice(2)[0];
const dist = 'Z:\\libs\\honor';
const dist2 = 'D:\\zsytssk\\github\\HonorLite\\libs\\honor';
const src = 'D:\\zsytssk\\github\\honor\\src';

async function main() {
    console.time('costTime');
    const actions = {
        release,
        syncBack,
        release2,
        syncBack2,
        generateType,
        publish,
    };
    if (actions[type]) {
        await actions[type]();
    }
    console.timeEnd('costTime');
}
main();

export function publish() {
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

async function release() {
    await rm(dist);
    cp(src, dist);
}
async function release2() {
    await rm(dist2);
    cp(src, dist2);
}

async function syncBack() {
    await rm(src);
    cp(dist, src);
}
async function syncBack2() {
    await rm(src);
    cp(dist2, src);
}
