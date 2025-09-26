'use strict';

const fetch = require("node-fetch");

async function fetchGameFromIGDB(title) {
  try {
    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": process.env.IGDB_CLIENT_ID,
        "Authorization": `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
        "Accept": "application/json"
      },
      body: `search "${title}"; fields name, cover.url, summary; limit 1;`
    });

    const data = await res.json();
    if (data.length > 0) {
      const game = data[0];
      return {
        title: game.name,
        poster: game.cover?.url
          ? game.cover.url.replace("t_thumb", "t_cover_big") // норм качество
          : null,
        description: game.summary || ""
      };
    }
  } catch (err) {
    strapi.log.error("IGDB fetch error:", err);
  }
  return null;
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (data.title) {
      const igdbData = await fetchGameFromIGDB(data.title);
      if (igdbData) {
        if (!data.description) {
          data.description = [{ type: "paragraph", children: [{ type: "text", text: igdbData.description }] }];
        }
        if (!data.poster) {
          data.poster = igdbData.poster; // ⚠️ если poster = Media, сюда лучше сохранить URL, Strapi сам подхватит
        }
      }
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;
    if (data.title) {
      const igdbData = await fetchGameFromIGDB(data.title);
      if (igdbData) {
        if (!data.description) {
          data.description = [{ type: "paragraph", children: [{ type: "text", text: igdbData.description }] }];
        }
        if (!data.poster) {
          data.poster = igdbData.poster;
        }
      }
    }
  }
};
