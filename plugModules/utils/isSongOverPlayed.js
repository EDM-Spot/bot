const { isNil, isObject } = require("lodash");

module.exports = function Util(bot) {
  const util = {
    name: "isSongOverPlayed",
    function: async (songAuthor, songTitle, cid) => {
      if (isNil(cid)) return;

      let playedCount = 0;

      const songHistory = await bot.db.models.plays.findAll({
        order: [["createdAt", "DESC"]],
      });

      if (isNil(songAuthor) || isNil(songTitle)) {
        songAuthor = "undefined";
        songTitle = "undefined";
      }

      const songOverPlayed = await bot.db.models.overplayedlist.findOne({ where: { cid: cid }});
      
      if (isObject(songOverPlayed)) {
        const timePassed = bot.moment().diff(bot.moment(songOverPlayed.createdAt), "days");
        
        if (timePassed <= 5) {
          return true;
        }
        else {
          await bot.db.models.overplayedlist.destroy({ where: { cid: cid } });
          return false;
        }
      }

      if (!isNil(songHistory)) {
        for (let i = 0; i < songHistory.length; i++) {
          const playedWeeks = bot.moment().diff(bot.moment(songHistory[i].createdAt), "weeks");

          if (!isNil(songHistory[i].title)) {
            const currentAuthor = songAuthor.replace(/ *\([^)]*\) */g, "").replace(/\[.*?\]/g, "").trim();
            const savedAuthor = songHistory[i].author.replace(/ *\([^)]*\) */g, "").replace(/\[.*?\]/g, "").trim();

            const currentTitle = songTitle.replace(/ *\([^)]*\) */g, "").replace(/\[.*?\]/g, "").trim();
            const savedTitle = songHistory[i].title.replace(/ *\([^)]*\) */g, "").replace(/\[.*?\]/g, "").trim();

            if (playedWeeks <= 2) {
              if (songHistory[i].cid === cid) {
                // Song Played | Same ID
                playedCount++;
              } else if ((savedTitle === currentTitle) && (savedAuthor === currentAuthor) && (songHistory[i].cid !== cid)) {
                // Same Song | Diff CID | Diff Remix/Channel
                playedCount++;
              }
            }
          }
        }
      }
      
      if (playedCount > 8) {
        await bot.db.models.overplayedlist.findOrCreate({
          where: { cid: cid },
          defaults: {
            cid: cid,
          },
        });
        
        return true;
      }

      return false;
    },
  };

  bot.utils.register(util);
};