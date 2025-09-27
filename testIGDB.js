const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const clientId = "tqpkw5vzu3xklzx9996e0orx51poui";
const accessToken = "sqj9tg29s44u2i4woatzzxnu1qsxe7"; // твой токен

async function testIGDB() {
  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/json"
    },
    body: `search "Cyberpunk 2077"; fields name, cover.url, summary; limit 1;`
  });

  const data = await res.json();
  if (!data.length) {
    console.log("Ничего не найдено");
    return;
  }

  const game = data[0];
  const coverUrl = game.cover?.url
    ? "https:" + game.cover.url.replace("t_thumb", "t_cover_big")
    : "Нет постера";

  console.log("Название:", game.name);
  console.log("Описание:", game.summary);
  console.log("Постер:", coverUrl);
}

testIGDB();
