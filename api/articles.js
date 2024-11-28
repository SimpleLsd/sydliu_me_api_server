const { Articles } = require("../database");
const { Stats } = require("../database");

const findAllArticles = async (ctx) => {
  const allArticles = await Articles.find().sort({ articleNum: -1 }); // 查找所有文章并按照 articleNum 降序排序
  if (!allArticles) {
    ctx.throw(404, "查询失败");
  } else {
    ctx.body = allArticles;
  }
};

const findArticleByNum = async (ctx) => {
  const { articleNum } = ctx.params; // 获取路径参数
  try {
    const article = await Articles.findOne({ articleNum }); // 查找对应的文章
    if (!article) {
      ctx.throw(404, "文章未找到");
    } else {
      ctx.body = article; // 返回文章内容
    }
  } catch (error) {
    ctx.throw(500, "服务器错误");
  }
};

const findTopArticles = async (ctx) => {
  const stats = await Stats.findOne();

  console.log(stats);
  try {
    const articles = await Articles.find({
      articleNum: { $in: stats.topArticles },
    }).sort({ articleNum: -1 }); // 使用 $in 查询条件
    if (!articles || articles.length === 0) {
      ctx.throw(404, "没有找到相关文章");
    } else {
      ctx.body = articles; // 返回文章数组
    }
  } catch (error) {
    ctx.throw(500, "服务器错误");
  }
};

module.exports = {
  findAllArticles,
  findArticleByNum,
  findTopArticles,
};
