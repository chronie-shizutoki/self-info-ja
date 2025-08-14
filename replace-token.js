// replace-token.js - Script to replace the DB token placeholder before deployment

const fs = require('fs');
const path = require('path');

// Get the token from environment variables
const dbToken = process.env.DB_TOKEN;

if (!dbToken) {
  console.error('Error: DB_TOKEN environment variable is not set');
  process.exit(1);
}

// Path to the analytics.js file
const analyticsFilePath = path.join(__dirname, 'analytics.js');

// Read the file content
fs.readFile(analyticsFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    process.exit(1);
  }

  // Replace the placeholder with the actual token
  const updatedContent = data.replace(/'DB_TOKEN_PLACEHOLDER'/g, `'${dbToken}'`);

  // Write the updated content back to the file
  fs.writeFile(analyticsFilePath, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file: ${err.message}`);
      process.exit(1);
    }

    console.log('Successfully replaced DB token placeholder');
  });
});