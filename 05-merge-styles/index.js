const fs = require('fs');
const path = require('path');
const cssDir = path.join(__dirname, 'styles');
const distFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
  if (err) console.log('Ошибка в создании папки');
  createFileCss();
});

function createFileCss() {
  fs.readdir(cssDir, (err, files) => {
    if (err) console.log('Ошибка чтения папки (1)');
    //   console.log(files);
    let filtred = files.filter(file => path.extname(file) === '.css');
    //   console.log(filtred);
    const writeStream = fs.createWriteStream(distFile);

    filtred.forEach(element => {
      const readStream = fs.createReadStream(
        path.join(__dirname, 'styles', element),
        'utf-8'
      );

      readStream.on('data', chunk => writeStream.write(chunk));
    });
    console.log('bundle.css updated');
  });
}
