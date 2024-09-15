# 餐廳評論網 (Restaurant Forum)
此專案為
運用 Node.js 建立本機伺服器，並透過 Express 與 Template Engine (Handlebars) 建立餐廳評論網，以 Sequelize 串接資料庫及進行CRUD操作，最後藉由 passport.js 及相關 Strategy 進行使用者帳戶認證或串接第三方登入認證。


## 版本
- v2.0.0 (2024.09.14)
  - 增加「瀏覽最新動態」、「瀏覽美食達人」及「瀏覽人氣餐廳」功能。
  - 增加「追蹤其他使用者」及「評論餐廳」功能。
  - UI調整。
- v1.0.0 (2024.07.20)


## 功能 (Features)
- 使用者可以註冊/登入/登出網站
- 一般使用者登入後，可進行以下功能操作：
  - 瀏覽所有餐廳，或使用分類篩選餐廳。
  - 瀏覽個別餐廳詳細資料，留下評論。
  - 瀏覽最新動態，查看最新的10間餐廳及10則留言，依時間排序。
  - 瀏覽美食達人，依追蹤人數排序。
  - 瀏覽人氣餐廳，依餐廳被收藏人數排序。
  - 把餐廳加入收藏。
  - 把其他使用者加入追蹤
  - 編輯個人資料。
  - 瀏覽自己評論過及收藏過的餐廳。
  - 瀏覽自己追蹤中的使用者與正在追蹤自己的使用者。

- 網站管理者登入後，在後台可進行以下功能操作：
  - 瀏覽所有餐廳及個別餐廳的詳細資訊。
  - 新增餐廳資料。
  - 編輯餐廳資料。
  - 刪除餐廳資料。
  - 新增類別
  - 編輯類別。
  - 刪除類別。
  - 編輯使用者權限。
  - 刪除評論。


## 執行環境 (RTE)
[Node.js](https://nodejs.org/) (v14.16.0)  
[MySQL](https://dev.mysql.com/downloads/mysql/) (v8.0.15)  
ℹ️ *執行此專案前，需安裝 Node.js 與 MySQL。*


## 安裝 (Installation)
1. 開啟終端機 (Terminal)，cd 至存放本專案的資料夾，執行以下指令將本專案 clone 至本機電腦。

```
git clone https://github.com/allenliao0119/forum-express-grading-github-actions.git
```

2. 進入此專案資料夾

```
cd forum-express-grading-github-actions
```

3. 執行以下指令以安裝套件

```
npm install
```

4. 資料庫設定  

執行以下指令以快速建立資料庫、資料表，以及匯入種子資料：

```
npm run db:setup
```
⚠️ **執行上述指令前，請先確認是否需更改預設設定**  
--- MySQL server 連線之預設設定如下：
```
host: '127.0.0.1'  // localhost
username: 'root'
password: 'password'
database: 'forum'
```
若欲更改設定，請編輯專案資料夾中 `/config/config.json` 中的 "development"  
  
您也可以透過以下指令分別執行資料庫建立、資料表建立、匯入種子資料：
```
npm run db:create
```
```
npm run db:migrate
```
```
npm run db:seed
```

5. 環境變數設定
請參照根目錄下的 .env.example 檔，於根目錄下新增 .env 檔並進行相關設定：
```
PORT = 【 請自行設定 】
SESSION_SECRET = 【 請自行設定 】
JWT_SECRET = 【 請自行設定 】

```

6. 啟動伺服器

```
npm run start
```

當 Terminal 出現以下提示，即代表伺服器啟動成功：  
`App is listening on port 3000!`
⚠️ **執行成功時，提示訊息會依照您在.env中設定的PORT顯示監聽對應的PORT**   
現在，您可開啟任一瀏覽器輸入 http://localhost:3000 來使用餐廳評論網頁。


## 使用工具 (Tools)
- 開發環境：[Visual Studio Code](https://visualstudio.microsoft.com/zh-hant/)
- 應用程式框架：[Express v4.17.1](https://www.npmjs.com/package/express)
- 樣版引擎：[Express-Handlebars v5.3.3](https://www.npmjs.com/package/express-handlebars)
- 資料庫套件：[mysql2 v2.3.0](https://www.npmjs.com/package/mysql2)
- ORM：[Sequelize v6.6.5 & Sequelize-CLI 6.2.0](https://sequelize.org/)
- HTTP method套件：[method-override v3.0.0](https://www.npmjs.com/package/method-override)
- 環境變數：[dotenv v10.0.0](https://www.npmjs.com/package/dotenv)
- Session：[express-session v1.17.2](https://www.npmjs.com/package/express-session)
- Flash Message：[connect-flash v0.1.1](https://www.npmjs.com/package/connect-flash?activeTab=readme)
- JSON Web Token：[jsonwebtoken v8.5.1](https://www.npmjs.com/package/jsonwebtoken)
- 密碼加解密：[bcryptjs v2.4.3](https://www.npmjs.com/package/bcrypt)
- 使用者認證：[passport v0.4.1 & passport-local v0.4.1 & passport-jwt v4.0.0](https://www.passportjs.org/)
- 檔案上傳：[multer v1.4.3](https://www.npmjs.com/package/multer)
- 假資料生成：[faker v5.5.3](https://www.npmjs.com/package/faker)
- 時間處理套件：[dayjs v1.10.6](https://day.js.org/)
- 樣式框架：[Bootstrap v5.2.3](https://getbootstrap.com/docs/5.2/getting-started/introduction/)
- 字體圖標工具：[Font Awesome](https://fontawesome.com/)


## 開發者 (Contributor)
[Allen Liao](https://github.com/allenliao0119)