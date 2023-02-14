const fs = require('fs');
const DATAPATH = __dirname + '/../logs/data.json';

class Config {
    constructor () {
        this.data = {};

        if (! fs.existsSync(DATAPATH)) {
            this.setDefaults();
            return;
        }

        try {
            let data = fs.readFileSync(DATAPATH);

            this.data = JSON.parse(data);
        } catch (error) {
            this.setDefaults();
        }
    }

    setDefaults () {
        this.data = {
            latestMap: 'railmaps'
        }
    }

    getLatestMap () {
        return this.data.latestMap;
    }

    setLatestMap (map) {
        this.data.latestMap = map;

        this.save();
    }

    save () {
        try {
            fs.writeFileSync(DATAPATH, JSON.stringify(this.data), { flag: "w" });
        } catch (error) {
            console.log(error);
            console.log("Data: " + JSON.stringify(this.data));
        }
    }
}

module.exports = Config;