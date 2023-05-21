import { RootState } from "@/model";
import { useDispatch, useSelector } from "react-redux";

interface DispatchProps {
  type: string;
  payload?: any;
  successCallBack?: (params?: any, url?: string) => any;
  failCallBack?: (params?: any) => any;
}
export const useStoreState = () => {
  const storeState = useSelector((state: RootState) => state);
  return storeState;
};

export const useStoreDispatch = () => {
  const dispatch = useDispatch();
  return dispatch as (arg0: DispatchProps) => any;
};

export default {
  useStoreState,
  useStoreDispatch
};
