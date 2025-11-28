const multer = require('multer');
const path = require('path');
const fs = require('fs');

const filedestination = path.join(__dirname, '../uploads');

// Create the folder if it doesn't exist
if (!fs.existsSync(filedestination)) {
    fs.mkdirSync(filedestination);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, filedestination);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const uploads = multer({ storage });

module.exports = uploads;
