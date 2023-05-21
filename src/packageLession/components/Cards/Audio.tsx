/*
 * @Date: 2022-09-21 10:57:02
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-01-12 11:07:24
 * @FilePath: /assistant-ui/src/packageLession/components/Cards/Audio.tsx
 * @Description:
 */
import { useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  MovableView,
  MovableArea,
} from "@tarojs/components";
import playImg from "../../assets/icons/play.png";
import pauseImg from "../../assets/icons/pause.png";
import rollbackImg from "../../assets/icons/rollback.png";
import speedImg from "../../assets/icons/speed.png";
import "./Audio.less";
import durationFormat from "@/utils/durationFormat";
import VipCard from "./Vip";
import { INo_member_info, IMedio } from "../../types/index";
import React from "react";

interface IProps extends INo_member_info, IMedio {
  title: string;
  isTry: boolean;
  tryUpLevel: (arg0: any) => void;
}

export const AudioCard = (props: IProps) => {
  let { media_url, isTry, no_member_info, media_duration = 0 } = props;

  const duration = media_duration;
  const [isPlay, setPlay] = useState(false);
  /** 当前播放时间 */
  const [currentTime, setCurrentTime] = useState(0);
  let [totalWidth, setTotalWdidth] = useState(200); // 进度条总宽度

  const [showUpLevel, setShowUpLevel] = useState(false);

  let playerRef = useRef<Taro.InnerAudioContext | null>(null);
  /** 是否正在滑动进度条 */
  let seekRef = useRef(false);
  /** 滑动进度条前，是否是播放状态 */
  let beforeRef = useRef<{ value: boolean; timer: NodeJS.Timeout | null }>({
    value: false,
    timer: null,
  });

  // 播放音频
  useEffect(() => {
    playerRef.current = Taro.createInnerAudioContext();

    let player = playerRef.current;
    player.src = media_url;
    player.seek(currentTime);

    player.onPlay(() => {
      console.log("player.onPlay");
    });

    player.onPause(() => {
      console.log("player.onPause");
    });
    player.onStop(() => {
      console.log("player.onStop");
      setCurrentTime(player.currentTime);
    });
    player.onSeeked(() => {
      console.log("player.onSeeked");
    });
    player.onTimeUpdate(() => {
      console.log("player.onTimeUpdate");
      if (seekRef.current) return;
      console.log(`onTimeUpdate ${player.currentTime} ${player.duration}`);
      setCurrentTime(player.currentTime);
      if (isTry && player.currentTime > no_member_info.see_duration) {
        setCurrentTime(no_member_info.see_duration);
        setPlay(false);
        setShowUpLevel(true);
      }
    });

    Taro.onAudioInterruptionBegin(() => {
      if (!isPlay) setPlay(false);
    });

    return () => {
      player.stop();
      player.destroy();
      playerRef.current = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media_url, isTry]);

  useEffect(() => {
    let is_finish = "0";
    if (duration - currentTime <= 0.1) {
      setCurrentTime(duration);
      setPlay(false);
      is_finish = "1";
    }

    Taro.eventCenter.trigger("process_change", {
      sum_duration: duration,
      study_duration: currentTime,
      is_finish,
    });

    const player = playerRef.current;
    if (!player) return;

    if (player.currentTime !== currentTime && seekRef.current) {
      let paused = player.paused;
      console.log("player.seek:", paused);
      if (!paused) player.pause();
      player.seek(currentTime);
    }
  }, [currentTime, duration]);

  // 处理非vip限时
  useEffect(() => {
    if (!isTry && showUpLevel) {
      setShowUpLevel(false);
    }
  }, [isTry, showUpLevel]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.paused && isPlay) {
      player.play();
    }
    if (!player.paused && !isPlay) {
      player.pause();
    }
  }, [isPlay]);

  useEffect(() => {
    const getWidth = (sel: string): Promise<number> => {
      const query = Taro.createSelectorQuery();
      return new Promise((resolve, reject) => {
        query
          .select(sel)
          .boundingClientRect()
          .exec((res) => {
            resolve(res[0].width);
          });
      });
    };
    async function getTotal() {
      const durationArea = await getWidth(".durationArea");
      const durationWidth = await getWidth(".duration");
      const width = durationArea - durationWidth;
      setTotalWdidth(width);
    }
    getTotal();
  });

  const handlePlayClick = () => {
    if (isPlay) {
      setPlay(false);
    } else {
      if (duration - currentTime > 0.1) {
        setPlay(true);
      } else {
        seekRef.current = true;
        beforeRef.current.value = true;
        setCurrentTime(0);
        setTimeout(() => {
          seekRef.current = false;
          beforeRef.current.value = false;
          setPlay(true);
        }, 200);
      }
    }
  };

  const handleNextSeek = (num: number) => {
    if (duration <= 0) return;
    if (currentTime >= duration + 0.5) return;

    seekRef.current = true;
    if (isPlay) {
      beforeRef.current.value = true;
    }

    let target = currentTime + num;
    if (target < 0) target = 0;
    if (target > duration) target = duration;

    setCurrentTime(target);

    beforeRef.current.timer && clearInterval(beforeRef.current.timer);
    beforeRef.current.timer = setTimeout(() => {
      seekRef.current = false;
      if (beforeRef.current.value === true) {
        beforeRef.current.value = false;
        playerRef.current?.play();
      }
    }, 200);
  };

  const handleSliderChange = (e: { detail: { x: any; source: string } }) => {
    const currentWidth = e.detail.x;
    const ishandle = e.detail.source === "touch";
    if (!ishandle) return;

    const process = Math.min(currentWidth / totalWidth, 1);

    let target = duration * process;

    setCurrentTime(target);
  };

  const handleSeekStart = () => {
    seekRef.current = true;
    if (isPlay) {
      beforeRef.current.value = true;
    }
  };

  const handleSeekEnd = () => {
    if (beforeRef.current.value === true) {
      beforeRef.current.value = false;
      playerRef.current?.play();
    }
    seekRef.current = false;
  };

  const progressText = `${durationFormat(currentTime)}/${durationFormat(
    duration
  )}`;
  const sliderX = (currentTime / duration) * totalWidth;

  return (
    <>
      <View className="audioCard">
        <View className="progressWrap">
          <View className="progressBg"></View>
          <View
            className="progress"
            id="area"
            style={{ width: sliderX }}
          ></View>

          <MovableArea className="durationArea" scaleArea={false}>
            <MovableView
              className="durationWrap"
              x={sliderX}
              direction="horizontal"
              disabled={duration <= 0}
              onTouchStart={handleSeekStart}
              onTouchEnd={handleSeekEnd}
              onTouchCancel={handleSeekEnd}
              onChange={handleSliderChange}
            >
              <Text className="duration">{progressText}</Text>
            </MovableView>
          </MovableArea>
        </View>
        <View className="actions">
          <Image
            src={rollbackImg}
            mode="aspectFill"
            onClick={() => handleNextSeek(-15)}
            className="seekBtn image"
          ></Image>
          <View onClick={handlePlayClick}>
            {isPlay ? (
              <Image src={pauseImg} className="playBtn image"></Image>
            ) : (
              <Image src={playImg} className="playBtn image"></Image>
            )}
          </View>

          <Image
            src={speedImg}
            onClick={() => handleNextSeek(15)}
            className="seekBtn image"
          ></Image>
        </View>
        {showUpLevel && (
          <View className="upLevelBg">
            <Text className="endTitle">{no_member_info.see_end_title}</Text>
          </View>
        )}
      </View>
      <VipCard {...props} />
    </>
  );

  // return <View>AudioCard:https://public.licaimofang.cn/cms/upload/2022913/1663031548161a785g19k.mp3</View>
};
