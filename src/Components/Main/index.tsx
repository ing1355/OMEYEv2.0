import { useRecoilValueLoadable } from "recoil";
import Menus from "../Menus";
import { SitesData } from "../../Model/SiteDataModel";
import styled from "styled-components";
import { globalStyles } from "../../styles/global-styled";

const Main = () => {
    const sitesState = useRecoilValueLoadable(SitesData)
    if (sitesState.state === 'loading') return <LoadingComponent>
        서버 정보를 불러오는 중입니다...
    </LoadingComponent>
    return <Menus />
}

export default Main;

const LoadingComponent = styled.div`
    height: 100%;
    ${globalStyles.flex()}
    font-size: 4rem;
`