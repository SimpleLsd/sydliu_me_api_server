const router = require("koa-router")();
const mongoose = require("mongoose");

router.prefix("/api");

router.get("/", async (ctx, next) => {
  ctx.body = "this is a api response!";
});

const { findAllArticles } = require("./articles");

const dbConfig = require("../database.config.json");

async function connectDB() {
  try {
    await mongoose.connect(dbConfig.dblink);
    console.log("数据库连接成功");
  } catch (err) {
    console.log("数据库连接失败: " + err);
  }
}

// 调用连接函数
connectDB();

router.get("/articles", findAllArticles);

module.exports = router;
