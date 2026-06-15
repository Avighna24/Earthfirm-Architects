const https = require('https');
https.get('https://earthfirmarchitects.com/projects', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    console.log(data);
  });
});
