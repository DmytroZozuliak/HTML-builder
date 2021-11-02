const fs = require('fs');
const path = require('path');

console.log('информация о файлах внутри secret-folder');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  function (err, items) {
    let filtered = items.filter(files => !files.isDirectory());

    for (const file of filtered) {
      let fileName = file.name;
      let name = path.parse(fileName).name;
      let ext = path.parse(fileName).ext.split('').slice(1).join('');
      let size;

      fs.stat(path.join(__dirname, 'secret-folder', fileName), (err, data) => {
        if (err) throw err;
        size = data.size;
        console.log(`${name} - ${ext} - ${size}b`);
      });
    }
  }
);
