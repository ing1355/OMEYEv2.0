import styled from "styled-components"
import Dropdown from "../../Layout/Dropdown"
import { GlobalBackgroundColor } from "../../../styles/global-styled";
import Input from "../../Constants/Input";
import Button from "../../Constants/Button";

const DayDropdownItemList = [
  {
    key: 1,
    value: 1,
    label: 1
  }, 
  {
    key: 2,
    value: 2,
    label: 2
  }, 
  {
    key: 3,
    value: 3,
    label: 3
  }, 
  {
    key: 4,
    value: 4,
    label: 4
  },  
];

const OMEYESettings = () => {
  return (
    <div>
      {/* 과거영상 저장 기간 */}
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{width: '25%'}}>
          과거영상 저장 기간
        </div>
        <div style={{width: '90px', display: 'flex', flexDirection: 'row'}}>
          <DayDropdown itemList={DayDropdownItemList} bodyStyle={{backgroundColor: GlobalBackgroundColor, zIndex: 1}}/>
          <div style={{lineHeight: '30px'}}>일</div>
        </div>
      </div>

      {/* 지도 설정 */}
      <div>
        <div style={{width: '25%'}}>지도 설정</div>
        {/* 지도 설정 내부 타이틀 */}
        <div>
          {/* 타입 */}
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{width: '25%'}}>타입</div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <input type="checkbox"/>
                <div>카카오맵</div>
              </div>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <input type="checkbox"/>
                <div>openstreet</div>
              </div>  
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <input type="checkbox"/>
                <div>네이버맵</div>
              </div>             
            </div>
          </div>
          {/* 지도 커스텀 타일 */}
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{width: '25%'}}>지도 커스텀 타일</div>
            <MapInput placeholder={'URL'} value={''} onChange={value => {
                // setTitle(value)
            }} 
            // disabled={} maxLength={20}
            />
            <OMEYEButton>새로고침</OMEYEButton>
          </div>

          {/* 지도 파일 업로드 */}
          <div style={{display: 'flex'}}>
            <div>지도 파일 업로드</div>
            <div style={{display: 'flex'}}>
              <div>아이콘</div>
              <div>클릭하여 파일 선택</div>
              <OMEYEButton>새로고침</OMEYEButton>
            </div>
          </div>

          {/* 줌 범위 */}
          <div style={{display: 'flex'}}>
            <div>줌 범위</div>
            <div>프로그래스</div>
          </div>

          {/* CCTV 아이콘 설정 */}
          <div style={{display: 'flex'}}>
            <div>CCTV 아이콘 설정</div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div>
                <OMEYEButton>기본값</OMEYEButton>
                <OMEYEButton>선택시</OMEYEButton>
                <OMEYEButton>출발</OMEYEButton>
                <OMEYEButton>도착</OMEYEButton>
              </div>
              <div>
                아이콘 이미지
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OMEYESettings

const DayDropdown = styled(Dropdown)`
  height: 30px;
  width: 90px;
  position: relative;
`

const MapInput = styled(Input)`
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

const OMEYEButton = styled(Button)`
  height: 30px;
`