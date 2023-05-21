/*
 * @Date: 2023-01-03 11:15:35
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-01-09 10:44:09
 * @FilePath: /assistant-ui/src/pages/web-signal-details/services.ts
 * @Description:  
 */

// 获取功能列表
import request from "@/utils/request";

/**
 * 
 * @param params 
 * /分享页面 会员邀请分享:member_invite_page  买卖点邀请：buySignal_invite_page 基金诊断diagnose_invite_page, 其他页面三个点分享public_page,家庭理财课familyFinances_invite_page
 * @returns 
 */
export function callInviteCard(params) {
  return request(`/assistant/invite/accept/get/inviteCard`,{
    method:'GET',
    params
  })
}
