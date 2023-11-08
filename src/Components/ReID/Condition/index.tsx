import styled from "styled-components"
import ContentsWrapper from "./ContentsWrapper"

const Condition = () => {
    return <Container>
        <ContentsWrapper />
    </Container>
}

export default Condition

const Container = styled.div`
    height: 100%;
    overflow: hidden;
    position: relative;
`