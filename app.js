var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sqlite3 = require('sqlite3').verbose();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const dbPath = path.join(__dirname, 'db', 'cpi.db');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// GET /api/quotes 取得所有資料
app.get('/api/quotes', (req, res) => {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      return res.status(500).json({ error: '無法開啟資料庫' });
    }
  });
  db.all('SELECT * FROM registration_fees', (err, rows) => {
    db.close();
    if (err) {
      return res.status(500).json({ error: '查詢失敗' });
    }
    res.json(rows);
  });
});

// POST /api/insert 新增一筆資料
app.post('/api/insert', (req, res) => {
  const { period, hospital_fee, clinic_fee } = req.body;
  if (!period || hospital_fee === undefined || clinic_fee === undefined) {
    return res.status(400).send('缺少必要欄位');
  }
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      return res.status(500).send('無法開啟資料庫');
    }
  });
  db.run(
    'INSERT INTO registration_fees (period, hospital_fee, clinic_fee) VALUES (?, ?, ?)',
    [period, hospital_fee, clinic_fee],
    function (err) {
      db.close();
      if (err) {
        return res.status(500).send('新增失敗');
      }
      res.send('新增成功');
    }
  );
});

module.exports = app;
