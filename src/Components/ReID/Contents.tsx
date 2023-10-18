import styled from "styled-components"
import { globalStyles } from "../../styles/global-styled"
import { ReIDMenuItems } from "./MenuItems"
import { useRecoilValue } from "recoil"
import { conditionMenu } from "../../Model/ConditionMenuModel"
import { SidebarWidth } from "../../Constants/CSSValues"

const Contents = () => {
    const currentMenu = useRecoilValue(conditionMenu)
    
    return <ContentsContainer>
        {
            ReIDMenuItems.map(_ => <ReIDContentsWrapper key={_.key} selected={currentMenu === _.key}>
                <_.Component/>
            </ReIDContentsWrapper>)
        }
    </ContentsContainer>
}

export default Contents

const ContentsContainer = styled.div`
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
    width: calc(100% - ${SidebarWidth - 60}px);
`

const ReIDContentsWrapper = styled.div<{selected: boolean}>`
    height: 100%;
    ${({selected}) => globalStyles.displayNoneByState(!selected)}
`