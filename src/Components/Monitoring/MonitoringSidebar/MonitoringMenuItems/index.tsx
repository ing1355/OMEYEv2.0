import SelectMonitoringCCTVs from "./SelectMonitoringCCTVs"
import ChangeLayout from "./ChangeLayout"

const MonitoringMenuItems = () => {
    return <>
        <SelectMonitoringCCTVs index={0}/>
        <ChangeLayout index={1}/>
    </>
}

export default MonitoringMenuItems