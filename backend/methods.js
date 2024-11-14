const { AriclesTags } = require("../database");
const { Stats } = require("../database");
const { Client } = require("@notionhq/client");

const config = require("../config.json");

const findAllTags = async (ctx) => {
  const allTags = await AriclesTags.find();
  if (!allTags) {
    ctx.throw(404, "查询失败");
  } else {
    return allTags;
  }
};

const getStats = async (ctx) => {
  const stats = await Stats.findOne();
  if (!stats) {
    ctx.throw(404, "查询失败");
  } else {
    return stats;
  }
};

const getNotionArticle = async (pageId) => {
  console.log(config.notion_auth);
  const notion = new Client({
    auth: config.notion_auth,
  });
  try {
    // 获取块的子元素列表
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    // 遍历子块并提取数据
    const blocks = response.results.map((block) => {
      const { type } = block;
      const typeData = block[type]; // 获取具体的 typeData
      return { type, typeData };
    });

    return blocks;
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = {
  findAllTags,
  getStats,
  getNotionArticle,
};
