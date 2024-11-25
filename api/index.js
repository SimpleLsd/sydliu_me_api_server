const router = require("koa-router")();

const { findAllArticles } = require("./articles");
const { getStats } = require("./stats");

router.prefix("/api");

router.get("/", async (ctx, next) => {
  await ctx.render("api_index", {
    title: "API Home",
    message: "This is an API response!",
  });
});

router.get("/articles", findAllArticles);
router.get("/stats", getStats);

module.exports = router;
