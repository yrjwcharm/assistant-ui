import {Image, View} from "@tarojs/components";
import React, {useCallback, useEffect, useState} from "react";
import './index.less'
import {
  callActivityHomeApi, callDownloadImgApi, callExitCircleApi,
  callGetFinanceTransportationSignApi, callIsShowMaskPopApi
} from "@/packageFissionActivity/pages/fission-activity/service";
import {useStoreState} from "@/hooks";
import {usePhoneAuthorization} from "@/hooks/usePhoneAuthorization";
import Taro, {useShareAppMessage} from "@tarojs/taro";
import {callInviteCard} from "@/pages/web-signal-details/services";
import {sendPoint} from "@/utils/sendPoint";
import {AtActivityIndicator} from "taro-ui";
import {isEmpty} from "@/utils/EmptyUtil";
import {updateType} from "@/utils/getUserInfo";
type activityInfo={
  bg_img:string,
  btn:string,
  type:number,
  result_img:string
}
let timer: string | number | NodeJS.Timeout | null | undefined =null;
const FissionActivity:() => void=()=>{
  const {
    global: { userType }
  } = useStoreState();
  const [invite_img,setInviteImg]=useState('');
  const [path,setPath]=useState('');
  const [title,setTitle]=useState('');
  const [renderPhoneAuthButton] = usePhoneAuthorization({
    afterLoginCb:()=>{}
  });
  const [{bg_img,btn,result_img},setActivity]=useState<activityInfo>({bg_img:'',btn:'',result_img:'',type:0});
  const [showMask,setShowMask]=useState<boolean>(false);
  const [maskImg,setMaskImg]=useState<string>('');
  const [loading,setLoading]=useState<boolean>(true);
  const [maskPop,setMaskPop]=useState<boolean>(false);
  const [success,setSuccess]=useState<boolean>(false);
  const [showResultImgStatus,setShowResultStatus]=useState(false);
  const [startAnim,setStartAnim]=useState<boolean>(false);
  const init= useCallback(
    () => {
      (async ()=>{
        const res = await  callActivityHomeApi();
        setActivity(res);
        userType!=='2'?Taro.hideShareMenu():Taro.showShareMenu({
          showShareItems:['shareAppMessage', 'shareTimeline'],
        })
        if(userType==='2') {
          showMaskPop();
          const res1 = await callInviteCard({
            share_page: 'spring_invite_page',
          });
          const {invite_img, path, title} = res1?.invite_info;
          setInviteImg(invite_img);
          setPath(path);
          setTitle(title);
        }
        setLoading(false);
      })();
    },
    [userType],
  );
  useEffect(()=>{
    init();
    log('draw','load');
  },[init])
  const log=(pageid: string, event: string)=>{
    let ts_in = Date.now();
    sendPoint({
      pageid,
      ts: ts_in,
      event
    });
  }
  const showMaskPop=async ()=>{
    const res = await  callIsShowMaskPopApi();
    res.need_pop==1&&setMaskPop(true);
  }
  const getFinanceTransportationSign=async (e: { stopPropagation: () => void; })=>{
    e.stopPropagation();
    log('draw','click');
    const res = await callGetFinanceTransportationSignApi();
    if(res?.bg_img) {
      setMaskImg(res?.bg_img);
    }
    setStartAnim(true);
    // @ts-ignore
   timer = setTimeout(()=>{
      setShowMask(true);
      setStartAnim(false);
      timer&&clearTimeout(timer);
    },1800);


  }
  useShareAppMessage(_res => {
    return {
      title,
      path,
      imageUrl:invite_img
    };
  });

  // @ts-ignore
  Taro.useShareTimeline((_res: any)=>{
    return {
      title,
      path,
      imageUrl:invite_img
    };
  })
  return (
    <>
      {loading?<AtActivityIndicator mode='center' color='#0051CC' size={40} />:
        <View className='fission_activity'>
          {startAnim&&<View className='choujiagn_wrap'>
              <Image mode='widthFix'  src={'https://static.licaimofang.com/wp-content/uploads/2023/01/choujiang_2.png'} className='choujiang'/>
          </View>}
          <View className='activity' onClick={()=>{
            if(!isEmpty(result_img)) {
              setShowMask(true);
              setShowResultStatus(true);
            }
          }}>
            <Image mode='widthFix' src={bg_img} className='activity_bg'/>
            <View className='btn_wrap'>
              <Image src={btn} className='img_btn' onClick={getFinanceTransportationSign}/>
              {userType !== "2" ? renderPhoneAuthButton() : null}
            </View>
          </View>
          {maskPop&&<View className='mask_pop'>
            <View className='mask_bg'>
              <Image mode='widthFix' className='pop' src={'https://static.licaimofang.com/wp-content/uploads/2023/01/pop_after_share.png'}/>
              <Image src={require('@assets/images/close_circle.png')} className='close_circle' onClick={()=>{
                setMaskPop(false);
                setSuccess(false);
              }}/>
              <Image mode='widthFix' onClick={()=>{
                setMaskPop(false);
                setSuccess(false);
                log('Sendmembers','click');
                updateType('springActivity');
                Taro.navigateTo({
                  url: `/packageAddFund/pages/add-fund/index?type=3`
                });
              }} className='upload' src={'https://static.licaimofang.com/wp-content/uploads/2023/01/share_after_btn.png'}/>
            </View>
          </View>}
          {showMask&&<View className='mask_view' onLongPress={async ()=>{
            const res1 = await  callDownloadImgApi();
            Taro.downloadFile({
              url: res1.share_img,
              success:function (res) {
                Taro.showShareImageMenu({
                  path:res.tempFilePath,
                  success:function () {
                    log('Sendmembers','load');
                    setSuccess(true);
                  }
                })
              }
            })
            log('Lotteryresult','load');
          }}>
            <View className='mask'>
              <Image mode='widthFix' src={showResultImgStatus?result_img:maskImg} className='mask_img'/>
              <Image src={require('@assets/images/fission-activity/close.png')} onClick={async ()=>{
                if(success) {
                  const res = await callExitCircleApi();
                  res.need_pop == 1 && setMaskPop(true);
                }
                setShowMask(false);
                new Promise(resolve => {
                  setShowResultStatus(prev=>{
                    resolve(prev);
                    return false;
                  });
                }).then(res=>{
                  !res&&init();
                })
              }} className='close'/>
            </View>
          </View>}
        </View>}
    </>
  )
}
export default FissionActivity;
