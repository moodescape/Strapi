// getToken.js
const https = require("https");

const clientId = "tqpkw5vzu3xklzx9996e0orx51poui";
const clientSecret = "x8nwue4hkrpo1ktwvim7kler3gbb3l";

const data = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;

const options = {
  hostname: "id.twitch.tv",
  path: "/oauth2/token",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": data.length
  }
};

const req = https.request(options, (res) => {
  let body = "";
  res.on("data", (chunk) => {
    body += chunk;
  });
  res.on("end", () => {
    try {
      const json = JSON.parse(body);
      console.log("Ваш access_token:", json.access_token);
      console.log("Истекает через (сек):", json.expires_in);
    } catch (e) {
      console.error("Ошибка парсинга:", e, body);
    }
  });
});

req.on("error", (err) => {
  console.error("Ошибка запроса:", err);
});

req.write(data);
req.end();
