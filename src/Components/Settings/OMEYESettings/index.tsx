import styled from "styled-components"
import Dropdown from "../../Layout/Dropdown"
import { GlobalBackgroundColor } from "../../../styles/global-styled";
import Input from "../../Constants/Input";
import Button from "../../Constants/Button";
import { useEffect, useState } from "react";
import { CCTVIconUploadApi, customMapTileApi, getSettingsInfoApi, mapFileUploadApi, mapTypeApi, maxDurationApi, zoomLevelApi } from "../../../Constants/ApiRoutes";
import { Axios } from "../../../Functions/NetworkFunctions";
import { GetOmeyeSettingsInfoType, OmeyeSettingsInfo, OmeyeSettingsInfoInit } from "../../../Model/OmeyeSettingsDataModel";
import { useRecoilState } from "recoil";
import useMessage from "../../../Hooks/useMessage";
import { OnlyInputNumberFun } from "../../../Functions/GlobalFunctions";
import whiteCheckIcon from "../../../assets/img/whiteCheckIcon.png"
import Form from "../../Constants/Form";

type CCTVIconType = 'DEFAULT' | 'ON_SELECT' | 'START_POINT' | 'END_POINT';

const OMEYESettings = () => {
  const [omeyeSettingsInfo, setOmeyeSettingsInfo] = useRecoilState(OmeyeSettingsInfo);
  const [fileName, setFileName] = useState<string>('');
  const [selectedCCTVIcon, setSelectedCCTVIcon] = useState<CCTVIconType>('DEFAULT');
  const [CCTVIconFileName, setCCTVIconFileName] = useState<string>('');
  const message = useMessage();

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
      GetOMEYESettingsInfo();
    }
  }

  const ChangeMapTypeFun = async () => {
    const res:GetOmeyeSettingsInfoType = await Axios('PUT', mapTypeApi, {mapType: omeyeSettingsInfo.mapType})
    
    if(res === undefined) {
      GetOMEYESettingsInfo();
      message.error({title: '지도 설정 에러', msg: '저장에 실패했습니다'});
    } else {
      ChangeZoomLevelFun();
    }
  }

  const ChangeMapCustomTileUrlFun = async () => {
    const res:GetOmeyeSettingsInfoType = await Axios('PUT', customMapTileApi, {
      customMapTile: omeyeSettingsInfo.customMapTile,
    })
    
    if(res === undefined) {
      GetOMEYESettingsInfo();
    }
  }

  const ChangeZoomLevelFun = async () => {
    const res:GetOmeyeSettingsInfoType = await Axios('PUT', zoomLevelApi, {
      minZoom: omeyeSettingsInfo.minZoom,
      maxZoom: omeyeSettingsInfo.maxZoom
    })
    
    if(res === undefined) {
      GetOMEYESettingsInfo();
      message.error({title: '지도 설정 에러', msg: '저장에 실패했습니다'});
    } else {
      GetOMEYESettingsInfo();
      message.success({title: '지도 설정', msg: '저장에 성공했습니다'});
    }
  }

  const SaveDataFun = () => {
    // ChangeMaxDurationFun(omeyeSettingsInfo.maxResultDuration);
    ChangeMapTypeFun();
    // ChangeMapCustomTileUrlFun();
    // ChangeZoomLevelFun();
    
    // setTimeout(()=>{
    //   message.success({title: '', msg: '저장 완료'});
    //   GetOMEYESettingsInfo();
    // },2000)
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
        setFileName('');
      } else {
        message.error({ title: '지도 파일 업로드', msg: '지도 파일 업로드에 실패했습니다' })
        setFileName('');
      }
    } else {
      message.error({ title: '지도 파일 업로드', msg: '지도 파일 업로드에 실패했습니다' })
      setFileName('');
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName('');
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      const name = fileInput.files[0].name;
      setFileName(name);
    }
  };

  const CCTVIconFileUploadFun = async (file: any) => {
    const res = await Axios('POST', CCTVIconUploadApi, {
      file: file,
      iconName: selectedCCTVIcon
    }, true);

    if(res !== undefined) {
      if(res.data.success) {
        message.success({ title: 'CCTV 아이콘 파일 업로드', msg: 'CCTV 아이콘 파일 업로드에 성공했습니다' })
        setCCTVIconFileName('');
      } else {
        message.error({ title: 'CCTV 아이콘 파일 업로드', msg: 'CCTV 아이콘 파일 업로드에 실패했습니다' })
        setCCTVIconFileName('');
      }
    } else {
      message.error({ title: 'CCTV 아이콘 파일 업로드', msg: 'CCTV 아이콘 파일 업로드에 실패했습니다' })
      setCCTVIconFileName('');
    }
  }

  const handleCCTVIconFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCCTVIconFileName('');
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
      const name = fileInput.files[0].name;
      setCCTVIconFileName(name);
    }
  };

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
      
      {/* 과거영상 저장 기간 */}
      {/* <div style={{display: 'flex', flexDirection: 'row', marginBottom: '30px'}}>
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
      </div> */}

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
              <Form
                id='fileUpload'
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  const { uploadFile } = (e.currentTarget.elements as any);
                  const file = uploadFile.files[0];
                  const fileExtension = file?.name.split('.').pop();
                  const isFileExtensionPth = fileExtension === 'zip';

                  if(!file) return message.error({ title: '지도 파일 업로드 에러', msg: '파일을 다시 업로드해주세요' })
                  if(!isFileExtensionPth) return message.error({ title: '지도 파일 업로드 에러', msg: '파일 형식이 올바르지 않습니다' })
                  
                  MapFileUploadFun(file);
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap'}}>
                  <div style={{lineHeight: '30px'}}>
                    <label 
                      htmlFor='uploadFile'
                      style={{border: '1px solid #ccc', padding: '10px', borderRadius: '5px'}}
                    >
                      파일 선택
                    </label>
                    <input
                      id='uploadFile'
                      type='file'
                      accept='.zip'
                      hidden
                      onChange={handleFileChange}
                    />
                  </div>
                  <div style={{lineHeight: '30px'}}>
                    {fileName}
                  </div>
                  <div>
                    <OMEYEButton 
                      hover
                      type='submit'
                      form='fileUpload'
                    >
                      업로드
                    </OMEYEButton>
                  </div>
                </div>
              </Form>
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
                <Form
                  id='CCTVIconFileUpload'
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const { CCTVIconUploadFile } = (e.currentTarget.elements as any);
                    const file = CCTVIconUploadFile.files[0];
                    const fileExtension = file?.name.split('.').pop();
                    // const isFileExtensionPth = fileExtension === 'zip';
                    if(!file) {
                      message.error({ title: 'CCTV 아이콘 파일 업로드 에러', msg: '파일을 다시 업로드해주세요' })
                    } else {
                      CCTVIconFileUploadFun(file);
                    }
                    
                    // if(!isFileExtensionPth) {
                    //   message.error({ title: '지도 파일 업로드 에러', msg: '파일 형식이 올바르지 않습니다' })
                    // } else {
                    //   CCTVIconFileUploadFun(file);
                    // }
                  }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap'}}>
                    <div style={{lineHeight: '30px'}}>
                      <label 
                        htmlFor='CCTVIconUploadFile'
                        style={{border: '1px solid #ccc', padding: '10px', borderRadius: '5px'}}
                      >
                        파일 선택
                      </label>
                      <input
                        id='CCTVIconUploadFile'
                        type='file'
                        // accept='.zip'
                        hidden
                        onChange={handleCCTVIconFileChange}
                      />
                    </div>
                    <div style={{lineHeight: '30px'}}>
                      {CCTVIconFileName}
                    </div>
                    <div>
                      <OMEYEButton 
                        hover
                        type='submit'
                        form='CCTVIconFileUpload'
                      >
                        업로드
                      </OMEYEButton>
                    </div>
                  </div>
                </Form>
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