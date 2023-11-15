import styled from "styled-components"
import Dropdown from "../../Layout/Dropdown"
import { GlobalBackgroundColor } from "../../../styles/global-styled";
import Input from "../../Constants/Input";
import Button from "../../Constants/Button";
import { useEffect, useState } from "react";
import { getSettingsInfoApi, mapTypeApi, maxDurationApi, zoomLevelApi } from "../../../Constants/ApiRoutes";
import { Axios } from "../../../Functions/NetworkFunctions";
import { GetOmeyeSettingsInfoType, OmeyeSettingsInfo, OmeyeSettingsInfoInit } from "../../../Model/OmeyeSettingsDataModel";
import { useRecoilState } from "recoil";
import useMessage from "../../../Hooks/useMessage";

const OMEYESettings = () => {
  const [omeyeSettingsInfo, setOmeyeSettingsInfo] = useRecoilState(OmeyeSettingsInfo);
  const message = useMessage();

console.log('omeyeSettingsInfo', omeyeSettingsInfo)

  const GetOMEYESettingsInfo = async () => {
    const res:GetOmeyeSettingsInfoType = await Axios('GET', getSettingsInfoApi)
    if (res) setOmeyeSettingsInfo(res);
  }

  useEffect(() => {
    GetOMEYESettingsInfo();
  },[]);

  const ChangeMaxDurationFun = async (duration: number) => {
    const res:GetOmeyeSettingsInfoType = await Axios('PUT', maxDurationApi(duration))
    
    if(res === undefined) {
      console.log('에러');
      GetOMEYESettingsInfo();
    }
  }

  const ChangeMapTypeFun = async () => {
    const res:GetOmeyeSettingsInfoType = await Axios('PUT', mapTypeApi, {mapType: omeyeSettingsInfo.mapType})
    
    if(res === undefined) {
      console.log('에러');
      GetOMEYESettingsInfo();
    }
  }

  const ChangeZoomLevelFun = async () => {
    const res:GetOmeyeSettingsInfoType = await Axios('PUT', zoomLevelApi, {
      minZoom: omeyeSettingsInfo.minZoom,
      maxZoom: omeyeSettingsInfo.maxZoom
    })
    
    if(res === undefined) {
      console.log('에러');
      GetOMEYESettingsInfo();
    }
  }

  const SaveDataFun = () => {
    ChangeMaxDurationFun(omeyeSettingsInfo.maxResultDuration);
    ChangeMapTypeFun();
    ChangeZoomLevelFun();
    setTimeout(()=>{
      message.success({title: '', msg: '저장 완료'});
      GetOMEYESettingsInfo();
    },2000)
  }

  const SelectMapTypeFun = (mapType: string) => {
    setOmeyeSettingsInfo((pre) => ({
      ...pre,
      mapType
    }))
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <OMEYEButton
          hover
          onClick={SaveDataFun}
        >
          저장
        </OMEYEButton>
      </div>
      
      {/* 과거영상 저장 기간 */}
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '30px'}}>
        <div style={{width: '25%'}}>
          과거영상 저장 기간
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <DayInput 
            value={omeyeSettingsInfo.maxResultDuration} 
            onChange={(e) => {
              setOmeyeSettingsInfo((pre) => ({
                ...pre,
                maxResultDuration: parseInt(e)
              }))
            }}
          />
          <div style={{lineHeight: '30px'}}>일</div>
        </div>
      </div>

      {/* 지도 설정 */}
      <div>
        <div style={{width: '25%', marginBottom: '10px'}}>지도 설정</div>
        {/* 지도 설정 내부 타이틀 */}
        <div>
          {/* 타입 */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>타입</div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <label style={{display: 'flex', flexDirection: 'row'}}>
                <input 
                  type="radio" 
                  name="map" 
                  checked={omeyeSettingsInfo.mapType === 'KAKAO'}
                  onChange={() => {
                    SelectMapTypeFun('KAKAO');
                  }}
                />
                <div>카카오맵</div>
              </label>
              <label style={{display: 'flex', flexDirection: 'row'}}>
                <input 
                  type="radio" 
                  name="map" 
                  checked={omeyeSettingsInfo.mapType === 'DEFAULT'}
                  onChange={() => {
                    SelectMapTypeFun('DEFAULT');
                  }}
                />
                <div>openstreet</div>
              </label>  
              <label style={{display: 'flex', flexDirection: 'row'}}>
                <input 
                  type="radio" 
                  name="map" 
                  checked={omeyeSettingsInfo.mapType === 'NAVER'}
                  onChange={() => {
                    SelectMapTypeFun('NAVER');
                  }}        
                />
                <div>네이버맵</div>
              </label>             
            </div>
          </div>
          {/* 지도 커스텀 타일 */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>지도 커스텀 타일</div>
            <MapInput 
              placeholder={'URL'} 
              value={omeyeSettingsInfo.customMapTile} 
              onChange={(e) => {
                setOmeyeSettingsInfo((pre) => ({
                  ...pre,
                  customMapTile: e
                }))
              }}
            />
            <OMEYEButton>새로고침</OMEYEButton>
          </div>

          {/* 지도 파일 업로드 */}
          <div style={{display: 'flex', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>지도 파일 업로드</div>
            <div style={{display: 'flex'}}>
              <OMEYEButton>업로드</OMEYEButton>
              <OMEYEButton>새로고침</OMEYEButton>
            </div>
          </div>

          {/* 줌 범위 */}
          <div style={{display: 'flex', marginBottom: '10px'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>줌 범위</div>
            <div>
              최소: 
              <DayInput 
                value={omeyeSettingsInfo?.minZoom}
                onChange={(e) => {
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    minZoom: parseInt(e)
                  }))
                }}
              /> 
              최대: 
              <DayInput 
                value={omeyeSettingsInfo?.maxZoom}
                onChange={(e) => {
                  setOmeyeSettingsInfo((pre) => ({
                    ...pre,
                    maxZoom: parseInt(e)
                  }))
                }}
              />
            </div>
          </div>

          {/* CCTV 아이콘 설정 */}
          <div style={{display: 'flex'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>CCTV 아이콘 설정</div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div>
                <OMEYEButton>기본값</OMEYEButton>
                <OMEYEButton>선택시</OMEYEButton>
                <OMEYEButton>출발</OMEYEButton>
                <OMEYEButton>도착</OMEYEButton>
              </div>
              {/* <div>
                아이콘 이미지
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OMEYESettings

const DayInput = styled(Input)`
  height: 30px;
  border-radius: 10px;
  border: none;
  outline: none;
  border-radius: 10px
  font-size: 2.3rem;
  text-align: center;
  flex: 0 0 100px;
  color: white;
`

const MapInput = styled(Input)`
  height: 30px;
  border-radius: 10px;
  border: none;
  outline: none;
  border-radius: 10px
  font-size: 2.3rem;
  text-align: center;
  flex: 0 0 300px;
  color: white;
`

const OMEYEButton = styled(Button)`
  height: 30px;
  margin-right: 10px;
`