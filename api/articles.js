const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  articleId: "string",
  articleNum: "number",
  totalNum: "number",
  dateStr: "string",
  articleTags: "array",
  title: "string",
  subTitle: "string",
  cover: "string",
  sections: "array",
});
const Articles = mongoose.model("Article", articleSchema);

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
