import styled from "styled-components"
import Input from "../../../Constants/Input"
import { useRecoilState } from "recoil";
import { GetOmeyeSettingsInfoType, OmeyeSettingsInfo } from "../../../../Model/OmeyeSettingsDataModel";
import { Axios } from "../../../../Functions/NetworkFunctions";
import { fpsSettingApi, getSettingsInfoApi, maxAnalyzeDurationApi, maxCCTVCountApi } from "../../../../Constants/ApiRoutes";
import { useEffect } from "react";
import Button from "../../../Constants/Button";
import useMessage from "../../../../Hooks/useMessage";
import { MaxInputNumberFun, OnlyInputNumberFun } from "../../../../Functions/GlobalFunctions";
import whiteCheckIcon from "../../../../assets/img/whiteCheckIcon.png"
import Slider from "../../../Constants/Slider";

const OMEYESidebar = () => {
  const [omeyeSettingsInfo, setOmeyeSettingsInfo] = useRecoilState(OmeyeSettingsInfo);
  const message = useMessage();

  const GetOMEYESettingsInfo = async () => {
    console.time("second")
    const res:GetOmeyeSettingsInfoType = await Axios('GET', getSettingsInfoApi)
    console.debug("second : " , res)
    if (res) setOmeyeSettingsInfo(res);
    console.timeEnd("second")
  }

  const ChangeFPSTypeFun = async () => {
    console.time("third")
    const res:GetOmeyeSettingsInfoType = await Axios('PUT', fpsSettingApi, {
      personFrame: omeyeSettingsInfo.personFrame,
      faceFrame: omeyeSettingsInfo.faceFrame,
      carFrame: omeyeSettingsInfo.carFrame,
      attributionFrame: omeyeSettingsInfo.attributionFrame
    })
    console.debug("third : " , res)
    if(res === undefined) {
      GetOMEYESettingsInfo();
      message.error({title: '', msg: '저장에 실패했습니다'});
    } else {
      ChangeMaxCCTVCountFun();
    }
    console.timeEnd("third")
  }

  const ChangeMaxAnalyzeDurationFun = async (duration: number) => {
    console.time("first")
    const res:GetOmeyeSettingsInfoType = await Axios('PUT', maxAnalyzeDurationApi(duration))
    console.timeEnd("first")
    console.debug("first : " , res)
    if(res === undefined) {
      GetOMEYESettingsInfo();
      message.error({title: '', msg: '저장에 실패했습니다'});
    } else {
      ChangeFPSTypeFun();
    }
  }
  
  const ChangeMaxCCTVCountFun = async () => {
    const res:GetOmeyeSettingsInfoType = await Axios('PUT', maxCCTVCountApi, {
      maxAnalyzeCount: omeyeSettingsInfo.maxAnalyzeCount,
      maxLiveAnalyzeCount: omeyeSettingsInfo.maxLiveAnalyzeCount
    })
    
    if(res === undefined) {
      GetOMEYESettingsInfo();
      message.error({title: '', msg: '저장에 실패했습니다'});
    } else {
      setTimeout(()=>{
        message.success({title: '', msg: '저장 완료했습니다'});
        GetOMEYESettingsInfo();
      },2000)
    }
  } 

  const SaveDataFun = () => {
    if(omeyeSettingsInfo.personFrame < 1 || omeyeSettingsInfo.faceFrame < 1 || omeyeSettingsInfo.carFrame < 1 || omeyeSettingsInfo.attributionFrame < 1) {
      message.error({title: 'FPS 설정 에러', msg: 'FPS의 최소값은 1 입니다'});
    } else {
      ChangeMaxAnalyzeDurationFun(omeyeSettingsInfo.maxAnalyzeDuration);
    }
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '15px'}}>
        <OMEYEButton
          hover
          onClick={SaveDataFun}
          icon={whiteCheckIcon}
          iconStyle={{width: '15px', height: '15px'}}
        >
          저장
        </OMEYEButton>
      </div>
      {/* FPS 설정 */}
      <div style={{marginBottom: '40px'}}>
        {/* FPS 헤더 */}
        <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
          <div style={{width: '25%'}}>
            FPS 설정
          </div>
          <div style={{width: '75%'}}>
            FPS를 기본값(1)으로 설정할 경우 영상에서 1초에 1프레임(이미지)을 분석하게 됩니다. 
            <br />
            FPS를 높게 설정할 경우 분석 정확도는 높아지지만 추출할 프레임수의 배수만큼 시간이 증가합니다.
          </div>
        </div>
        {/* FPS 내부 */}
        <div>
          {/* 사람 */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px', lineHeight: '30px'}}>사람</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput 
                value={omeyeSettingsInfo.personFrame ? omeyeSettingsInfo.personFrame : 0}
                onChange={(e) => {
                  const num = OnlyInputNumberFun(e)
                  const noMaxNum = MaxInputNumberFun(num, 30)
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    personFrame: noMaxNum
                  }))
                }}
              />
              <div style={{margin: '35px 0px'}}>
                <Slider min={1} max={30} value={omeyeSettingsInfo.personFrame} isFooter={true} onChange={(val) => {
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    personFrame: Number(val)
                  }))
                }}/>
              </div>
            </div>
          </div>

          {/* 얼굴 */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px', lineHeight: '30px'}}>얼굴</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput 
                value={omeyeSettingsInfo.faceFrame ? omeyeSettingsInfo.faceFrame : 0}
                onChange={(e) => {
                  const num = OnlyInputNumberFun(e)
                  const noMaxNum = MaxInputNumberFun(num, 30)
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    faceFrame: noMaxNum
                  }))
                }}
              />
              <div style={{margin: '35px 0px'}}>
                <Slider min={1} max={30} value={omeyeSettingsInfo.faceFrame} isFooter={true} onChange={(val) => {
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    faceFrame: Number(val)
                  }))
                }}/>
              </div>
            </div>
          </div>

          {/* 번호판 */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px', lineHeight: '30px'}}>번호판</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput 
                value={omeyeSettingsInfo.carFrame ? omeyeSettingsInfo.carFrame : 0}
                onChange={(e) => {
                  const num = OnlyInputNumberFun(e)
                  const noMaxNum = MaxInputNumberFun(num, 30)
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    carFrame: noMaxNum
                  }))
                }}
              />
              <div style={{margin: '35px 0px'}}>
                <Slider min={1} max={30} value={omeyeSettingsInfo.carFrame} isFooter={true} onChange={(val) => {
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    carFrame: Number(val)
                  }))
                }}/>
              </div>
            </div>
          </div>

          {/* 인상착의 */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px', lineHeight: '30px'}}>인상착의</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput 
                value={omeyeSettingsInfo.attributionFrame ? omeyeSettingsInfo.attributionFrame : 0}
                onChange={(e) => {
                  const num = OnlyInputNumberFun(e)
                  const noMaxNum = MaxInputNumberFun(num, 30)
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    attributionFrame: noMaxNum
                  }))
                }}
              />
              <div style={{margin: '35px 0px'}}>
                <Slider min={1} max={30} value={omeyeSettingsInfo.attributionFrame} isFooter={true} onChange={(val) => {
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    attributionFrame: Number(val)
                  }))
                }}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 최대 선택 가능 CCTV 수 */}
      <div style={{marginBottom: '30px'}}>
        <div>
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
            <div style={{width: '25%', minWidth: '200px'}}>
              최대 선택 가능 CCTV 수
            </div>
          </div>
        </div>

        <div>
          {/* 최대 선택 가능 CCTV 수 (과거 영상) */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px', lineHeight: '30px', minWidth: '200px'}}>과거영상</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput 
                value={omeyeSettingsInfo.maxAnalyzeCount ? omeyeSettingsInfo.maxAnalyzeCount : 0}
                onChange={(e) => {
                  const num = OnlyInputNumberFun(e)
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    maxAnalyzeCount: parseInt(num)
                  }))
                }}
              /> 대
              {/* <div>프로그래스</div> */}
            </div>
          </div>

          {/* 최대 선택 가능 CCTV 수 (실시간) */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '35px'}}>
            <div style={{width: '25%', paddingLeft: '10px', lineHeight: '30px', minWidth: '200px'}}>실시간</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput 
                value={omeyeSettingsInfo.maxLiveAnalyzeCount ? omeyeSettingsInfo.maxLiveAnalyzeCount : 0}
                onChange={(e) => {
                  const num = OnlyInputNumberFun(e)
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    maxLiveAnalyzeCount: parseInt(num)
                  }))
                }}
              /> 대
              {/* <div>프로그래스</div> */}
            </div>
          </div>
        </div>
      </div>

      {/* 최대 허용 분석 영상 시간 */}
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
        <div style={{width: '25%', lineHeight: '30px', minWidth: '200px'}}>CCTV 당 최대 허용 분석 영상 시간</div>
        <div style={{width: '75%'}}>
          <OMEYESettingsSideBarInput 
            value={omeyeSettingsInfo.maxAnalyzeDuration ? omeyeSettingsInfo.maxAnalyzeDuration : 0}
            onChange={(e) => {
              const num = OnlyInputNumberFun(e)
              setOmeyeSettingsInfo((pre) => ({
                ...pre,
                maxAnalyzeDuration: parseInt(num)
              }))
            }}
          /> 분
          {/* <div>프로그래스</div> */}
        </div>
      </div>
      
    </div>
  )
}

export default OMEYESidebar


const OMEYESettingsSideBarInput = styled(Input)`
  height: 30px;
  border-radius: 10px;
  border: none;
  outline: none;
  border-radius: 10px
  font-size: 2.3rem;
  text-align: center;
  flex: 0 0 480px;
  color: white;
  width: 100px;
`

const OMEYEButton = styled(Button)`
  height: 30px;
  margin-right: 10px;
`