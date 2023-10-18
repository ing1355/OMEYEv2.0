import styled from "styled-components"
import { SectionBackgroundColor } from "../../styles/global-styled"

const Contents = () => {
    
    return <ContentsContainer>
        test
    </ContentsContainer>
}

export default Contents

const ContentsContainer = styled.div`
    height: 100%;
    flex: 1 1 auto;
    background-color: ${SectionBackgroundColor};
`