const fs = require('fs');

class Config {
    constructor () {
        this.data = {};

        if (! fs.existsSync('../logs/data.json')) {
            this.setDefaults();
            return;
        }

        try {
            let data = fs.readFileSync('../logs/data.json');

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
}

module.exports = Config;