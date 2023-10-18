import Monitoring from "../Components/Monitoring";
import ReID from "../Components/ReID";
import VideoExport from "../Components/VideoExport";
import { AreaAnalyzeMenuKey, MenuKeys, MonitoringMenuKey, ReIdMenuKey, VideoExportMenuKey } from "./GlobalConstantsValues";
import monitoringMenuIcon from '../assets/img/monitoringMenuIcon.png'
import ReIDMenuIcon from '../assets/img/ReIDMenuIcon.png'
import videoExportMenuIcon from '../assets/img/videoExportMenuIcon.png'
import AreaAnalyze from "../Components/AreaAnalyze";

const items: {
    key: MenuKeys
    title: string
    icon: string
    Component: React.FC
}[] = [
    {
        key: ReIdMenuKey,
        title: "고속분석",
        icon: ReIDMenuIcon,
        Component: ReID
    },
    {
        key: MonitoringMenuKey,
        title: "모니터링",
        icon: monitoringMenuIcon,
        Component: Monitoring
    },
    {
        key: VideoExportMenuKey,
        title: "영상반출",
        icon: videoExportMenuIcon,
        Component: VideoExport
    },
    {
        key: AreaAnalyzeMenuKey,
        title: "영역분석",
        icon: ReIDMenuIcon,
        Component: AreaAnalyze
    }
]

export default items