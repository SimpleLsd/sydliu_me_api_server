const router = require("koa-router")();
const { getStats, getNotionArticle } = require("../backend/methods");
const { Stats, Articles } = require("../database");
const fs = require("fs");

router.prefix("/backend");

// 构建文章
const buildArticle = async ({
  title,
  subTitle,
  coverUrl,
  articleTags,
  totalNum,
  articleNum,
  pageId,
}) => {
  const sections = await getNotionArticle(pageId);
  //"12fae84cb19e8084810ade56653243ad"

  const finalArticle = {
    title,
    subTitle,
    coverUrl,
    articleTags,
    articleDate: new Date(),
    totalNum,
    articleNum,
    sections,
  };

  return finalArticle;
};

const updateStats = async (totalNum, articlesNum) => {
  try {
    const updatedStat = await Stats.findOneAndUpdate(
      {},
      { totalNum, articlesNum },
      { new: true }
    );

    if (!updatedStat) {
      console.log("未找到数据");
      return null;
    }
    console.log("更新成功:", updatedStat);
    return updatedStat;
  } catch (error) {
    console.error("更新统计数据失败:", error);
    throw error;
  }
};

router.post("/articleSubmit", async (ctx) => {
  // console.log("接收到的表单数据:", ctx.request.body);
  // console.log("上传的文件:", ctx.request.files.cover);
  const stats = await getStats();
  const totalNum = stats.totalNum + 1;
  const articleNum = stats.articlesNum + 1;

  const { title, subTitle, articleTags, pageId } = ctx.request.body;

  const coverUrl = ctx.request.files.cover
    ? `/statics/covers/${ctx.request.files.cover.newFilename}`
    : null;

  const article = await buildArticle({
    title,
    subTitle,
    coverUrl,
    articleTags,
    totalNum,
    articleNum,
    pageId,
  });
  // 存储测试文件
  // fs.writeFileSync(`${title}.json`, JSON.stringify(article, null, 2));

  try {
    // 将文章数据存储到数据库
    await Articles.create(article);
    await updateStats(totalNum, articleNum);

    ctx.body = { success: true, message: "文章上传成功", article }; // 返回 JSON 数据
  } catch (err) {
    console.error("文章上传失败:", err);
    ctx.body = { success: false, message: "文章上传失败", error: err };
  }
});

module.exports = router;
