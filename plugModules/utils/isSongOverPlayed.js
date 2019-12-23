const { isNil, isObject } = require("lodash");

module.exports = function Util(bot) {
  const util = {
    name: "isSongOverPlayed",
    function: async (songAuthor, songTitle, cid) => {
      if (isNil(cid)) return;

      let playedCount = 0;

      const songHistory = await bot.db.models.plays.findAll({
        where: { skipped: false },
        order: [["createdAt", "DESC"]],
      });

      const totalPlays = await bot.db.models.plays.count({
        where: { cid: cid, skipped: false },
      });

      if (isNil(songAuthor) || isNil(songTitle)) {
        songAuthor = "undefined";
        songTitle = "undefined";
      }

      const songOverPlayed = await bot.db.models.overplayedlist.findOne({ where: { cid: cid }});
      
      if (isObject(songOverPlayed)) {
        const timePassed = bot.moment().diff(bot.moment(songOverPlayed.createdAt), "weeks");
        
        if (timePassed <= 1) {
          return true;
        }
        else {
          await bot.db.models.overplayedlist.destroy({ where: { cid: cid } });
          return false;
        }
      }

      if (!isNil(songHistory)) {
        for (let i = 0; i < songHistory.length; i++) {
          const playedMonths = bot.moment().diff(bot.moment(songHistory[i].createdAt), "months");

          if (!isNil(songHistory[i].title)) {
            const currentAuthor = songAuthor.replace(/ *\([^)]*\) */g, "").replace(/\[.*?\]/g, "").trim();
            const savedAuthor = songHistory[i].author.replace(/ *\([^)]*\) */g, "").replace(/\[.*?\]/g, "").trim();

            const currentTitle = songTitle.replace(/ *\([^)]*\) */g, "").replace(/\[.*?\]/g, "").trim();
            const savedTitle = songHistory[i].title.replace(/ *\([^)]*\) */g, "").replace(/\[.*?\]/g, "").trim();

            if (playedMonths <= 1) {
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
      
      let toSkip = 10;

      if (totalPlays >= 20) {
        toSkip = 8;
      }

      if (totalPlays >= 30) {
        toSkip = 7;
      }

      if (totalPlays >= 40) {
        toSkip = 6;
      }

      if (totalPlays >= 50) {
        toSkip = 5;
      }

      if (playedCount > toSkip) {
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