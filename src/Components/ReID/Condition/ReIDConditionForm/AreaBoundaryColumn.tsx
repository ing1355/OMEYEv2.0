import { useRecoilState, useSetRecoilState } from "recoil"
import ConditionParamsInputColumnComponent from "./ConditionParamsInputColumnComponent"
import { conditionAreaDatas } from "../../../../Model/ConditionDataModel"
import styled from "styled-components"
import { ContentsActivateColor, ContentsBorderColor, globalStyles } from "../../../../styles/global-styled"
import { AreaSelectIndex, AreaSelectVisible } from "../../../../Model/ConditionParamsModalModel"
import Button from "../../../Constants/Button"
import IconBtn from "../../../Constants/IconBtn"
import cctvIcon from '../../../../assets/img/treeCCTVIcon.png'

const AreaBoundaryColumn = () => {
    const [areaData, setAreaData] = useRecoilState(conditionAreaDatas)
    const setAreaIndex = useSetRecoilState(AreaSelectIndex)
    const setAreaVisible = useSetRecoilState(AreaSelectVisible)
    
    const initAction = () => {
        setAreaData([])
    }
    const addAction = () => {
        setAreaVisible(true)
    }
    const modifyAction = (ind: number) => {
        setAreaVisible(true)
        setAreaIndex(ind)
    }
    const deleteAction = (index: number) => {
        setAreaData(areaData.filter((_, ind) => ind !== index))
    }
    const allSelectAction = () => {
        setAreaData(areaData.every(_ => _.selected) ? areaData.map(_ => ({ ..._, selected: false })) : areaData.map(_ => ({ ..._, selected: true })))
    }
    return <Container>
        <ConditionParamsInputColumnComponent
            title={`CCTV(${areaData.length})`}
            titleIcon={cctvIcon}
            isDataExist={areaData.length > 0}
            initAction={initAction}
            dataAddAction={addAction}
            noDataText="CCTV 추가"
            allSelectAction={allSelectAction}
            allSelected={areaData.every(_ => _.selected)}>
            {
                areaData.map((_, ind) => <AreaDataItem key={ind} selected={_.selected || false} onClick={() => {
                    setAreaData(areaData.map((__, _ind) => ind === _ind ? {
                        ...__,
                        selected: !__.selected
                    } : __))
                }}>
                    <AreaDataItemTitle>
                        <div>
                            그룹 {ind + 1}
                        </div>
                        <HeaderBtnsContainer>
                            <IconBtn type="edit" onClick={(e) => {
                                e.stopPropagation()
                                modifyAction(ind)
                            }} />
                            <IconBtn type="delete" onClick={(e) => {
                                e.stopPropagation()
                                deleteAction(ind)
                            }} />
                        </HeaderBtnsContainer>
                    </AreaDataItemTitle>
                    <AreaDataItemContents>
                        {_.cctvList.length}대
                    </AreaDataItemContents>
                    <BtnsContainer>
                        <Btn activate={_.selected}>
                            {_.selected ? '해제' : '선택'}
                        </Btn>
                    </BtnsContainer>
                </AreaDataItem>)
            }
        </ConditionParamsInputColumnComponent>
    </Container>
}

export default AreaBoundaryColumn

const Container = styled.div`
    ${globalStyles.conditionParamsColumnContainer}
`

const AreaDataItem = styled.div<{ selected: boolean }>`
    border: 1px solid ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
    width: 100%;
    flex: 0 0 130px;
    ${globalStyles.conditionDataItemBox}
    ${globalStyles.flex({ gap: '8px', justifyContent: 'space-between' })}
    cursor: pointer;
`

const AreaDataItemTitle = styled.div`
    color: white;
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    & > div {
        font-size: 1.1rem;
        padding-left: 10px;
    }
    padding: 1px;
`

const HeaderBtnsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '4px', justifyContent: 'flex-end' })}
`

const AreaDataItemContents = styled.div`
    font-size: 1rem;
    color: white;
`

const BtnsContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection: 'row' })}
`

const Btn = styled(Button)`
    flex: 1;
    ${globalStyles.conditionDataItemBoxSelectBtn}
`