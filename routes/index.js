const router = require("koa-router")();

router.get("/", async (ctx, next) => {
  await ctx.render("index", {
    title: "Hello Koa 2!",
  });
});

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

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
