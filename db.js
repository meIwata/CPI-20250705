const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// 資料庫路徑
const dbPath = path.join(__dirname, 'db', 'cpi.db');

// 開啟資料庫
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('無法開啟資料庫:', err.message);
    process.exit(1);
  }
  console.log('成功開啟資料庫');
});

// 建立 registration_fees table（若不存在）
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS registration_fees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period TEXT NOT NULL,
    hospital_fee REAL,
    clinic_fee REAL
  )`, (err) => {
    if (err) {
      console.error('建立資料表失敗:', err.message);
      process.exit(1);
    }
    console.log('確認資料表存在');
    insertData();
  });
});

// 匯入 JSON 並寫入資料表
function insertData() {
  const jsonPath = path.join(__dirname, 'A030101025-03801775.json');
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw);
  const periods = data.row.map(r => r[0]);
  const hospitalFees = data.orgdata[0];
  const clinicFees = data.orgdata[1];

  db.serialize(() => {
    const stmt = db.prepare('INSERT INTO registration_fees (period, hospital_fee, clinic_fee) VALUES (?, ?, ?)');
    for (let i = 0; i < periods.length; i++) {
      stmt.run(periods[i], hospitalFees[i], clinicFees[i]);
    }
    stmt.finalize((err) => {
      if (err) {
        console.error('資料寫入失敗:', err.message);
      } else {
        console.log('資料寫入完成');
      }
      db.close();
    });
  });
}

