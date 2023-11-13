import styled from "styled-components"
import Input from "../../Constants/Input"
import Button from "../../Constants/Button"

const VMSSettings = () => {

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
      <div style={{display: 'flex'}}>
        <div style={{width: '9%'}}>사이트 이름</div>
        <SiteInput placeholder="사이트 이름을 입력해주세요."/>
        <div style={{marginLeft: '15px'}}>
          <VMSButton hover>확인</VMSButton>
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{width: '9%', paddingLeft: '15px'}}>API 서버 IP</div>
        <SiteInput placeholder="116.122.16.31"/>
        <div style={{marginLeft: '15px'}}>
          <VMSButton hover>추가</VMSButton>
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{width: '9%', paddingLeft: '15px'}}>ID</div>
        <SiteInput placeholder="onvif"/>
      </div>     
      <div style={{display: 'flex'}}>
        <div style={{width: '9%', paddingLeft: '15px'}}>PW</div>
        <SiteInput placeholder=""/>
      </div> 
      <div style={{display: 'flex'}}>
        <div style={{width: '9%', paddingLeft: '15px'}}>그룹 ID</div>
        <SiteInput placeholder="(그룹ID)"/>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{width: '9%', paddingLeft: '15px'}}>라이센스</div>
        <SiteInput placeholder="EKFD-RGNG-FDGF-FFGF"/>
      </div>  
      <div style={{display: 'flex'}}>
        <div style={{width: '9%', paddingLeft: '15px'}}>엑셀 업로드</div>
        <VMSButton hover>업로드</VMSButton>
        <div>text.xsl</div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{width: '9%', paddingLeft: '15px'}}>
          <div>동기화</div>
          <div>아이콘</div>
        </div>
        <div>
          연동될 VMS 내의 사이트 및 CCTV 정보를 원모어아이의 데이터베이스에 동기화하는 과정입니다. 
          <br />
          동기화하는 경우, 현재 진행하고 있는 서비스에 영향을 미칠 수 있습니다. 
          <br />
          동기화를 진행하시겠습니까?
          <br />
          <br />

          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{marginBottom: '15px'}}>
              <input type="checkbox" />
              예, 동의합니다. 
            </div>
            <VMSButton>동기화</VMSButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VMSSettings

const SiteInput = styled(Input)`
  height: 30px;
  border-radius: 10px;
  border: none;
  outline: none;
  border-radius: 10px
  font-size: 2.3rem;
  text-align: center;
  flex: 0 0 480px;
  color: white;
  width: 500px;
`

const VMSButton = styled(Button)`
  height: 30px;
  width: 100px;
`