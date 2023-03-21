const BSP = require('./bsp');
const fs = require('fs');
const path = require('path');

function walkDir (dir, callback) {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            this.walkDir(filePath, callback);
        } else {
            callback(filePath);
        }
    });
}

walkDir('/maps/pk3/', async (filePath) => {
    if (filePath.endsWith(".pk3")) {
        console.log('Extracting: ' + filePath)

        await BSP.GetBspFiles(filePath)
    }
});
