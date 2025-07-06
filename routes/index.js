var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../db/cpi.db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 查詢區間API
router.get('/api/quotes/range', function(req, res) {
  const { start, end } = req.query;
  if (!start || !end) {
    return res.status(400).json({ error: '缺少查詢區間' });
  }
  // 將 period 轉換為可比較的數字格式（如 114年1月 -> 11401）
  function periodToNum(period) {
    const match = period.match(/(\d+)年(\d+)月/);
    if (!match) return 0;
    return parseInt(match[1]) * 100 + parseInt(match[2]);
  }
  const startNum = periodToNum(start);
  const endNum = periodToNum(end);
  const db = new sqlite3.Database(dbPath);
  db.all(
    `SELECT * FROM registration_fees WHERE
      (CAST(substr(period, 1, instr(period, '年')-1) AS INTEGER)*100 +
       CAST(substr(period, instr(period, '年')+1, instr(period, '月')-instr(period, '年')-1) AS INTEGER)) >= ?
      AND
      (CAST(substr(period, 1, instr(period, '年')-1) AS INTEGER)*100 +
       CAST(substr(period, instr(period, '年')+1, instr(period, '月')-instr(period, '年')-1) AS INTEGER)) <= ?
      ORDER BY
        CAST(substr(period, 1, instr(period, '年')-1) AS INTEGER)*100 +
        CAST(substr(period, instr(period, '年')+1, instr(period, '月')-instr(period, '年')-1) AS INTEGER)
    `,
    [startNum, endNum],
    (err, rows) => {
      db.close();
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// 取得所有 period（排序、去重）
router.get('/api/periods', function(req, res) {
  const db = new sqlite3.Database(dbPath);
  db.all(
    `SELECT DISTINCT period FROM registration_fees ORDER BY
      CAST(substr(period, 1, instr(period, '年')-1) AS INTEGER)*100 +
      CAST(substr(period, instr(period, '年')+1, instr(period, '月')-instr(period, '年')-1) AS INTEGER)
    `,
    [],
    (err, rows) => {
      db.close();
      if (err) {
        console.error('periods查詢失敗:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('periods查詢結果:', rows);
      res.json(rows.map(r => r.period));
    }
  );
});

module.exports = router;
