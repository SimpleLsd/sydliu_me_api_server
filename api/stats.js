const { Stats } = require("../database");

const getStats = async (ctx) => {
  console.log("getStats");
  const stats = await Stats.findOne();
  if (!stats) {
    ctx.throw(404, "查询失败");
  } else {
    ctx.body = stats;
  }
};

module.exports = {
  getStats,
};
