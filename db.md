1. 安裝 sqlite3 並新增到 package.json
2. 在 db.js 中，使用 sqlite3 來操作資料庫，並開啟位置在 db/cpi.db 的資料庫，需要確認是否成功打開資料庫
3. 若資料庫不存在，就新增資料庫

4. 在 db.js 中，若`*registration_fees`* table 不存在，則會自動建立一個新的table
   table scheme 如下:


CREATE TABLE registration_fees (
id INTEGER PRIMARY KEY AUTOINCREMENT,
period TEXT NOT NULL,
hospital_fee REAL,
clinic_fee REAL
);


5. 在 db.js 中，用 SQLite 在 registration_fees table 新增資料 
   所需資料在 A030101025-03801775.json 裡。


6. 執行 db.js

7. 驗證 資料庫抓取資料是否成功
在 app.js 中，使用 sqlite3 來操作資料庫，並開啟位置在 db/cpi.db 的資料庫，需要確認是否成功打開資料庫。不要用匯入 db.js的方式。
在 app.js 中，撰寫 get 方法， /api/quotes 路由，使用 SQL 來查詢 registration_fees table 所有的電影台詞資料，回傳 json 格式的資料就好。
在 app.js 中，撰寫 post /api/insert 路由，使用 SQLite 新增一筆電影台詞資料 (period, hospital_fee, clinic_fee)，registration_fees 中，回傳文字的訊息，不要 json。

