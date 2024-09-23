const router = require("koa-router")();

router.prefix("/api");

router.get("/", async (ctx, next) => {
  ctx.body = "this is a api response!";
});

module.exports = router;
