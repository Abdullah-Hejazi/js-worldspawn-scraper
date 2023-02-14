const puppeteer = require("puppeteer");
const fs = require("fs");
const http = require("https");
const path = require("path");

const WORLDSPAWN_URL = "https://ws.q3df.org";
const URL = WORLDSPAWN_URL + "/maps";
const SPECIFIC_MAP_URL = WORLDSPAWN_URL + "/map/";

class WorldSpawn {
    constructor (perPage) {
        this.perPage = perPage;
        this.URL = URL + "?show=" + this.perPage;

        this.browser = null;
    }

    async initialize () {
		this.browser = await puppeteer.launch(); 
    }

    async performAction (action, url=this.URL) {
        const page = await this.browser.newPage(); 
		await page.goto(url);

        const data = await page.evaluate(action); 

        await page.close();
 
		return data;
    }

    async getLastPage () {
        let lastPage = await this.performAction(() => {
            const lastPageButton = document.querySelector("a[title='Last page']");

            if (lastPageButton) {
                let queryParameters = lastPageButton.getAttribute("href").split("&");

                for (let i = 0; i < queryParameters.length; i++) {
                    if (queryParameters[i].startsWith("page=")) {
                        return queryParameters[i].split("=")[1];
                    }
                }
            }

            return 1;
        })
        
        return lastPage;
    }

    async getNewestMap () {
        return await this.performAction(() => {
            const item = document.querySelector("table#maps_table tbody tr:nth-child(2) td:nth-child(3) a");

            if (item) {
                return item.innerText;
            }

            return '';
        })
    }

    async getMapsInPage (page) {
        const pageUrl = URL + "?show=" + this.perPage + "&page=" + page;

        return this.performAction(() => {
            let maps = [];

            const items = document.querySelectorAll("table#maps_table tbody tr td:nth-child(3) a");

            for (let i = 0; i < items.length; i++) {
                maps.push(items[i].innerText);
            }

            return maps;
        }, pageUrl);
    }

    async getMapsSince (map) {
        let maps = [];

        let lastPage = await this.getLastPage();

        for (let i = 0; i < lastPage; i++) {
            let mapsInPage = await this.getMapsInPage(i);

            if (mapsInPage.includes(map)) {
                maps = maps.concat(mapsInPage.slice(0, mapsInPage.indexOf(map)));
                break;
            }

            maps = maps.concat(mapsInPage);
        }

        return maps;
    }

    async downloadMap(map) {
        const mapUrl = SPECIFIC_MAP_URL + map;

        const mapDownloadUrl = await this.performAction(() => {
            const item = document.querySelector("div#mapdetails_container a.mapdetails_bigdownloadlink");

            if (item) {
                return item.getAttribute("href");
            }

            return '';
        }, mapUrl);

        if (mapDownloadUrl) {
            await this.downloadFile(WORLDSPAWN_URL + mapDownloadUrl);

            return WORLDSPAWN_URL + mapDownloadUrl;
        }

        return '';
    }

    async downloadFile (url) {
        const dest = path.basename(url);

        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(dest, { flags: "w" });
    
            const request = http.get(url, response => {
                if (response.statusCode === 200) {
                    response.pipe(file);
                } else {
                    file.close();
                    fs.unlink(dest, () => {}); // Delete temp file
                    reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
                }
            });
    
            request.on("error", err => {
                file.close();
                fs.unlink(dest, () => {}); // Delete temp file
                reject(err.message);
            });
    
            file.on("finish", () => {
                resolve();
            });
    
            file.on("error", err => {
                file.close();
    
                if (err.code === "EEXIST") {
                    reject("File already exists");
                } else {
                    fs.unlink(dest, () => {}); // Delete temp file
                    reject(err.message);
                }
            });
        });
    }

    async finish () {
        await this.browser.close();
    }
}

module.exports = WorldSpawn;