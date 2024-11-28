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

router.get("/proxy", async (ctx) => {
  const { url } = ctx.query; // 获取前端传来的目标 URL
  if (!url) {
    ctx.status = 400;
    ctx.body = { error: "URL is required" };
    return;
  }

  try {
    // 使用 axios 请求目标 URL
    const response = await axios.get(url);
    const data = response.data;

    // 返回请求的数据
    ctx.body = data;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch the URL" };
  }
});

module.exports = router;
