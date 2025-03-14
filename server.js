const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();

// Import routes
const appRoutes = require('./server/routes/app');

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to Angular app build directory
// This is the most important line to fix your issue!
app.use(express.static(path.join(__dirname, 'dist/cms-project/browser')));

// Set our API routes
app.use('/api', appRoutes);

// For all other routes, send to Angular app
// This must come AFTER the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cms-project/browser/index.html'));
});

// Set port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Listen on port
server.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});