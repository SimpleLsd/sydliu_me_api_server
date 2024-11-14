const router = require("koa-router")();

const { findAllArticles } = require("./articles");

router.prefix("/api");

router.get("/", async (ctx, next) => {
  await ctx.render("api_index", {
    title: "API Home",
    message: "This is an API response!",
  });
});

router.get("/articles", findAllArticles);

module.exports = router;
