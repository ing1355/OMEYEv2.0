import styled from "styled-components"
import Button from "../../../Constants/Button"
import Dropdown from "../../../Layout/Dropdown"

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

const ServerMgmtSidebar = () => {
  return (
    <div>
      <div>제어</div>
      <div style={{display: 'flex'}}>
        <div>서버 재부팅</div>
        <ServerControlButton>재부팅</ServerControlButton>
      </div>
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>서비스 제어</div>
          <div>
            <ServerControlButton>시작</ServerControlButton>
            <ServerControlButton>종료</ServerControlButton>
            <ServerControlButton>재시작</ServerControlButton>
          </div>
        </div>
        <div>
          <ServerControlDropdown itemList={ServerControlDropdownList}/>
        </div>
      </div>
      <div>
        <div>로그 파일 다운로드</div>
        <div style={{display: 'flex'}}>
          <ServerControlDropdown itemList={ServerControlDropdownList}/>
          <button>다운로드</button>
        </div>
      </div>
      <div>
        <div>모델 파일 다운로드</div>
        <div style={{display: 'flex'}}>
          <div>선택한 파일 이름</div>
          <button>업로드</button>
        </div>
        <div>진행률 프로그래스</div>
      </div>
    </div>
  )
}

export default ServerMgmtSidebar

const ServerControlButton = styled(Button)`
  height: 30px;
`

const ServerControlDropdown = styled(Dropdown)`
  height: 35px;
  width: 100%;
`