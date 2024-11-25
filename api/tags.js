const { AriclesTags } = require("../database");

const getTagName = async (ctx) => {
  const { tagID } = ctx.params;
  try {
    const tag = await AriclesTags.findOne({ tagID });
    if (!tag) {
      ctx.throw(404, "标签未找到");
    } else {
      ctx.body = tag.tagName;
    }
  } catch (error) {
    ctx.throw(500, "服务器错误");
  }
};

module.exports = { getTagName };
