const fs = require('fs');
const path = require('path');
const cssDir = path.join(__dirname, 'styles');
const distFile = path.join(__dirname, 'project-dist', 'style.css');
const FSP = require('fs').promises;
const assets = path.join(__dirname, 'assets');
const copyAssets = path.join(__dirname, 'project-dist', 'assets');

// создаем папку 'project-dist' и вкладываем в нее функции создания Цсс
fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
  if (err) console.log('Ошибка в создании папки');
  createFileCss();
});

// проверяем наличие папки copyAssets
fs.access(copyAssets, err => {
  if (err) {
    console.log('creating folder...');
    copyAsset(assets, copyAssets);
  } else {
    console.log('updating folder...');

    //  Перед копирыванием удаляем все содержимое папок и файлов, затем заново копируем
    fs.rmdir(
      path.join(copyAssets),
      {
        recursive: true,
        force: true,
      },
      () => {
        copyAsset(assets, copyAssets);
      }
    );
  }
});

// Функция создание единого цсс файла в 'project-dist'
function createFileCss() {
  fs.readdir(cssDir, (err, files) => {
    if (err) console.log('Ошибка чтения папки (1)');

    let sorted = files.filter(file => path.extname(file) === '.css');

    let filtred = [];
    filtred.push(sorted[1]); //header.css
    filtred.push(sorted[2]); //main.css
    filtred.push(sorted[0]); //footer.css
    //  console.log(filtred);
    const writeStream = fs.createWriteStream(distFile);
    filtred.forEach(element => {
      const readStream = fs.createReadStream(
        path.join(__dirname, 'styles', element),
        'utf-8'
      );

      readStream.on('data', chunk => writeStream.write(chunk));
    });
    console.log('style.css updated');
  });
}

// Функция копирования ассетов
async function copyAsset(src, dest) {
  const entries = await FSP.readdir(src, { withFileTypes: true });
  await FSP.mkdir(dest);
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      // console.log('copied folder');
      await copyAsset(srcPath, destPath);
    } else {
      // console.log('copied file');
      await FSP.copyFile(srcPath, destPath);
    }
  }
}

/* function сcopyAssets(pathToFiles) {
  fs.readdir(pathToFiles, (err, arrFiles) => {
    if (err) console.log('Ошибка чтения папки (3)');

    console.log(arrFiles);
    for (const file of arrFiles) {
      fs.stat(path.join(__dirname, 'assets', file), (err, data) => {
        //   path.basename(data);
        if (err) console.log('stats');
        //   console.log(data.isDirectory());
        if (data.isDirectory()) {
          //  console.log(file);
          //  todo неправильный аргумент!
          //  сcopyAssets(file);
        } else {
          console.log('file copied');
          //  fs.copyFile(
          //    path.join(__dirname, 'assets', file),
          //    path.join(__dirname, 'project-dist', 'assets', file),
          //    err => {
          //      if (err) {
          //        console.log('Ошибка копирования файлов');
          //      }
          //    }
          //  );
        }
        //   let size = +data.size / 1000;
        //   console.log('размер', `${size}kB`);
      });
    }

    //  for (const file of arrFiles) {
    //    fs.copyFile(
    //      path.join(__dirname, 'assets', file),
    //      path.join(__dirname, 'project-dist', 'assets', file),
    //      err => {
    //        if (err) {
    //          console.log('Ошибка копирования файлов');
    //        }
    //      }
    //    );
    //  }
    //  console.log('folder was copied');
  });
} */
