const WorldSpawn = require('./worldspawn');
const Config = require('./config');
const BSP = require('./bsp');

const main = async () => {
	try {
		const worldspawn = new WorldSpawn(50);

		await worldspawn.initialize();

		const config = new Config();

		let maps = await worldspawn.getMapsSince(config.getLatestMap());

		maps.reverse();

		for (let i = 0; i < maps.length; i++) {
			let map = await worldspawn.downloadMap(maps[i]);

			console.log("Downloaded " + map + " (" + (i + 1) + "/" + maps.length + ")");

			await config.setLatestMap(maps[i]);
		}

		await worldspawn.finish();
	} catch (error) {
		console.error(error);
	}
}

const sleep = (seconds) => {
	return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

const run = async () => {
	while (true) {
		console.log("Started Iteration");

		await main();

		await sleep(10);
	}
}

run();