const Command = require("../base/Command.js");
const { isNil } = require("lodash");
const { ROLE } = require("miniplug");

class UpdateRoles extends Command {
  constructor(client) {
    super(client, {
      name: "updateroles",
      description: "Update Roles.",
      usage: "updateroles",
      aliases: ["updateroles"],
      permLevel: "Bot Developer"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const members = this.client.guilds.cache.get("485173051432894489");
      console.log(members.length);

      for (var i = 0, len = members.length; i < len; i++) {
        console.log("Checking " + members[i].user.username);

        const userDB = await this.client.db.models.users.findOne({
          where: {
            discord: members[i].user.id,
          },
        });

        if (!isNil(userDB)) {
          const statusRole = "695994210603630633";
          await members[i].roles.add(statusRole).catch(console.error);
  
          console.log(members[i].user.username + " Account is linked with plug.dj!");

          const rdjRole = "485174834448564224";
          const plugUser = await this.client.plug.getUser(userDB.id);

          if (members[i].roles.has(rdjRole)) {
            if (plugUser.role != ROLE.DJ) {
              await members[i].roles.remove(rdjRole).catch(console.error);

              console.log(members[i].user.username + " RDJ Role Removed!");
            }
          } else { 
            if (plugUser.role === ROLE.DJ) {
              await members[i].roles.add(rdjRole).catch(console.error);

              console.log(members[i].user.username + " RDJ Role Added!");
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = UpdateRoles;
