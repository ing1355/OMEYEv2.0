import styled from "styled-components"
import { ButtonActiveBackgroundColor, ButtonDisabledBackgroundColor, ContentsBorderColor, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import { useEffect, useRef, useState } from "react"
import Button from "../../../Constants/Button"
import { IS_PRODUCTION } from "../../../../Constants/GlobalConstantsValues"
import pathToggleIcon from '../../../../assets/img/pathToggleIcon.png'

type ViewTargetSelectProps = {
    datas: {
        title: string
        index: number
        objectIds: number[]
    }[]
    conditionChange: (ind: number[]) => void
    targetChange: (oId: number[][]) => void
}

const ViewTargetSelect = ({ datas, conditionChange, targetChange }: ViewTargetSelectProps) => {
    const [selectedCondition, setSelectedCondition] = useState<number[]>([])
    const [selectedTarget, setSelectedTarget] = useState<number[][]>([])
    const [selectedView, setSelectedView] = useState(0)
    const [visible, setVisible] = useState(false)
    const conditionRef = useRef(selectedCondition)
    const targetRef = useRef(selectedTarget)
    
    useEffect(() => {
        if (datas.length > 0) {
            setSelectedCondition(datas.map(_ => _.index))
            // setSelectedTarget(datas.map(_ => []))
            if(!IS_PRODUCTION) setSelectedTarget(datas.map(_ => _.objectIds))
        }
    }, [datas])
    
    useEffect(() => {
        if (conditionRef.current !== selectedCondition) conditionChange(selectedCondition)
        conditionRef.current = selectedCondition
    }, [selectedCondition])

    useEffect(() => {
        if (targetRef.current !== selectedTarget) targetChange(selectedTarget)
        targetRef.current = selectedTarget
    }, [selectedTarget])

    return <>
        <ToggleBtn hover onClick={() => {
            setVisible(!visible)
        }}>
            <img src={pathToggleIcon}/>
        </ToggleBtn>
        <Container visible={visible}>
            <SubContainer>
                <CCTVsContainer>
                    {datas.map(_ => <CCTVRowContainer key={_.index} selected={selectedView === _.index} onClick={() => {
                        setSelectedView(_.index)
                    }}>
                        <Circle selected={selectedView === _.index}/>
                        <Title>
                            {_.title}
                        </Title>
                    </CCTVRowContainer>)}
                </CCTVsContainer>
                <TargetsContainer nums={datas.length}>
                    {
                        datas[selectedView] && datas[selectedView].objectIds.map((_, ind) => <TargetRowContainer key={ind} onClick={() => {
                            if(selectedTarget[selectedView].includes(_)) {
                                setSelectedTarget(selectedTarget.map(__ => __.filter(___ => ___ !== _)))
                            } else {
                                setSelectedTarget(selectedTarget.map((__, _ind) => _ind === selectedView ? __.concat(_) : __))
                            }
                        }}>
                            <Circle selected={selectedTarget[selectedView] && selectedTarget[selectedView].includes(_)}/>
                            대상 {ind + 1}
                        </TargetRowContainer>)
                    }
                </TargetsContainer>
            </SubContainer>
        </Container>
        {/* <Container>
            {
                datas.map((_, ind) => <ItemContainer key={ind} onClick={(e) => {
                    e.stopPropagation()
                    setSelectedView(ind)
                }}>
                    <Icon selected={selectedCondition.includes(_.index)} onClick={(e) => {
                        if (selectedCondition.includes(_.index)) {
                            setSelectedCondition(selectedCondition.filter(__ => __ !== _.index))
                        } else {
                            setSelectedCondition(selectedCondition.concat(_.index))
                        }
                    }} targetColor={TextActivateColor}/>
                    <Text>
                        {_.title}
                    </Text>
                </ItemContainer>)
            }
        </Container> */}
        {/* {
            datas[selectedView] && <TargetContainer>
                {
                    datas[selectedView].objectIds.map((_, ind) => <ItemContainer key={ind} onClick={() => {
                        if (selectedTarget[selectedView].includes(_)) {
                            setSelectedTarget(selectedTarget.map((__, ind) => ind === selectedView ? __.filter(___ => _ !== ___) : __))
                        } else {
                            setSelectedTarget(selectedTarget.map((__, ind) => ind === selectedView ? __.concat(_) : __))
                        }
                    }}>
                        <Icon selected={selectedTarget[selectedView]?.includes(_)} targetColor={TextActivateColor}/>
                        <Text>
                            대상 {ind+1}
                        </Text>
                    </ItemContainer>)
                }
            </TargetContainer>
        } */}
    </>
}

export default ViewTargetSelect

const RowHeight = 40;

const ToggleBtn = styled(Button)`
    position: absolute;
    left: 16px;
    top: 12px;
    z-index: 10;
    height: 40px;
    border: none;
    ${globalStyles.flex()}
    padding: 8px;
    & > img {
        width: 100%;
        height: 100%;
    }
`

const Container = styled.div<{visible: boolean}>`
    position: absolute;
    left: 16px;
    top: 56px;
    background-color: ${SectionBackgroundColor};
    z-index: 10;
    border-radius: 12px;
    padding: 12px;
    max-height: 300px;
    width: 400px;
    display: ${({visible}) => visible ? 'block' : 'none'}
`

const SubContainer = styled.div`
    width: 100%;
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', alignItems: 'flex-start' })}
`

const CCTVsContainer = styled.div`
    flex: 1;
`

const CCTVRowContainer = styled.div<{ selected: boolean }>`
    width: 250px;
    height: ${RowHeight}px;
    padding: 6px 14px;
    cursor: pointer;
    background-color: ${({ selected }) => selected ? ContentsBorderColor : 'transparent'};
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    &:hover {
        background-color: ${ContentsBorderColor};
    }
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '8px' })}
`

const TargetsContainer = styled.div<{nums: number}>`
    flex: 1;
    height: ${({nums}) => nums * RowHeight}px;
    background-color: ${ContentsBorderColor};
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
`

const TargetRowContainer = styled.div`
    flex: 0 0 1;
    height: ${RowHeight}px;
    padding: 6px 14px;
    cursor: pointer;
    &:hover {
        background-color: ${ContentsBorderColor};
    }
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '8px' })}
`

const Circle = styled.div<{selected: boolean}>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({selected}) => selected ? ButtonActiveBackgroundColor : ButtonDisabledBackgroundColor};
`

const Title = styled.div`
    max-width: calc(100% - 30px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`