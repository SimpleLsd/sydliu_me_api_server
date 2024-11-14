const router = require("koa-router")();
const { findAllTags } = require("../backend/methods");
const { getStats, getNotionArticle } = require("../backend/methods");

router.prefix("/backend");

router.get("/", async (ctx, next) => {
  articleTags = await findAllTags();

  const stats = await getStats();
  // console.log("Stats: ", stats);

  // const article = await getNotionArticle("12fae84cb19e8084810ade56653243ad");
  // console.log("Article: ", article);

  await ctx.render("backend_index", {
    title: "后台",
    message: "This is an API response!",
    totalNum: stats.totalNum,
    articlesNum: stats.articlesNum,
    picturesNum: stats.picturesNum,
    articleTags,
  });
});

module.exports = router;
