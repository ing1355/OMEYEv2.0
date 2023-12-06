import styled from "styled-components"
import Input from "../../Constants/Input";
import Button from "../../Constants/Button";
import { useEffect, useState } from "react";
import { CCTVIconUploadApi, MapSettingsApi, SettingsInfoApi, customMapTileApi, mapFileUploadApi } from "../../../Constants/ApiRoutes";
import { Axios } from "../../../Functions/NetworkFunctions";
import { GetOmeyeSettingsInfoType, OmeyeSettingsInfo } from "../../../Model/OmeyeSettingsDataModel";
import { useRecoilState } from "recoil";
import useMessage from "../../../Hooks/useMessage";
import { OnlyInputNumberFun } from "../../../Functions/GlobalFunctions";
import whiteCheckIcon from "../../../assets/img/whiteCheckIcon.png"
import UploadButton from "../Constants/UploadButton";

type CCTVIconType = 'DEFAULT' | 'ON_SELECT' | 'START_POINT' | 'END_POINT';

const OMEYESettings = () => {
  const [omeyeSettingsInfo, setOmeyeSettingsInfo] = useRecoilState(OmeyeSettingsInfo);
  const [selectedCCTVIcon, setSelectedCCTVIcon] = useState<CCTVIconType>('DEFAULT');
  const message = useMessage();

  const GetOMEYESettingsInfo = async () => {
    const res:GetOmeyeSettingsInfoType = await Axios('GET', SettingsInfoApi)
    if (res) setOmeyeSettingsInfo(res);
  }

  useEffect(() => {
    GetOMEYESettingsInfo();
  },[]);

  const ChangeMapCustomTileUrlFun = async () => {
    const res:GetOmeyeSettingsInfoType = await Axios('PUT', customMapTileApi, {
      customMapTile: omeyeSettingsInfo.customMapTile,
    })
    
    if(res === undefined) {
      GetOMEYESettingsInfo();
    }
  }

  const PutMapSettingsFun = async () => {
    const res:GetOmeyeSettingsInfoType = await Axios('PUT', MapSettingsApi, {
      mapType: omeyeSettingsInfo.mapType,
      minZoom: omeyeSettingsInfo.minZoom,
      maxZoom: omeyeSettingsInfo.maxZoom
    })
    
    if(res) {
      setOmeyeSettingsInfo(res)
      message.success({title: '지도 설정', msg: '저장에 성공했습니다'});
    } else {
      message.error({title: '지도 설정 에러', msg: '저장에 실패했습니다'});
    }
  }

  const SaveDataFun = () => {
    if(omeyeSettingsInfo.minZoom > omeyeSettingsInfo.maxZoom) {
      message.error({title: '줌 범위 설정 에러', msg: '최대 줌 범위는 최소 줌 범위보다 커야합니다'});
    } else {
      PutMapSettingsFun()
    }
  }

  const SelectMapTypeFun = (mapType: string) => {
    setOmeyeSettingsInfo((pre) => ({
      ...pre,
      mapType
    }))
  }

  const MapFileUploadFun = async (file: any) => {
    const res = await Axios('POST', mapFileUploadApi, {
      mapFile: file
    }, true);

    if(res !== undefined) {
      if(res.data.success) {
        message.success({ title: '지도 파일 업로드', msg: '지도 파일 업로드에 성공했습니다' })
      } else {
        message.error({ title: '지도 파일 업로드', msg: '지도 파일 업로드에 실패했습니다' })
      }
    } else {
      message.error({ title: '지도 파일 업로드', msg: '지도 파일 업로드에 실패했습니다' })
    }
  }

  const CCTVIconFileUploadFun = async (file: any) => {
    const res = await Axios('POST', CCTVIconUploadApi, {
      file: file,
      iconName: selectedCCTVIcon
    }, true);

    if(res !== undefined) {
      if(res.data.success) {
        message.success({ title: 'CCTV 아이콘 파일 업로드', msg: 'CCTV 아이콘 파일 업로드에 성공했습니다' })
      } else {
        message.error({ title: 'CCTV 아이콘 파일 업로드', msg: 'CCTV 아이콘 파일 업로드에 실패했습니다' })
      }
    } else {
      message.error({ title: 'CCTV 아이콘 파일 업로드', msg: 'CCTV 아이콘 파일 업로드에 실패했습니다' })
    }
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <OMEYEButton
          hover
          onClick={SaveDataFun}
          icon={whiteCheckIcon}
          iconStyle={{width: '15px', height: '15px'}}
        >
          저장
        </OMEYEButton>
      </div>

      {/* 지도 설정 */}
      <div>
        <div style={{width: '25%', marginBottom: '30px'}}>지도 설정</div>
        {/* 지도 설정 내부 타이틀 */}
        <div>
          {/* 타입 */}
          <div style={{display: 'flex', flexDirection: 'row', marginBottom: '25px'}}>
            <div style={{width: '25%', paddingLeft: '10px', lineHeight: '30px', minWidth: '120px'}}>타입</div>
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
              <label style={{display: 'flex', flexDirection: 'row', marginRight: '15px'}}>
                <input 
                  type="radio" 
                  name="map" 
                  checked={omeyeSettingsInfo.mapType === 'KAKAO'}
                  onChange={() => {
                    SelectMapTypeFun('KAKAO');
                  }}
                />
                <div style={{lineHeight: '30px', position: 'relative', top: '2.2px'}}>카카오맵</div>
              </label>
              <label style={{display: 'flex', flexDirection: 'row', marginRight: '15px'}}>
                <input 
                  type="radio" 
                  name="map" 
                  checked={omeyeSettingsInfo.mapType === 'DEFAULT'}
                  onChange={() => {
                    SelectMapTypeFun('DEFAULT');
                  }}
                />
                <div style={{lineHeight: '30px', position: 'relative', top: '2.2px'}}>openstreet</div>
              </label>  
              <label style={{display: 'flex', flexDirection: 'row', marginRight: '15px'}}>
                <input 
                  type="radio" 
                  name="map" 
                  checked={omeyeSettingsInfo.mapType === 'NAVER'}
                  onChange={() => {
                    SelectMapTypeFun('NAVER');
                  }}        
                />
                <div style={{lineHeight: '30px', position: 'relative', top: '2.2px'}}>네이버맵</div>
              </label>             
            </div>
          </div>
          {/* 지도 커스텀 타일 */}
          {/* <div style={{display: 'flex', flexDirection: 'row', marginBottom: '25px'}}>
            <div style={{width: '25%', paddingLeft: '10px', lineHeight: '30px'}}>지도 커스텀 타일</div>
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
          </div> */}

          {/* 지도 파일 업로드 */}
          <div style={{display: 'flex', marginBottom: '25px'}}>
            <div style={{width: '25%', paddingLeft: '10px', lineHeight: '30px', minWidth: '120px'}}>지도 파일 업로드</div>
            <div>
              <UploadButton onSubmit={(files) => {
                const file = files[0];
                const fileExtension = file?.name.split('.').pop();
                const isFileExtensionPth = fileExtension === 'zip';
                if(!file) return message.error({ title: '지도 파일 업로드 에러', msg: '파일을 다시 업로드해주세요' })
                if(!isFileExtensionPth) return message.error({ title: '지도 파일 업로드 에러', msg: '파일 형식이 올바르지 않습니다' })
                MapFileUploadFun(file);
              }}/>
            </div>
          </div>

          {/* 줌 범위 */}
          <div style={{display: 'flex', marginBottom: '25px'}}>
            <div style={{width: '25%', paddingLeft: '10px', lineHeight: '30px', minWidth: '120px'}}>줌 범위</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                최소: 
                <DayInput 
                  value={omeyeSettingsInfo?.minZoom ? omeyeSettingsInfo?.minZoom : 0}
                  onChange={(e) => {
                    const num = OnlyInputNumberFun(e)
                    setOmeyeSettingsInfo((pre) => ({
                      ...pre,
                      minZoom: parseInt(num)
                    }))
                  }}
                /> 
              </div>
              <div>
                최대: 
                <DayInput 
                  value={omeyeSettingsInfo?.maxZoom ? omeyeSettingsInfo?.maxZoom : 0}
                  onChange={(e) => {
                    const num = OnlyInputNumberFun(e)
                    setOmeyeSettingsInfo((pre) => ({
                      ...pre,
                      maxZoom: parseInt(num)
                    }))
                  }}
                />
              </div>
            </div>
          </div>

          {/* CCTV 아이콘 설정 */}
          <div style={{display: 'flex'}}>
            <div style={{width: '25%', paddingLeft: '10px', lineHeight: '30px', minWidth: '120px'}}>CCTV 아이콘 설정</div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{marginBottom: '20px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px'}}>
                <OMEYEButton 
                  activate={selectedCCTVIcon === 'DEFAULT'}
                  onClick={() => {
                    setSelectedCCTVIcon('DEFAULT');
                  }}
                >
                  기본값
                </OMEYEButton>
                <OMEYEButton 
                  activate={selectedCCTVIcon === 'ON_SELECT'}
                  onClick={() => {
                    setSelectedCCTVIcon('ON_SELECT');
                  }}
                >
                  선택시
                </OMEYEButton>
                <OMEYEButton 
                  activate={selectedCCTVIcon === 'START_POINT'}
                  onClick={() => {
                    setSelectedCCTVIcon('START_POINT');
                  }}
                >
                  출발
                </OMEYEButton>
                <OMEYEButton 
                  activate={selectedCCTVIcon === 'END_POINT'}
                  onClick={() => {
                    setSelectedCCTVIcon('END_POINT');
                  }}
                >
                  도착
                </OMEYEButton>
              </div>
              <div>
                <UploadButton onSubmit={files => {
                  const file = files[0];
                  const fileExtension = file?.name.split('.').pop();
                  if(!file) {
                    message.error({ title: 'CCTV 아이콘 파일 업로드 에러', msg: '파일을 다시 업로드해주세요' })
                  } else {
                    CCTVIconFileUploadFun(file);
                  }
                }}/>
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
  margin: 0px 30px 0px 10px;
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
`