/*
 * @Date: 2023-02-21 11:42:20
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-21 12:07:10
 * @FilePath: /assistant-ui/src/utils/cacheManage.ts
 * @Description: 通用的缓存管理工具
 */
interface ICacheMangeConfig {
  name: string; // 缓存名称
  expireDuration: number; // 缓存有效时间长度
  /** 缓存失效时，获取新数据的方法 */
  newDataFunc: () => any;
}

class CacheManage<T> {
  _data: any;
  name: string;
  expireDate: number;
  expireDuration: number;
  newDataFunc: () => any;
  isLoading: boolean;

  constructor(props: ICacheMangeConfig) {
    this._data = null;
    this.isLoading = false;
    this.expireDate = 0;
    this.name = props.name;
    this.expireDuration = props.expireDuration;
    this.newDataFunc = props.newDataFunc;
  }

  get(): Promise<T> {
    if (this.isLoading) {
      return new Promise((resolve) =>
        setTimeout(() => {
          resolve(this.get());
        }, 100)
      );
    }
    if (this._data !== null && this.expireDate > Date.now()) {
      return Promise.resolve(this._data);
    } else {
      this.isLoading = true;
      return Promise.resolve(this.newDataFunc())
        .then((res) => {
          this.isLoading = false;
          this._data = res;
          this.expireDate = Date.now() + this.expireDuration;

          return res;
        })
        .catch((er) => {
          this.isLoading = false;

          this._data = null;
          console.error(`cache mange ${this.name} get fail \n`, er);
          throw er;
        });
    }
  }

  clear() {
    this.expireDate = 0;
    this.isLoading = false;
    this._data = null;
  }
}

export default CacheManage;
