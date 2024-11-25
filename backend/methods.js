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

  let allBlocks = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    try {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: startCursor,
      });

      allBlocks = allBlocks.concat(response.results); // 合并结果
      hasMore = response.has_more; // 检查是否有更多内容
      startCursor = response.next_cursor; // 更新下一页的游标
    } catch (error) {
      console.error("获取块内容时出错:", error);
      break;
    }
  }

  return allBlocks.map((block) => {
    const { type } = block;
    const typeData = block[type]; // 获取具体的 typeData
    return { type, typeData };
  });
};

module.exports = {
  findAllTags,
  getStats,
  getNotionArticle,
};
