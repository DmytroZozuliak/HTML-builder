const fs = require('fs');
const path = require('path');
const cssDir = path.join(__dirname, 'styles');
const distFile = path.join(__dirname, 'project-dist', 'style.css');
const assets = path.join(__dirname, 'assets');
const copyAssets = path.join(__dirname, 'project-dist', 'assets');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
  if (err) console.log('Ошибка в создании папки');
  //   createFileCss();
});

function createFileCss() {
  fs.readdir(cssDir, (err, files) => {
    if (err) console.log('Ошибка чтения папки (1)');
    //   console.log(files);

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

// function сcopyAssets() {}

сcopyAssets(path.join(__dirname, 'assets'));

function сcopyAssets(pathToFiles) {
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
}

// todo without recursion

// fs.readdir(assetsCopy, (err2, files2) => {
//   if (err2) {
//     console.log(err2);
//   }
//   fs.readdir(assets, (err, files) => {
//     if (err) {
//       console.log(err);
//     }
//     files2.forEach(item => {
//       if (!files.includes(item)) {
//         fs.unlink(path.join(assetsCopy, `${item}`), err => {
//           if (err) throw err;
//         });
//       }
//     });
//     files.forEach(dir => {
//       fs.mkdir(
//         path.join(assetsCopy, `${dir}`),
//         {
//           recursive: true,
//         },
//         err => {
//           if (err) {
//             return console.error(err);
//           }
//           fs.readdir(path.join(assetsCopy, `${dir}`), (err2, item2) => {
//             if (err2) {
//               console.log(err);
//             }
//             fs.readdir(path.join(assets, `${dir}`), (err1, item) => {
//               if (err1) {
//                 console.log(err);
//               }
//               item2.forEach(file => {
//                 if (!item.includes(file)) {
//                   fs.unlink(path.join(assetsCopy, `${dir}`, `${file}`), err => {
//                     if (err) throw err;
//                   });
//                 }
//               });
//               item.forEach(file => {
//                 fs.copyFile(
//                   path.join(assets, `${dir}`, `${file}`),
//                   path.join(assetsCopy, `${dir}`, `${file}`),
//                   err => {
//                     if (err) {
//                       console.log('Error Found:', err);
//                     }
//                   }
//                 );
//               });
//             });
//           });
//         }
//       );
//     });
//   });
// });
