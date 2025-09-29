const fs = require('fs');
const path = require('path');

const sessionDataPath = './sessionData/session.json';
const sessionDataDir = path.dirname(sessionDataPath);

module.exports = async () => {
  if (!fs.existsSync(sessionDataDir)) {
    fs.mkdirSync(sessionDataDir, { recursive: true }); // Create the directory recursively if it doesn't exist
    console.log('Global setup: Session data directory ensured.', sessionDataDir);
  }

  const sessionData = {  

  };

  // Write session data to the JSON file if it doesn't exist
  if (!fs.existsSync(sessionDataPath)) {
    fs.writeFileSync(sessionDataPath, JSON.stringify(sessionData, null, 2));
    console.log('Global setup: Session data file created.', sessionDataPath);
  } else {
    console.log('Global setup: Session data file already exists.', sessionDataPath);
  }
};