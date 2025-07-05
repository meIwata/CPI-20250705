### 顯示 form
div #app裡面有一個form 包括統計期, 醫院掛號費, 診所掛號費
按下按鈕送出後，會將資料新增到資料庫中，並且清空表單。

### Vue app 的 data
form的input資料會跟vue data 綁定

### Vue app 的 method
method中有一個insert方法，會使用fetch async await 抓取 /api/insert 的post API
api/insert 接收json格式的資料，並且回傳文字訊息。
清空輸入資料
新增完畢 呼叫抓取資料的 API 來更新table資料
