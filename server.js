const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();

// Get defined routing files
var index = require('./server/routes/app');
const messageRoutes = require('./server/routes/messages');
const contactRoutes = require('./server/routes/contacts');
const documentsRoutes = require('./server/routes/documents');

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist/cms-project/browser')));

// Tell express to map the default route ("/") to the index route
app.use('/', index);
app.use('/messages', messageRoutes);
app.use('/contacts', contactRoutes);
app.use('/documents', documentsRoutes);

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