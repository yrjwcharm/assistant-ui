type MyScheduleType = {
  list?: {
    mobile: string; // 加密手机号
    score: number; // 累计收益率
    uid: number | string; // 用户uid
    yield: number; // 当日收益率
  }[];
  me?: {
    mobile: string; // 加密手机号
    mysort: number; // 排名
    score: number; // 累计收益率
    uid: number | string; // 用户uid
    yield: number; // 当日收益率
  };
};

type PreMatchListCardType = {
  title: string; // 活动名称
  status_name: string; // 活动状态
  activity_time_info: {
    time_name: string;
    time_info: string;
  };
  schedule_id: number; // 期数id
  my_schedule: MyScheduleType; // 我的排名信息
};

type StartCardType = {
  activity_time_info: {
    time_name?: string; // 收益PK时间-key
    time_info?: string; // 收益PK时间
  };
  apply_user_info: {
    user_num?: number; // 参赛人数
  };
  countdown_info: {
    countdown_name: string;
    countdown_time: string; // 报名截止时间
  };
  schedule_id: number;
  status_name: string; // 活动状态
  title: string; // 活动名称
};
