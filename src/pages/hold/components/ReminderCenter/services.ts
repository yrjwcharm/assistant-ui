/*
 * @Date: 2023-01-03 11:15:16
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-08 17:23:40
 * @FilePath: /assistant-ui/src/pages/hold/components/ReminderCenter/services.ts
 * @Description:
 */
import request from "@/utils/request";

// messageList：消息中心
export function messageList(params: {
  message_type: 0; // 消息类型 1.关注 2持有
  page: number;
  size: number;
  read_type: 0 | 1; // 读取数据的类型：0:banner读取 1:点击更多读取列表
}) {
  return request("/assistant/user/message/list", {
    method: "GET",
    params,
  });
}

// 控制tab的红点的消失
export function messageRead(data: {
  read_status: 1; // 已读
  message_type: 0; // 消息类型 1.关注 2持有
}) {
  return request("/assistant/user/message/read", {
    method: "POST",
    data,
  });
}
