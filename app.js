const path = require("path");

const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const { koaBody } = require("koa-body");
const logger = require("koa-logger");

const index = require("./routes/index");
const users = require("./routes/users");
const api = require("./api/index");
const backend = require("./backend/index");
const submit = require("./backend/submit");

const mongoose = require("mongoose");

const config = require("./config.json");

async function connectDB() {
  try {
    await mongoose.connect(config.dblink);
    console.log("数据库连接成功");
  } catch (err) {
    console.log("数据库连接失败: " + err);
  }
}

// error handler
onerror(app);

// middlewares
// app.use(upload.single("cover"));
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: config.article_covers, // 默认文件保存路径
      keepExtensions: true, // 保留文件扩展名
      onFileBegin: (name, file) => {
        // 设置自定义文件名
        const fileExt = path.extname(file.originalFilename); // 获取文件扩展名
        const newFileName = `${Date.now()}${fileExt}`; // 自定义文件名：时间戳 + 扩展名
        // 修改文件的 filepath 为新的文件名
        file.newFilename = newFileName; // 设置新的文件名
        file.filepath = path.join(path.dirname(file.filepath), newFileName);
      },
    },
  })
);

app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(api.routes(), api.allowedMethods());
app.use(backend.routes(), backend.allowedMethods());
app.use(submit.routes(), submit.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

connectDB();

module.exports = app;
