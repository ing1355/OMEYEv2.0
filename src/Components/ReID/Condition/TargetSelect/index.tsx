import styled from "styled-components"
import { globalStyles } from "../../../../styles/global-styled"
import Button from "../../../Constants/Button"
import useConditionRoutes from "../Hooks/useConditionRoutes"
import { ReIDConditionTargetSelectCCTVRoute, ReIDConditionTargetSelectImageRoute, ReIDConditionTargetSelectPersonDescriptionRoute } from "../Constants/RouteInfo"
import CCTVMethodIcon from '../../../../assets/img/CCTVMethodIcon.png'
import ImageUploadMethodIcon from '../../../../assets/img/ImageUploadMethodIcon.png'
import DescriptionMethodIcon from '../../../../assets/img/DescriptionMethodIcon.png'
import { useRecoilValue } from "recoil"
import { selectedConditionObjectType } from "../../../../Model/ConditionDataModel"

const ReIDConditionTargetSelect = () => {
    const objectType = useRecoilValue(selectedConditionObjectType)
    const { routePush } = useConditionRoutes()
    return <Container>
        <Item onClick={() => {
            routePush(ReIDConditionTargetSelectCCTVRoute.key)
        }}>
            <Wrapper>
                <Icon src={CCTVMethodIcon}/>
                CCTV 영상
            </Wrapper>
        </Item>
        <Item onClick={() => {
            routePush(ReIDConditionTargetSelectImageRoute.key)
        }}>
            <Wrapper>
                <Icon src={ImageUploadMethodIcon}/>
                이미지 업로드
            </Wrapper>
        </Item>
        {objectType === 'Person' && <Item onClick={() => {
            routePush(ReIDConditionTargetSelectPersonDescriptionRoute.key)
        }}>
            <Wrapper>
                <Icon src={DescriptionMethodIcon}/>
                인상착의
            </Wrapper>
        </Item>}
    </Container>
}

export default ReIDConditionTargetSelect

const Container = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '24px' })}
    height: 100%;
`

const Item = styled(Button)`
    height: 60%;
    flex: 0 0 30%;
`

const Wrapper = styled.div`
    font-size: 3rem;
    ${globalStyles.flex({gap: '6rem'})}
`

const Icon = styled.img`
    width: 80%;
`