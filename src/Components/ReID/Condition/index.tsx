import styled from "styled-components"
import ContentsWrapper from "./ContentsWrapper"
import MenuStateManagement from "./MenuStateManagement"

const Condition = () => {

    return <Container>
        <ContentsWrapper />
        <MenuStateManagement/>
    </Container>
}

export default Condition

const Container = styled.div`
    height: 100%;
    overflow: hidden;
    position: relative;
`