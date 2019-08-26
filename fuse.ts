import { fusebox, sparky } from "fuse-box";

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      target: "browser",
      entry: "src/index.jsx",
      webIndex: {
        template: "src/index.html"
      },
      cache: {
        root: ".cache",
        enabled: true
      },
      env: { NODE_ENV: this.isProduction ? "production" : "development" },
      watch: true,
      hmr: true,
      devServer: this.runServer,
      logging: { level: "succinct" }
    });
  }
}
const { task, exec } = sparky<Context>(Context);

task("default", async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task("preview", async ctx => {
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({uglify : false});
});
task("dist", async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});