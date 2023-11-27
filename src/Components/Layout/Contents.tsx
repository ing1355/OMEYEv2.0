import styled from "styled-components";
import { HeaderHeight } from "../../Constants/CSSValues";
import { ChildrenType } from "../../global";

type ContentsProps = {
    children: ChildrenType
}

const Contents = ({children}: ContentsProps) => {
    return <ContentsContainer>
        {children}
    </ContentsContainer>
}

export default Contents;

const ContentsContainer = styled.section`
    height: calc(100% - ${HeaderHeight + 24}px);
    width: 100%;
    position: relative;
`