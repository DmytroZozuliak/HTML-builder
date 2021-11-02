const fs = require('fs');
const path = require('path');
const cssDir = path.join(__dirname, 'styles');
const distFile = path.join(__dirname, 'project-dist', 'style.css');
const distIndexFile = path.join(__dirname, 'project-dist', 'index.html');
const FSP = require('fs').promises;
const assets = path.join(__dirname, 'assets');
const copyAssets = path.join(__dirname, 'project-dist', 'assets');

// создаем папку 'project-dist' и вкладываем в нее функции создания Цсс
fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
  if (err) console.log('Ошибка в создании папки');
  createFileCss();
  createMainIndex();
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
    //  console.log(sorted);
    //  let filtred = [];
    //  filtred.push(sorted[1]); //header.css
    //  filtred.push(sorted[2]); //main.css
    //  filtred.push(sorted[0]); //footer.css
    //  console.log(filtred);
    const writeStream = fs.createWriteStream(distFile);

    //  при изменении массива с filtred на sorted, мы добавим все цсс файлы с папки, но они будут в "разнобой"
    sorted.forEach(element => {
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

// Функция создание единого index.html файла в 'project-dist'
function createMainIndex() {
  fs.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
    (err, templateHTML) => {
      if (err) console.log('Ошибка чтения файла (4)');
      // console.log(templateHTML);
      let reg = /{{.+}}/gm;

      let tags = templateHTML.match(reg);

      // console.log(tags); //[ '{{header}}', '{{articles}}', '{{footer}}' ]

      tags.forEach(tag => {
        let tagToStr = tag.split('').slice(2, tag.length - 2);
        tagToStr.push('.html');
        tagToStr = tagToStr.join('');

        fs.access(path.join(__dirname, 'components', tagToStr), err => {
          if (err) {
            // console.log('file does not exist...');
            fs.writeFile(
              path.join(__dirname, 'project-dist', 'index.html'),
              templateHTML,
              err => {
                if (err) console.error('ошибка при записи index.html');
              }
            );
          } else {
            // console.log('file exist!');
            fs.readFile(
              path.join(__dirname, 'components', tagToStr),
              'utf-8',
              (err, data) => {
                if (err)
                  console.error(
                    'ошибка при чтении файлов .html с папки components'
                  );
                templateHTML = templateHTML.replace(tag, data);

                fs.writeFile(
                  path.join(__dirname, 'project-dist', 'index.html'),
                  templateHTML,
                  err => {
                    if (err) console.error('ошибка при записи index.html');
                  }
                );
              }
            );
          }
        });
      });

      console.log('Index.html updated');
    }
  );
}
