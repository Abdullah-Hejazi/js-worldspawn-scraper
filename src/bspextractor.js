const BSP = require('./bsp');

const START_LETTER = 'p';
BSP.walkDir('/maps/pk3/', async (filePath) => {
    let file = filePath.split('/').pop();
    let ex = false;

    if (file.toLowerCase().startsWith(START_LETTER)) {
        ex = true;
    }

    if (! ex) {
        return;
    }

    if (filePath.endsWith(".pk3")) {
        console.log('Extracting: ' + filePath)

        await BSP.GetBspFiles(filePath)
    }
});

console.log("Finished extracting bsp files")