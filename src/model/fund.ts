import { Model, Effect } from "dva-core-ts";
import { Reducer } from "redux";

export interface FundInfoType {
  fund_name: string; //基金名称
  fund_code: string;
  owned_amount?: string; //持有金额
  profit?: string; //持有收益
}

export interface FundState {
  fundInfo: FundInfoType[];
  editFundInfo: {
    fund_name: string; //基金名称
    fund_code: string;
  }[];
}

interface FundModel extends Model {
  namespace: "fund";
  state: FundState;
  reducers?: {
    setFundInfo: Reducer<FundState>;
    setEditFundInfo: Reducer<FundState>;
  };
  effects?: {
    set?: Effect;
  };
}
const fundModel: FundModel = {
  namespace: "fund",
  state: {
    fundInfo: [],
    editFundInfo: []
  },
  reducers: {
    setFundInfo(state: any, { _type, payload }) {
      return {
        ...state,
        fundInfo: payload
      };
    },
    setEditFundInfo(state: any, { _type, payload }) {
      return {
        ...state,
        editFundInfo: payload
      };
    }
  },
  effects: {}
};
export default fundModel;
