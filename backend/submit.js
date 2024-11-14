const router = require("koa-router")();
const { getStats, getNotionArticle } = require("../backend/methods");
const { Articles } = require("../database");
const fs = require("fs");

router.prefix("/backend");

// 上传文件存储配置

// 构建文章
const buildArticle = async ({ title, subTitle, coverUrl, articleTags }) => {
  // console.log("Building article with:", title, articleTags);
  const stats = await getStats();
  // console.log("Stats: ", stats);
  const sections = await getNotionArticle("12fae84cb19e8084810ade56653243ad");
  // console.log("sections: ", sections);

  const finalArticle = {
    title,
    subTitle,
    coverUrl,
    articleTags,
    articleDate: new Date(),
    totalNum: stats.totalNum + 1,
    articleNum: stats.articlesNum + 1,
    sections,
  };

  return finalArticle;
};

router.post("/articleSubmit", async (ctx) => {
  // console.log("接收到的表单数据:", ctx.request.body);
  // console.log("上传的文件:", ctx.request.files.cover);
  const { title, subTitle, articleTags } = ctx.request.body;

  const coverUrl = ctx.request.files.cover
    ? `/statics/covers/${ctx.request.files.cover.newFilename}`
    : null;

  const article = await buildArticle({
    title,
    subTitle,
    coverUrl,
    articleTags,
  });
  // 存储测试文件
  fs.writeFileSync(`${title}.json`, JSON.stringify(article, null, 2));

  try {
    // 将文章数据存储到数据库
    await Articles.create(article);

    ctx.body = { success: true, message: "文章上传成功", article }; // 返回 JSON 数据
  } catch (err) {
    console.error("文章上传失败:", err);
    ctx.body = { success: false, message: "文章上传失败", error: err };
  }
});

module.exports = router;
