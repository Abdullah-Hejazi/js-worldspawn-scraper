const BSP = require('./bsp');

const START_LETTER = 'p';
let startExtracting = false;
BSP.walkDir('/maps/pk3/', async (filePath) => {
    let file = filePath.split('/').pop();

    if (file.toLowerCase().startsWith(START_LETTER)) {
        startExtracting = true;
    }

    if (! startExtracting) {
        return;
    }

    if (filePath.endsWith(".pk3")) {
        console.log('Extracting: ' + filePath)

        await BSP.GetBspFiles(filePath)
    }
});

console.log("Finished extracting bsp files")