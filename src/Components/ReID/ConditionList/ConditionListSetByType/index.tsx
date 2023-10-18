import { useRecoilState } from "recoil"
import { ReIDObjectTypeKeys } from "../../ConstantsValues"
import { ConditionListType, conditionTargetDatasListByObjectType } from "../../../../Model/ConditionDataModel"
import styled from "styled-components"
import ConditionListItem from "./ConditionListItem"
import { SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"

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
        <ListContainer>
            {datas.map((_, ind) => <ConditionListItem key={ind} data={_} setData={changeSingleData} deleteAction={deleteSingleData}/>)}
        </ListContainer>
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
    ${globalStyles.flex({flexDirection:'row', flexWrap:'wrap', gap:'1%', justifyContent:'flex-start', alignItems:'flex-start'})}
`