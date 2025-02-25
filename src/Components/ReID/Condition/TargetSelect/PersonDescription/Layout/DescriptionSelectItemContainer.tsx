import { PropsWithChildren } from "react";
import styled from "styled-components";
import { SectionBackgroundColor, globalStyles } from "../../../../../../styles/global-styled";
import infoIcon from '../../../../../../assets/img/descriptions/descriptionInfoIcon.png'

type DescriptionSelectItemContainerProps = PropsWithChildren & {
    title: string
    wrap?: boolean
    info?: boolean
    infoImg?: string
}

const DescriptionSelectItemContainer = ({ title, children, wrap = false, info, infoImg }: DescriptionSelectItemContainerProps) => {
    return <Container>
        <TitleContainer>
            <Title>
                {title}
                {info && <InfoContainer>
                    <Info src={infoIcon} />
                    {
                        <InfoImageContainer>
                            <InfoImg src={infoImg}/>
                        </InfoImageContainer>
                    }
                </InfoContainer>}
            </Title>
        </TitleContainer>
        <Contents _wrap={wrap}>
            {children}
        </Contents>
    </Container>
}

export default DescriptionSelectItemContainer;

const Container = styled.div`
    height: 25%;
    width: 100%;
    ${globalStyles.flex({ justifyContent: 'flex-start', gap: '2%' })}
`

const TitleContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start' })}
    height: 40px;
`

const Title = styled.div`
    font-size: 1.3rem;
`

const InfoContainer = styled.div`
    height: 20px;
    padding: 2px;
    cursor: zoom-in;
    display: inline-block;
    margin-left: 4px;
    position: relative;
    &:hover {
        & > div {
            display: flex;
        }
    }
`

const Info = styled.img`
    height: 100%;
`

const InfoImageContainer = styled.div`
    position: absolute;
    left: 100%;
    top: 100%;
    width: 300px;
    height: 350px;
    background-color: ${SectionBackgroundColor};
    ${globalStyles.flex()}
    display: none;
`

const InfoImg = styled.img`
    width: 100%;
`

const Contents = styled.div<{ _wrap: boolean }>`
    width: 100%;
    height: calc(100% - 40px);
    ${({ _wrap }) => `${globalStyles.flex({ flexDirection: 'row', gap: '2.5%', justifyContent: 'flex-start', flexWrap: _wrap ? 'wrap' : 'nowrap' })}`}
`