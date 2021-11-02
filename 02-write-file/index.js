const stdout = process.stdout;
const stdin = process.stdin;
const exit = process.exit;

const fs = require('fs');
const path = require('path');

stdout.write('task 02: Введите Ваши данные\n');

stdin.on('data', data => {
  fs.readdir(path.join(__dirname), (err, arr) => {
    if (err) throw err;
    if (data.toString().trim() === 'exit') {
      exit();
    }

    let existTxt = arr.includes('myNotes.txt');

    if (!existTxt) {
      fs.writeFile(
        path.join(__dirname, 'myNotes.txt'),
        data.toString(),
        err => {
          if (err) throw err;
        }
      );
    } else {
      fs.appendFile(
        path.join(__dirname, 'myNotes.txt'),
        data.toString(),
        err => {
          if (err) throw err;
        }
      );
    }
  });
});

process.on('exit', () => console.log('Процесс остановлен, удачи Вам!'));
process.on('SIGINT', () => exit());
