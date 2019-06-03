import * as path from 'path';
import { cp } from './ls/main';

const files = ['dist/honor.js'];
const target_folder = 'D:\\zsytssk\\job\\HonorLite\\demo\\libs';

for (const file of files) {
    const filename = path.basename(file);
    const dist = path.resolve(target_folder, filename);
    cp(file, dist);
}
