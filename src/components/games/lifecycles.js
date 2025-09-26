'use strict';

const fetch = require("node-fetch");

async function fetchGameFromIGDB(title) {
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
  if (!data.length) return null;

  const game = data[0];
  return {
    title: game.name,
    description: game.summary || "",
    poster: game.cover?.url
      ? "https:" + game.cover.url.replace("t_thumb", "t_cover_big")
      : null
  };
}

// загрузка картинки в Uploads
async function uploadImageFromUrl(url) {
  try {
    const res = await fetch(url);
    const buffer = await res.buffer();

    const uploaded = await strapi.plugins["upload"].services.upload.upload({
      data: {},
      files: {
        path: null,
        name: url.split("/").pop(),
        type: "image/jpeg",
        size: buffer.length,
        buffer
      }
    });

    return uploaded[0].id;
  } catch (err) {
    strapi.log.error("Ошибка загрузки постера:", err);
    return null;
  }
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (data.title) {
      const igdbData = await fetchGameFromIGDB(data.title);
      if (igdbData) {
        if (!data.description) {
          data.description = [
            { type: "paragraph", children: [{ type: "text", text: igdbData.description }] }
          ];
        }
        if (!data.poster && igdbData.poster) {
          const fileId = await uploadImageFromUrl(igdbData.poster);
          if (fileId) data.poster = fileId;
        }
      }
    }
  }
};
