import { walkDir, GetBspFiles } from './bsp.js';

walkDir('/maps/pk3/', async (filePath) => {
    if (filePath.endsWith(".pk3")) {
        console.log('Extracting: ' + filePath)

        await GetBspFiles(filePath)
    }
});
