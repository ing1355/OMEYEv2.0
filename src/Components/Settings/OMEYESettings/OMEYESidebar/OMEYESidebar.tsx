import styled from "styled-components"
import Input from "../../../Constants/Input"
import { useRecoilState } from "recoil";
import { GetOmeyeSettingsInfoType, OmeyeSettingsInfo } from "../../../../Model/OmeyeSettingsDataModel";
import { Axios } from "../../../../Functions/NetworkFunctions";
import { getSettingsInfoApi } from "../../../../Constants/ApiRoutes";
import { useEffect } from "react";

const OMEYESidebar = () => {
  const [omeyeSettingsInfo, setOmeyeSettingsInfo] = useRecoilState(OmeyeSettingsInfo);

  const GetOMEYESettingsInfo = async () => {
    const res:GetOmeyeSettingsInfoType = await Axios('GET', getSettingsInfoApi)
    if (res) setOmeyeSettingsInfo(res);
  }

  useEffect(() => {
    GetOMEYESettingsInfo();
  },[]);

  return (
    <div>
      {/* FPS 설정 */}
      <div style={{marginBottom: '30px'}}>
        {/* FPS 헤더 */}
        <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
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
            <div style={{width: '25%', paddingLeft: '10px'}}>사람</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput value={omeyeSettingsInfo.personFrame} />
              {/* <div>프로그래스</div> */}
            </div>
          </div>

          {/* 얼굴 */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>얼굴</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput value={omeyeSettingsInfo.faceFrame}/>
              {/* <div>프로그래스</div> */}
            </div>
          </div>

          {/* 번호판 */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>번호판</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput value={omeyeSettingsInfo.carFrame}/>
              {/* <div>프로그래스</div> */}
            </div>
          </div>

          {/* 인상착의 */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>인상착의</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput value={omeyeSettingsInfo.attributionFrame}/>
              {/* <div>프로그래스</div> */}
            </div>
          </div>
        </div>
      </div>

      {/* 최대 선택 가능 CCTV 수 */}
      <div style={{marginBottom: '30px'}}>
        <div>
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%'}}>
              최대 선택 가능 CCTV 수
            </div>
          </div>
        </div>

        <div>
          {/* 최대 선택 가능 CCTV 수 (과거 영상) */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>과거영상</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput value={omeyeSettingsInfo.maxAnalyzeCount}/> 대
              {/* <div>프로그래스</div> */}
            </div>
          </div>

          {/* 최대 선택 가능 CCTV 수 (실시간) */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '30px'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>실시간</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput value={omeyeSettingsInfo.maxLiveAnalyzeCount}/> 대
              {/* <div>프로그래스</div> */}
            </div>
          </div>
        </div>
      </div>

      {/* 최대 허용 분석 영상 시간 */}
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
        <div style={{width: '25%'}}>최대 허용 분석 영상 시간</div>
        <div style={{width: '75%'}}>
          <OMEYESettingsSideBarInput value={omeyeSettingsInfo.maxAnalyzeDuration}/> 분
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
`