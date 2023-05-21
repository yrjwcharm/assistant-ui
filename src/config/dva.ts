import { create } from "dva-core-ts";
import models from "@/model";

// 1. 创建dva实例
const app = create();

// 2.加载model对象
models.forEach((model) => {
  app.model(model);
});
// 3.启动dva
app.start();
// 4.导出dva数据
// global._store = app._store
export default app._store;
