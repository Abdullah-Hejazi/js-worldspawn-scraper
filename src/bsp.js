const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const TEMO_PATH = __dirname + "/../storage/temp/";

class BSP {
    static async Extract(file) {
        const unzipStream = zlib.createGunzip();
        const input = fs.createReadStream(file);
        const output = fs.createWriteStream(TEMO_PATH + path.basename(file));

        input.pipe(unzipStream).pipe(output);
    }
}