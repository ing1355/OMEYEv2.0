import styled from "styled-components"
import Input from "../../../Constants/Input"

const OMEYESidebar = () => {
  return (
    <div>
      {/* FPS 설정 */}
      <div>
        {/* FPS 헤더 */}
        <div style={{display: 'flex', flexDirection: 'row'}}>
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
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>사람</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput />
              <div>프로그래스</div>
            </div>
          </div>

          {/* 얼굴 */}
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>얼굴</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput />
              <div>프로그래스</div>
            </div>
          </div>

          {/* 번호판 */}
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{width: '25%', paddingLeft: '10px'}}>번호판</div>
            <div style={{width: '75%'}}>
              <OMEYESettingsSideBarInput />
              <div>프로그래스</div>
            </div>
          </div>
        </div>
      </div>

      {/* 최대 선택 가능 CCTV 수 */}
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{width: '25%'}}>최대 선택 가능 CCTV 수(과거영상용과 실시간용 나누기)</div>
        <div style={{width: '75%'}}>
          <OMEYESettingsSideBarInput />
          <div>프로그래스</div>
        </div>
      </div>

      {/* 최대 허용 분석 영상 시간 */}
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{width: '25%'}}>최대 허용 분석 영상 시간</div>
        <div style={{width: '75%'}}>
          <OMEYESettingsSideBarInput />
          <div>프로그래스</div>
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