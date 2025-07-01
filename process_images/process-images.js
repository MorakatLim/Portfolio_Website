const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configure your input and output directories
const inputDir = 'E:/Misc/Side Projects/Portfolio Website/Website/Projects/Travels/New_Mexico/White_Sands/images_originals'; // Folder with your large original JPGs/PNGs
const outputDir = 'E:/Misc/Side Projects/Portfolio Website/Website/Projects/Travels/New_Mexico/White_Sands/images_webp';   // Folder where the small WebPs will be saved

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read all files from the input directory
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach((file, index) => {
        const inputPath = path.join(inputDir, file);
        const outputFilename = `${path.parse(file).name}.webp`;
        const outputPath = path.join(outputDir, outputFilename);

        // Use sharp to resize, set quality, and convert to webp
        sharp(inputPath)
            .resize(600, 400, { fit: 'inside' }) // Resize to max 400x300, keeps aspect ratio
            .webp({ quality: 80 })              // Convert to WebP with 80% quality
            .toFile(outputPath, (err, info) => {
                if (err) {
                    console.error(`Error processing ${file}:`, err);
                } else {
                    console.log(`Successfully processed ${file}. Output size: ${Math.round(info.size / 1024)} KB`);
                }
            });
    });
});