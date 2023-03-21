const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const TEMO_PATH = __dirname + "/../storage/temp/";
const BSP_PATH = '/maps/bsp/';

class BSP {
    static Extract(file) {
        const zip = new AdmZip(file);

        zip.extractAllTo(TEMO_PATH + path.basename(file));

        return TEMO_PATH + path.basename(file);
    }

    static async GetBspFiles(file) {
        const extractedFile = this.Extract(file);

        console.log('HERE BSP?');

        this.walkDir(extractedFile, async (filePath) => {
            console.log('found file: ' + filePath)
            if (filePath.endsWith(".bsp")) {
                await this.moveBSP(filePath);
            }
        });

        fs.rm(extractedFile, { recursive: true }, (err) => {
            if (err) throw err;
        });

        console.log("Done extracting bsp files.");
    }

    static moveBSP (oldPath) {
        const newPath = BSP_PATH + path.basename(oldPath);

        console.log("Moving " + oldPath + " to " + newPath)

        return new Promise((resolve, reject) => {
            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static walkDir (dir, callback) {
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                this.walkDir(filePath, callback);
            } else {
                callback(filePath);
            }
        });
    }
}

module.exports = BSP;