const fs = require('fs');
const path = require('path');

module.exports = async function globalTeardown (){
    // Define the path to the session data file
    const sessionDataPath = path.join(__dirname, './sessionData/session.json');


    // Check if the file exists
    if(fs.existsSync(sessionDataPath)) {
        // Delete the file
        fs.unlinkSync(sessionDataPath);
        console.log('Global teardown: Session data file deleted.', sessionDataPath);
    } else {
        console.log('Global teardown: No session data file found to delete.', sessionDataPath);
    }

    // You can also perform other teardown tasks here if needed

    console.log('Global teardown completed.');
};