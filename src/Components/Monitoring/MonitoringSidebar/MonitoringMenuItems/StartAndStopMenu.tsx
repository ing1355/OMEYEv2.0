import { useRecoilState } from "recoil"
import MonitoringSidebarButton from "./MonitoringSidebarButton"
import { MonitoringDatas } from "../../../../Model/MonitoringDataModel"

const StartAndStopMenu = () => {
    const [monitoringStatus, setMonitoringStatus] = useRecoilState(MonitoringDatas("status"))

    return <MonitoringSidebarButton onClick={() => {
        if(monitoringStatus === 'IDLE') {
            setMonitoringStatus("RUNNING")
        } else {
            setMonitoringStatus('IDLE')
        }
    }}>
        {monitoringStatus === 'IDLE' ? '시작' : '종료'}
    </MonitoringSidebarButton>
}

export default StartAndStopMenu