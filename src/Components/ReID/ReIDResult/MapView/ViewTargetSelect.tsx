import styled from "styled-components"
import { ButtonActiveBackgroundColor, ButtonDisabledBackgroundColor, SectionBackgroundColor, globalStyles } from "../../../../styles/global-styled"
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"

type ViewTargetSelectProps = {
    datas: {
        title: string
        index: number
        objectIds: number[]
    }[]
    conditionChange: (ind: number[]) => void
    targetChange: (oId: number[][]) => void
}

export const pathColors = ['red', 'blue', 'green']

const ViewTargetSelect = ({ datas, conditionChange, targetChange }: ViewTargetSelectProps) => {
    const [selectedCondition, setSelectedCondition] = useState<number[]>([])
    const [selectedTarget, setSelectedTarget] = useState<number[][]>([])
    const [selectedView, setSelectedView] = useState(0)
    const conditionRef = useRef(selectedCondition)
    const targetRef = useRef(selectedTarget)

    useEffect(() => {
        if (datas.length > 0) {
            if (selectedCondition.length === 0) {
                setSelectedCondition([datas[0].index])
                setSelectedTarget(Array.from({length: datas.length}).map(_ => []))
            }
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
        <Container>
            {
                datas.map((_, ind) => <ItemContainer key={ind} onClick={() => {
                    setSelectedView(ind)
                }}>
                    <Icon selected={selectedCondition.includes(_.index)} onClick={(e) => {
                        e.stopPropagation()
                        if (selectedCondition.includes(_.index)) {
                            setSelectedCondition(selectedCondition.filter(__ => __ !== _.index))
                        } else {
                            setSelectedCondition(selectedCondition.concat(_.index))
                        }
                    }} targetColor={pathColors[ind]}/>
                    <Text>
                        {_.title}
                    </Text>
                </ItemContainer>)
            }
        </Container>
        {
            datas[selectedView] && <TargetContainer>
                {
                    datas[selectedView].objectIds.map((_, ind) => <ItemContainer key={ind} onClick={() => {
                        if (selectedTarget[selectedView].includes(_)) {
                            setSelectedTarget(selectedTarget.map((__, ind) => ind === selectedView ? __.filter(___ => _ !== ___) : __))
                        } else {
                            setSelectedTarget(selectedTarget.map((__, ind) => ind === selectedView ? __.concat(_) : __))
                        }
                    }}>
                        <Icon selected={selectedTarget[selectedView]?.includes(_)} targetColor={'red'}/>
                        <Text>
                            대상 {ind+1}
                        </Text>
                    </ItemContainer>)
                }
            </TargetContainer>
        }
    </>
}

export default ViewTargetSelect

const Container = styled.div`
    position: absolute;
    left: 16px;
    top: 12px;
    background-color: ${SectionBackgroundColor};
    z-index: 10;
    border-radius: 12px;
    padding: 12px 24px;
    height: 40px;
    max-width: 500px;
    overflow: auto;
    ${globalStyles.flex({ flexDirection: 'row', gap: '16px', justifyContent: 'flex-start' })}
`

const TargetContainer = styled.div`
    position: absolute;
    left: 16px;
    top: 60px;
    background-color: ${SectionBackgroundColor};
    z-index: 10;
    border-radius: 12px;
    padding: 12px 24px;
    max-width: 500px;
    overflow: auto;
    ${globalStyles.flex({ flexDirection: 'row', gap: '16px', justifyContent: 'flex-start' })}
`

const ItemContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', gap: '8px', justifyContent:'flex-start' })}
    cursor: pointer;
`

const Icon = styled.div<{ selected: boolean, targetColor: CSSProperties['color'] }>`
    width: 16px;
    height: 16px;
    border-radius: 100%;
    opacity: ${({ selected }) => selected ? 1 : 0.5};
    background-color: ${({targetColor}) => targetColor};
`

const Text = styled.div`
`