const { Articles } = require("../database");

const findAllArticles = async (ctx) => {
  const allArticles = await Articles.find();
  if (!allArticles) {
    ctx.throw(404, "查询失败");
  } else {
    ctx.body = allArticles;
  }
};

module.exports = {
  findAllArticles,
};
