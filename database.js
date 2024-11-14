const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  title: "String",
  subTitle: "String",
  coverUrl: "String",
  articleTags: [String],
  totalNum: "Number",
  articleNum: "Number",
  articleDate: "String",
  sections: [Object],
});
const Articles = mongoose.model("Article", articleSchema);

const tagSchema = mongoose.Schema({
  tagID: "string",
  tagName: "string",
  tagRoute: "string",
});

const AriclesTags = mongoose.model("Article_Tag", tagSchema);

const statsSchema = mongoose.Schema({
  totalNum: "Number",
  articlesNum: "Number",
  picturesNum: "Number",
});

const Stats = mongoose.model("Contant_Stats", statsSchema);

module.exports = {
  Articles,
  AriclesTags,
  Stats,
};
