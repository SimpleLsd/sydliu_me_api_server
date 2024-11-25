const router = require("koa-router")();

const {
  findAllArticles,
  findArticleByNum,
  findTopArticles,
} = require("./articles");
const { getStats } = require("./stats");
const { getTagName } = require("./tags");

router.prefix("/api");

router.get("/", async (ctx, next) => {
  await ctx.render("api_index", {
    title: "API Home",
    message: "This is an API response!",
  });
});

router.get("/articles", findAllArticles);
router.get("/stats", getStats);
router.get("/articles/:articleNum", findArticleByNum);
router.get("/articles_top", findTopArticles);
router.get("/get_tag_name/:tagID", getTagName);

module.exports = router;
