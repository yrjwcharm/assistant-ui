import { getCurrentPages } from "@tarojs/taro";

const verifyRoute = (router: string) => {
  const pages = getCurrentPages();
  let _router: boolean = false;
  pages.map(item => {
    if (item.route === router) {
      _router = true;
    }
  });
  return _router;
};

export default verifyRoute;
