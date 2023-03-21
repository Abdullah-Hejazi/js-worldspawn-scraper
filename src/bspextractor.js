const BSP = require('./bsp');

BSP.walkDir('/maps/pk3/', async (filePath) => {
    if (filePath.endsWith(".pk3")) {
        console.log('Extracting: ' + filePath)

        await BSP.GetBspFiles(filePath)
    }
});

console.log("Finished extracting bsp files")