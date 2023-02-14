const WorldSpawn = require('./worldspawn');
const Config = require('./config');

const main = async () => {
	try {
		const worldspawn = new WorldSpawn(50);

		await worldspawn.initialize();

		const config = new Config();


		// let latestMaps = await worldspawn.getLatestMaps();


		await worldspawn.finish();
	} catch (error) {
		console.error(error);
	}
}

main();