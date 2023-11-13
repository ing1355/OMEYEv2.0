import { ButtonBorderColor } from "../../../styles/global-styled";

const ServerManagement = () => {
  return (
    <div>
      <div>모니터링</div>
      <div style={{display: 'flex', gap: '10px', justifyContent: 'space-between'}}>
        <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '46%'}}>
          <div>서비스 정보</div>
          <div>
            <div>
              AI
            </div>
            <div>
              백엔드
            </div>
            <div>
              미디어 서버
            </div>
          </div>
        </div>
        <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '18%'}}>
          <div>서버 정보</div>
          <div style={{marginLeft: '10px'}}>
            <div>프론트엔드: {process.env.REACT_APP_VERSION}</div>
            <div>백엔드: </div>
            <div>AI: </div>
          </div>
        </div>
        <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '18%'}}>
          <div>네트워크 정보</div>
          <div>
            <div>interface name: </div>
            <div>netmask: </div>
            <div>gateway: </div>
            <div>ip: </div>
            <div>dns: </div>
          </div>
        </div>
        <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '18%'}}>
          <div>기타 정보</div>
          <div>
            <div>uptime: days</div>
          </div>
        </div>
      </div>

      <div>

        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%'}}>
            <div>GPU</div>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%'}}>
            <div>memory</div>
            <div>
              <div></div>
              <div></div>
            </div>            
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%'}}>
            <div>disk</div>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%'}}>
            <div>network bandwidth</div>
            <div>
              <div></div>
              <div></div>
            </div>            
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{border: `1px solid ${ButtonBorderColor}`, borderRadius: '5px', width: '49.5%'}}>
            <div>disk</div>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default ServerManagement;