const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

// Get defined routing files
var index = require('./server/routes/app');
const messageRoutes = require('./server/routes/messages');
const contactRoutes = require('./server/routes/contacts');
const documentRoutes = require('./server/routes/documents');

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add CORS headers middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist/cms-project/browser')));

// Tell express to map the default route ("/") to the index route
app.use('/', index);
app.use('/messages', messageRoutes);
app.use('/contacts', contactRoutes);
app.use('/documents', documentRoutes);

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

// establish a connection to the mongo database
mongoose.connect('mongodb://localhost:27017/cms', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(err => {
    console.log('Connection failed: ' + err);
  });

