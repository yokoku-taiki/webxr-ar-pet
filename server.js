const https = require("https");
const fs = require("fs");
const express = require("express");

const app = express();

// 公開フォルダを指定
app.use(express.static("public"));

// 証明書と秘密鍵の読み込み
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

// HTTPSサーバーを立ち上げる
const PORT = 8443; // HTTPSのデフォルトポートは443、ここでは8443を使用
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running at https://localhost:${PORT}`);
});
