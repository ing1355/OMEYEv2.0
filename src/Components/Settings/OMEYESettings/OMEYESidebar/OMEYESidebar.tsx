import styled from "styled-components"
import Input from "../../../Constants/Input"
import { useRecoilState } from "recoil";
import { GetOmeyeSettingsInfoType, OmeyeSettingsInfo } from "../../../../Model/OmeyeSettingsDataModel";
import { Axios } from "../../../../Functions/NetworkFunctions";
import { SettingsInfoApi } from "../../../../Constants/ApiRoutes";
import Button from "../../../Constants/Button";
import useMessage from "../../../../Hooks/useMessage";
import { MaxInputNumberFun, OnlyInputNumberFun } from "../../../../Functions/GlobalFunctions";
import whiteCheckIcon from "../../../../assets/img/whiteCheckIcon.png"
import Slider from "../../../Constants/Slider";
import { globalStyles } from "../../../../styles/global-styled";

const OMEYESidebar = () => {
  const [omeyeSettingsInfo, setOmeyeSettingsInfo] = useRecoilState(OmeyeSettingsInfo);
  const message = useMessage();

  const PutSettingsInfoFun = async () => {
    const res: GetOmeyeSettingsInfoType = await Axios('PUT', SettingsInfoApi, {
      frames: {
        personFrame: omeyeSettingsInfo.personFrame,
        faceFrame: omeyeSettingsInfo.faceFrame,
        carFrame: omeyeSettingsInfo.carFrame,
        attributionFrame: omeyeSettingsInfo.attributionFrame
      },
      analyzeCount: {
        maxAnalyzeCount: omeyeSettingsInfo.maxAnalyzeCount,
        maxLiveAnalyzeCount: omeyeSettingsInfo.maxLiveAnalyzeCount
      },
      maxAnalyzeDuration: omeyeSettingsInfo.maxAnalyzeDuration,

      maxAnalyzeCount: omeyeSettingsInfo.maxAnalyzeCount,
      maxLiveAnalyzeCount: omeyeSettingsInfo.maxLiveAnalyzeCount
    })

    if (res) {
      message.success({ title: 'OMEYE 설정', msg: '저장 완료했습니다' });
      setOmeyeSettingsInfo(res)
    } else {
      message.error({ title: 'OMEYE 설정', msg: '저장에 실패했습니다' });
    }
  }

  const SaveDataFun = () => {
    if (omeyeSettingsInfo.personFrame < 1 || omeyeSettingsInfo.faceFrame < 1 || omeyeSettingsInfo.carFrame < 1 || omeyeSettingsInfo.attributionFrame < 1) {
      message.error({ title: 'FPS 설정 에러', msg: 'FPS의 최소값은 1 입니다' });
    } else {
      PutSettingsInfoFun()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
        <OMEYEButton
          hover
          onClick={SaveDataFun}
          icon={whiteCheckIcon}
          iconStyle={{ width: '15px', height: '15px' }}
        >
          저장
        </OMEYEButton>
      </div>
      {/* FPS 설정 */}
      <DefaultItemContainer>
        {/* FPS 헤더 */}
        <DefaultHeaderContainer>
          <div>
            FPS 설정
          </div>
          <div>
            FPS를 기본값(1)으로 설정할 경우 영상에서 1초에 1프레임(이미지)을 분석하게 됩니다.
            <br />
            FPS를 높게 설정할 경우 분석 정확도는 높아지지만 추출할 프레임수의 배수만큼 시간이 증가합니다.
          </div>
        </DefaultHeaderContainer>
        {/* FPS 내부 */}
        <DefaultContentsContainer>
          {/* 사람 */}
          <DefaultRowContainer>
            <DefaultRowTitle>사람</DefaultRowTitle>
            <DefaultRowContents>
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
              <Slider min={1} max={30} value={omeyeSettingsInfo.personFrame} isFooter={true} onChange={(val) => {
                setOmeyeSettingsInfo((pre) => ({
                  ...pre,
                  personFrame: Number(val)
                }))
              }} />
            </DefaultRowContents>
          </DefaultRowContainer>

          {/* 얼굴 */}
          <DefaultRowContainer>
            <DefaultRowTitle>얼굴</DefaultRowTitle>
            <DefaultRowContents>
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
              <Slider min={1} max={30} value={omeyeSettingsInfo.faceFrame} isFooter={true} onChange={(val) => {
                setOmeyeSettingsInfo((pre) => ({
                  ...pre,
                  faceFrame: Number(val)
                }))
              }} />
            </DefaultRowContents>
          </DefaultRowContainer>

          {/* 번호판 */}
          <DefaultRowContainer>
            <DefaultRowTitle>번호판</DefaultRowTitle>
            <DefaultRowContents>
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
              <Slider min={1} max={30} value={omeyeSettingsInfo.carFrame} isFooter={true} onChange={(val) => {
                setOmeyeSettingsInfo((pre) => ({
                  ...pre,
                  carFrame: Number(val)
                }))
              }} />
            </DefaultRowContents>
          </DefaultRowContainer>

          {/* 인상착의 */}
          <DefaultRowContainer>
            <DefaultRowTitle>인상착의</DefaultRowTitle>
            <DefaultRowContents style={{ width: '75%' }}>
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
              <Slider min={1} max={30} value={omeyeSettingsInfo.attributionFrame} isFooter={true} onChange={(val) => {
                setOmeyeSettingsInfo((pre) => ({
                  ...pre,
                  attributionFrame: Number(val)
                }))
              }} />
            </DefaultRowContents>
          </DefaultRowContainer>
        </DefaultContentsContainer>
      </DefaultItemContainer>

      {/* 최대 선택 가능 CCTV 수 */}
      <DefaultItemContainer>
        <DefaultHeaderContainer>
          최대 선택 가능 CCTV 수
        </DefaultHeaderContainer>

        <DefaultContentsContainer>
          {/* 최대 선택 가능 CCTV 수 (과거 영상) */}
          <DefaultRowContainer>
            <DefaultRowTitle>과거영상</DefaultRowTitle>
            <DefaultRowContents>
              <div>
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
              </div>
              {/* <div>프로그래스</div> */}
            </DefaultRowContents>
          </DefaultRowContainer>

          {/* 최대 선택 가능 CCTV 수 (실시간) */}
          <DefaultRowContainer>
            <DefaultRowTitle>실시간</DefaultRowTitle>
            <DefaultRowContents>
              <div>
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
              </div>
              {/* <div>프로그래스</div> */}
            </DefaultRowContents>
          </DefaultRowContainer>
        </DefaultContentsContainer>
      </DefaultItemContainer>

      {/* 최대 허용 분석 영상 시간 */}
      <DefaultRowContainer>
        <DefaultRowTitle>CCTV 당 최대 허용 분석 영상 시간</DefaultRowTitle>
        <DefaultRowContents>
          <div>
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
          </div>
          {/* <div>프로그래스</div> */}
        </DefaultRowContents>
      </DefaultRowContainer>

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
  color: white;
  width: 100px;
`

const OMEYEButton = styled(Button)`
  height: 30px;
  margin-right: 10px;
`

const DefaultItemContainer = styled.div`
  margin-bottom: 40px;
`

const DefaultHeaderContainer = styled.div`
  ${globalStyles.flex({ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' })}
  margin-bottom: 20px;
  & > div {
    &:first-child {
      width: 25%;
    }
    &:last-child {
      width: 75%;
    }
  }
`

const DefaultContentsContainer = styled.div`
`

const DefaultRowContainer = styled.div`
  ${globalStyles.flex({ flexDirection: 'row', alignItems: 'flex-start' })}
  margin-bottom: 35px;
`

const DefaultRowTitle = styled.div`
  width: 25%;
  padding-left: 10px;
  line-height: 30px;
`

const DefaultRowContents = styled.div`
  width: 75%;
  height: 100%;
  ${globalStyles.flex({ justifyContent: 'flex-start', alignItems: 'flex-start', gap: '36px' })}
`