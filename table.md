### 用 Vue 顯示資料 Table

使用 vue3
顯示用 table 顯示
data 為 掛號費資料表 json 資料，JSON 包括 (id, period, hospital_fee, clinic_fee) 等欄位。對應到index.html裡面的前端欄位(ID, 統計期, 醫院掛號費, 診所掛號費)
method 為 按下顯示資料的按鈕，將使用 fetch async await 抓取 /api/quotes 的 JSON
