global.Promise = require("bluebird");

const fs = Promise.promisifyAll(require("fs-extra"));
const gulp = require("gulp");

const gulpfile = require("../../gulpfile.js");

const { Op } = require("sequelize");

module.exports = function Util(bot) {
  class GenerateCSS {
    constructor() {

    }
    async generateBadges() {
      const template = await fs.readFile(__dirname + "/../data/badge-template.scss", "utf8");
      const users = await bot.db.models.users.findAll({ where: { badge: { [Op.not]: null } }, attributes: ["id", "badge"] });

      let completeFile = "";

      for (const user of users) {
        const id = user.get("id");
        const badge = user.get("badge");

        const setTemplate = template
          .replace(/\t/g, "")
          .replace(/.id-USERID/g, `.id-${id}`)
          .replace(/%%BADGE%%/g, `https://edmspot.tk/public/images/badges/${badge}`);

        completeFile += setTemplate;
      }

      await fs.outputFile(__dirname + "/../../dashboard/public/css/badges.scss", completeFile);

      // build scss and minify it
      gulp.task("default", gulpfile.scss);
      gulp.task("default")();

      return template;
    }

    async generateProducers() {
      const template = await fs.readFile(__dirname + "/../data/producer-template.scss", "utf8");
      const users = await bot.db.models.users.findAll({ where: { producer: { [Op.eq]: true } }, attributes: ["id", "producer"] });

      let completeFile = "";

      for (const user of users) {
        const id = user.get("id");

        const setTemplate = template
          .replace(/\t/g, "")
          .replace(/.id-USERID/g, `.id-${id}`)
          .replace(/%%USERID%%/g, `${id}`);

        completeFile += setTemplate;
      }

      await fs.outputFile(__dirname + "/../../dashboard/public/css/producers.scss", completeFile);

      // build scss and minify it
      gulp.task("default", gulpfile.scss);
      gulp.task("default")();

      return template;
    }
  }

  bot.generateCSS = new GenerateCSS();
};