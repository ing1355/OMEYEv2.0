import SelectMonitoringCCTVs from "./SelectMonitoringCCTVs"
import ChangeLayout from "./ChangeLayout"
import TitleVisibleChange from "./TitleVisibleChange"

const MonitoringMenuItems = () => {
    return <>
        <SelectMonitoringCCTVs index={0}/>
        <ChangeLayout index={1}/>
        <TitleVisibleChange index={2}/>
    </>
}

export default MonitoringMenuItems