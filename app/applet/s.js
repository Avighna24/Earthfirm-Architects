import https from 'https';

https.get('https://earthfirmarchitects.com/projects', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    // try finding the string index
    const dataLower = data.toLowerCase();
    const idx = dataLower.indexOf('asha');
    if (idx !== -1) {
        let chunk = data.substring(Math.max(0, idx - 1000), idx + 1000);
        let imgs = chunk.match(/src=["']([^"']+)["']/g);
        console.log("Asha FOUND: \nText: " + chunk.replace(/\n/g, ' ') + "\nImgs: " + (imgs ? imgs.join(', ') : 'none'));
    } else {
        console.log("Asha NOT FOUND in projects webpage");
    }
  });
});
