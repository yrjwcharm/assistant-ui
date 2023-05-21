/*
 * @Date: 2023-01-03 11:15:35
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-01-10 17:47:52
 * @FilePath: /assistant-ui/src/packageLession/pages/article/services.ts
 * @Description:
 */
import request from "@/utils/request";

/** 理财课-介绍 */
export function callFamilyFinanceClassApi() {
  return request(`/assistant/family/finances/lesson/info`, {
    method: "GET",
  });
}
/** 理财课-课程列表 */
export function callFamilyFinanceClassListApi(params = { cate_id: 1 }) {
  const { cate_id } = params;
  return request(`/assistant/family/finances/article/list?cate_id=${cate_id}`, {
    method: "GET",
  });
}

/** 理财课-课程-详情 */
export function callFamilyFinanceClassArticleApi({
  article_id,
}: {
  article_id: string;
}) {
  return request(
    `/assistant/family/finances/article/info?article_id=${article_id}`,
    {
      method: "GET",
    }
  );
}

export interface IProcessParams {
  article_id: string;
  is_finish: string; // "0" | "1";
  sum_duration: number;
  study_duration: number;
}
/** 理财课-课程-记录进度 */
export function logFamilyFinanceClassStudyApi(data: IProcessParams) {
  return request(`/assistant/family/finances/article/study/duration`, {
    method: "POST",
    data,
  });
}
