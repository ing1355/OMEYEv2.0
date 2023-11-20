import styled from "styled-components"
import Button from "../../../Constants/Button"
import Dropdown from "../../../Layout/Dropdown"
import serverRebootIcon from "../../../../assets/img/serverRebootIcon.png"
import { GlobalBackgroundColor, InputBackgroundColor, TextActivateColor, globalStyles } from "../../../../styles/global-styled";
import { Axios } from "../../../../Functions/NetworkFunctions";
import { serverRebootApi } from "../../../../Constants/ApiRoutes";
import Input from "../../../Constants/Input";
import clearIcon from '../../../../assets/img/rankUpIcon.png'
import { convertFullTimeStringToHumanTimeFormat } from "../../../../Functions/GlobalFunctions";
import { useState } from "react";
import TimeModal, { TimeModalDataType } from "../../../ReID/Condition/Constants/TimeModal";

const ServerControlDropdownList = [
  {
    key: 'detect',
    value: 'detect',
    label: 'detect'
  }, 
  {
    key: 'main',
    value: 'main',
    label: 'main'
  }, 
  {
    key: 'selective',
    value: 'selective',
    label: 'selective'
  }, 
  {
    key: 'rt',
    value: 'rt',
    label: 'rt'
  },  
  {
    key: 'reid',
    value: 'reid',
    label: 'reid'
  },
  {
    key: 'mediaserver',
    value: 'mediaserver',
    label: 'mediaserver'
  },
];

const logFileDownloadList = [
  {
    key: 'BE',
    value: 'BE',
    label: '백엔드'
  }, 
  {
    key: 'AI',
    value: 'AI',
    label: 'AI'
  },
];

const ServerMgmtSidebar = () => {
  const [timeValue, setTimeValue] = useState<TimeModalDataType | undefined>(undefined)
  const [timeVisible, setTimeVisible] = useState(false)
  const [selectedService, setSelectedService] = useState<string>('detect');

  const serverRebootFun = async () => {
    const res = await Axios('POST', serverRebootApi,{
      priority: 0,
      schedule: '',
    })
    if (res) {
      console.log('서버 재부팅 성공')
    }
  }

  return (
    <div>
      <div style={{fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px'}}>제어</div>
      <div style={{display: 'flex', marginBottom: '10px'}}>
        <div style={{lineHeight: '30px'}}>서버 재부팅</div>
        <ServerControlButton 
          icon={serverRebootIcon}
          onClick={serverRebootFun}
        >
        </ServerControlButton>
      </div>
      <div style={{marginBottom: '15px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
          <div style={{lineHeight: '30px'}}>서비스 제어</div>
          <div>
            <ServerControlButton
            >
              시작
            </ServerControlButton>
            <ServerControlButton
            >
              종료
            </ServerControlButton>
            <ServerControlButton
            >
              재시작
            </ServerControlButton>
          </div>
        </div>
        <div>
          <ServerControlDropdown 
            itemList={ServerControlDropdownList} 
            bodyStyle={{backgroundColor: `${InputBackgroundColor}`, zIndex: 1}}
            onChange={val => {
              setSelectedService(val.value as string);
            }}
          />
        </div>
      </div>
      <div style={{marginBottom: '15px', lineHeight: '30px'}}>
        <div>로그 파일 다운로드</div>
        <div style={{marginBottom: '10px'}}>
          <DateSearch onClick={() => {
              setTimeVisible(true)
          }}>
              {timeValue ? `${convertFullTimeStringToHumanTimeFormat(timeValue.startTime)} ~ ${convertFullTimeStringToHumanTimeFormat(timeValue.endTime!)}` : '시간을 입력해주세요.'}
              {timeValue && <ClearBtnContainer onClick={e => {
                  e.stopPropagation()
                  setTimeValue(undefined)
              }}>
                  <ClearBtn src={clearIcon}/>
              </ClearBtnContainer>}
          </DateSearch>
        </div>
        <div style={{display: 'flex'}}>
          <ServerControlDropdown 
            itemList={ServerControlDropdownList}
            bodyStyle={{backgroundColor: `${InputBackgroundColor}`, zIndex: 1}}
          />
          <ServerControlButton>다운로드</ServerControlButton>
        </div>
      </div>
      <div style={{marginBottom: '15px', lineHeight: '30px'}}>
        <div>모델 파일 다운로드</div>
        <div style={{display: 'flex'}}>
          <div>선택한 파일 이름</div>
          <ServerControlButton>업로드</ServerControlButton>
        </div>
        <div>진행률 프로그래스</div>
      </div>
      <TimeModal visible={timeVisible} close={() => {
          setTimeVisible(false)
      }} defaultValue={timeValue} onChange={setTimeValue} title="검색 시간" />
    </div>
  )
}

export default ServerMgmtSidebar

const ServerControlButton = styled(Button)`
  height: 30px;
  margin-left: 10px;
`

const ServerControlDropdown = styled(Dropdown)`
  height: 35px;
  width: 100%;
`

const DateSearch = styled.div`
    color: white;
    border-radius: 10px;
    padding: 4px 12px;
    height: 100%;
    ${globalStyles.flex()}
    width: 100%;
    cursor: pointer;
    background-color: ${GlobalBackgroundColor};
    position: relative;
`

const ClearBtnContainer = styled.div`
    position: absolute;
    top: 50%;
    width: 36px;
    height: 36px;
    right: 0px;
    padding: 8px;
    transform: translateY(-50%);
    border-radius: 50%;
    &:hover {
        border: 1px solid ${TextActivateColor};
    }
`

const ClearBtn = styled.img`
    width: 100%;
    height: 100%;
    transform: rotateZ(45deg);
`