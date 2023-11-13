import { useRecoilState } from "recoil"
import { ConditionListType, conditionTargetDatasListByObjectType } from "../../../../Model/ConditionDataModel"
import styled from "styled-components"
import ConditionListItem from "./ConditionListItem"
import { globalStyles } from "../../../../styles/global-styled"
import { ReIDObjectTypeKeys } from "../../../../Constants/GlobalTypes"

type ConditionListSetByTypeProps = {
    type: ReIDObjectTypeKeys
}

const ConditionListSetByType = ({ type }: ConditionListSetByTypeProps) => {
    const [datas, setDatas] = useRecoilState(conditionTargetDatasListByObjectType(type))
    
    const changeSingleData = (data: ConditionListType) => {
        setDatas(datas.map(_ => _.id === data.id ? data : _))
    }

    const deleteSingleData = (id: ConditionListType['id']) => {
        setDatas(datas.filter(_ => _.id !== id))
    }

    return <Container>
        {
            datas.length > 0 ? <ListContainer>
                {datas.map((_, ind) => <ConditionListItem key={ind} data={_} setData={changeSingleData} deleteAction={deleteSingleData} />)}
            </ListContainer> : <NoDataContainer>
                저장한 검색 조건이 존재하지 않습니다.<br />
                검색 조건 설정 메뉴에서 검색 조건을 저장해주세요.
            </NoDataContainer>
        }
        {/* {
            datas.map((_, ind) => <ConditionListItem key={ind} data={_} />)
        } */}
    </Container>
}

export default ConditionListSetByType

const Container = styled.div`
    height: 100%;
`

const ListContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', flexWrap: 'wrap', gap: '1%', justifyContent: 'flex-start', alignItems: 'flex-start' })}
`

const NoDataContainer = styled.div`
    ${globalStyles.flex()}
    height: 100%;
    font-size: 1.5rem;
    text-align: center;
    line-height: 2.5rem;
`