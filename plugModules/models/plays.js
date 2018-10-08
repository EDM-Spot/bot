module.exports = async function Model(bot, sequelize) {
  const Plays = bot.db.define("plays", {
    id: {
      type: sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    cid: {
      type: sequelize.STRING,
      allowNull: false,
    },
    format: {
      type: sequelize.INTEGER,
      allowNull: false,
      validate: {
        max: 2,
        min: 1,
      },
    },
    woots: {
      type: sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    grabs: {
      type: sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    mehs: {
      type: sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    dj: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    skipped: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    author: {
      type: sequelize.STRING,
      defaultValue: "",
      allowNull: false,
    },
    title: {
      type: sequelize.STRING,
      defaultValue: "",
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: function(models) {
        Plays.belongsTo(models.users, {foreignKey: "dj"});
      }
    }
  });

  await Plays.sync();

  bot.db.models.plays = Plays;

  return Plays;
};