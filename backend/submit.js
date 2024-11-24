const router = require("koa-router")();
const { getStats, getNotionArticle } = require("../backend/methods");
const { Stats, Articles } = require("../database");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

const config = require("../config.json");

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
  // "12fae84cb19e8084810ade56653243ad"
  // 定义存储目录
  const imgSaveDir = config.article_imgs;

  for (const section of sections) {
    if (
      (section.type === "image" || section.type === "video") &&
      section.typeData?.file?.url
    ) {
      try {
        const localUrl = await downloadImage(
          section.typeData.file.url,
          imgSaveDir
        );
        section.typeData.file.url = localUrl; // 替换为本地路径
      } catch (error) {
        console.error("图片下载失败，跳过此部分:", section.typeData.file.url);
      }
    }
  }

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

// 转存图片
const downloadImage = async (url, imagePath) => {
  const urlObj = new URL(url);
  const fileNameFromUrl = path.basename(urlObj.pathname); // 提取文件名（无参数）
  const fileExt = path.extname(fileNameFromUrl); // 获取文件扩展名
  const FileName = `${Date.now()}${fileExt}`; // 自定义文件名：时间戳 + 扩展名
  const filePath = path.join(imagePath, FileName);

  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
    });

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
    // 图片访问地址
    return `${config.statics_article_imgs}${FileName}`;
  } catch (error) {
    console.error(`下载图片失败:${url}`, error);
    throw error;
  }
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

  // 上传的封面访问地址
  const coverUrl = ctx.request.files.cover
    ? `${config.statics_article_covers}${ctx.request.files.cover.newFilename}`
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
