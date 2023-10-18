import styled from "styled-components"
import ContentsWrapper from "./ContentsWrapper"
import AreaSelect from "./AreaSelect"

const Condition = () => {
    return <Container>
        <ContentsWrapper />
        <AreaSelect/>
    </Container>
}

export default Condition

const Container = styled.div`
    height: 100%;
    overflow: hidden;
    position: relative;
`