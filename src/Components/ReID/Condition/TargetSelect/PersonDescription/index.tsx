import styled from "styled-components"
import { ButtonActiveBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../../../styles/global-styled"
import Button from "../../../../Constants/Button"
import { useState } from "react"
import { DescriptionCategories, DescriptionCategoryKeyType } from "./DescriptionType"
import DescriptionSelectContents from "./DescriptionSelectContents"
import PersonDescriptionResultImage from "./Layout/PersonDescriptionResultImage"

const PersonDescription = () => {
    const [category, setCategory] = useState<DescriptionCategoryKeyType>('general')
    
    return <Container>
        <CategoryContainer>
            {
                DescriptionCategories.map(_ => <CategoryItem selected={category === _.key} key={_.key} onClick={() => {
                    setCategory(_.key)
                }}>
                    {_.title}
                </CategoryItem>)
            }
        </CategoryContainer>
        <SelectItemsContainer>
            <DescriptionSelectContents type={category} />
        </SelectItemsContainer>
        <ResultImageContainer>
            <PersonDescriptionResultImage/>
        </ResultImageContainer>
    </Container>
}

export default PersonDescription


const Container = styled.div`
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap:'1%' })}
`

const CommonStyles = `
    height: 100%;
`

const CategoryContainer = styled.div`
    ${CommonStyles}
    flex: 1;
    ${globalStyles.flex({ justifyContent: 'space-around', gap: '2%' })}
`

const CategoryItem = styled(Button) <{ selected: boolean }>`
    flex: 1;
    width: 100%;
    font-size: 1.2rem;
    white-space: pre-wrap;
    ${({selected}) => selected && {
        backgroundColor: ButtonActiveBackgroundColor
    }};
    &:hover {
        border: 1px solid ${ButtonActiveBackgroundColor};
    }
`

const SelectItemsContainer = styled.div`
    ${CommonStyles}
    flex: 6.4;
    height: 100%;
    padding: 12px 24px;
    border-radius: 16px;
    background-color: ${SectionBackgroundColor};
`

const ResultImageContainer = styled.div`
    ${CommonStyles}
    width: 460px;
    ${globalStyles.flex()}
    font-size: 2rem;
    position: relative;
    border-radius: 16px;
    background-color: ${SectionBackgroundColor};
`