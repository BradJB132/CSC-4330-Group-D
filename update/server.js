const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

const logFilePath = 'log.txt';

function logToFile(data) {
  const timestamp = new Date().toString();
  const logEntry = `${timestamp}: ${data}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error(err);
  });
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/run-script', (req, res) => {
  const child = exec('sh /home/brad/Homework/update_website.sh');
  const logData = 'Script started';
  logToFile(logData);

  child.stdout.on('data', (data) => {
    const outputData = data.toString();
    logToFile(outputData);
    res.write(`<pre>${outputData}</pre>`);
  });

  child.stderr.on('data', (data) => {
    const errorData = data.toString();
    logToFile(errorData);
    res.write(`<pre>${errorData}</pre>`);
  });

  child.on('exit', (code) => {
    const logData = `Script exited with code ${code}`;
    logToFile(logData);
    res.end();
  });
});

app.get('/showError', (req, res) => {
  const child = exec('sh /home/brad/Homework/find_error.sh');
  const logData = 'Script started';
  logToFile(logData);

  child.stdout.on('data', (data) => {
    const outputData = data.toString();
    logToFile(outputData);
    res.write(`<pre>${outputData}</pre>`);
  });

  child.stderr.on('data', (data) => {
    const errorData = data.toString();
    logToFile(errorData);
    res.write(`<pre>${errorData}</pre>`);
  });

  child.on('exit', (code) => {
    const logData = `Script exited with code ${code}`;
    logToFile(logData);
    res.end();
  });
});

app.listen(30208, () => {
  console.log('Server running on port 30208');
});
