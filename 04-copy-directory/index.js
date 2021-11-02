const fs = require('fs');
const path = require('path');
const directory = path.join(__dirname, 'files');
const copyDirectory = path.join(__dirname, 'files-copy');

fs.access(copyDirectory, err => {
  if (err) {
    console.log('creating folder...');
    copyFiles();
  } else {
    console.log('updating folder...');
    copyFiles();
    //  смотрим на созданную папку и проверяем совпадают ли все файлы с папкой откуда копировали, если файлы не совпадают, то удаляем
    fs.readdir(copyDirectory, (err, copyFiles) => {
      if (err) console.log('Ошибка чтения папки (1)');
      fs.readdir(directory, (err, files) => {
        if (err) console.log('Ошибка чтения папки (2)');
        copyFiles.forEach(elem => {
          if (!files.includes(elem)) {
            fs.unlink(path.join(__dirname, 'files-copy', elem), () => {});
          }
        });
      });
    });
  }
});

function copyFiles() {
  fs.mkdir(copyDirectory, { recursive: true }, err => {
    if (err) console.log('Ошибка в создании папки');
  });

  fs.readdir(directory, (err, arrFiles) => {
    if (err) console.log('Ошибка чтения папки (3)');
    for (const file of arrFiles) {
      fs.copyFile(
        path.join(__dirname, 'files', file),
        path.join(__dirname, 'files-copy', file),
        err => {
          if (err) {
            console.log('Ошибка копирования файлов');
          }
        }
      );
    }
    console.log('folder was copied');
  });
}
