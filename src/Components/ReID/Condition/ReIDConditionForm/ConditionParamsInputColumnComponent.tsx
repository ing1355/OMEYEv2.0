import { PropsWithChildren, useState } from 'react'
import styled from 'styled-components';
import { SectionBackgroundColor, globalStyles } from '../../../../styles/global-styled';
import Button from '../../../Constants/Button';
import { conditionIsRealTimeData } from '../../../../Model/ConditionDataModel';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ConditionDataFormColumnTitleHeight } from '../../ConstantsValues';
import resetIcon from '../../../../assets/img/resetIcon.png'
import resetHoverIcon from '../../../../assets/img/resetHoverIcon.png'
import conditionDataAddIcon from '../../../../assets/img/conditionDataAddIcon.png'
import conditionDataAddHoverIcon from '../../../../assets/img/conditionDataAddHoverIcon.png'
import realtimeIcon from '../../../../assets/img/realtimeIcon.png'
import realtimeOffIcon from '../../../../assets/img/realtimeOffIcon.png'

type ConditionParamsInputColumnComponentProps = PropsWithChildren<{
    title: string
    noDataText: string
    isDataExist: boolean
    dataAddAction: () => void
    initAction: () => void
    allSelectAction: () => void
    allSelected: boolean
    realtimeBtn?: boolean
    dataAddDelete?: boolean
    disableAllSelect?: boolean
    titleIcon?: string
    isTarget?: boolean
}>

const NoDataComponent = ({ txt, hover, isTime }: {
    txt: string
    hover: boolean
    isTime?: boolean
}) => {
    const [isHover, setIsHover] = useState(false)
    const isRealTime = useRecoilValue(conditionIsRealTimeData)

    return <NoDataContainer>
        <NoDataText>{txt}</NoDataText>
        <NoDataAddIcon src={(isHover || hover) ? conditionDataAddHoverIcon : conditionDataAddIcon}
            onMouseEnter={() => {
                if (!hover && isTime && isRealTime) return
                setIsHover(true)
            }} onMouseLeave={() => {
                if (!hover && isTime && isRealTime) return
                setIsHover(false)
            }} />
    </NoDataContainer>
}

const ConditionParamsInputColumnComponent = ({ title, isDataExist, dataAddAction, initAction, realtimeBtn, children, noDataText, dataAddDelete, allSelectAction, allSelected, disableAllSelect, titleIcon, isTarget }: ConditionParamsInputColumnComponentProps) => {
    const [isRealTime, setIsRealTime] = useRecoilState(conditionIsRealTimeData)
    const [clearHover, setClearHover] = useState(false)
    const [isHover, setIsHover] = useState(false)

    const resetIconByHover = clearHover ? resetHoverIcon : resetIcon
    
    return <>
        <TitleContainer>
            <TitleInnerContainer>
                {titleIcon && <TitleIconContainer isTarget={isTarget || false}>
                    <TitleIcon src={titleIcon}/>
                </TitleIconContainer>}
                <TitleText>
                {title}
                </TitleText>
            </TitleInnerContainer>
            <ButtonsContainer>
                {realtimeBtn && <OptionButton concept="icon" $isRealTime={isRealTime} onClick={() => {
                    setIsRealTime(!isRealTime)
                }} icon={isRealTime ? realtimeOffIcon : realtimeIcon} />}
                <OptionButton
                    concept="icon"
                    disabled={!isDataExist && !(realtimeBtn && isRealTime)}
                    onClick={initAction}
                    onMouseEnter={() => {
                        setClearHover(true)
                    }}
                    onMouseLeave={() => {
                        setClearHover(false)
                    }}
                    icon={resetIconByHover} />
            </ButtonsContainer>
        </TitleContainer>
        <DataContainer
            isDataExist={!isDataExist}
            isRealTime={realtimeBtn && isRealTime}
            onClick={(e) => {
                if (realtimeBtn && isRealTime) return
                if (!isDataExist) {
                    e.currentTarget.style.cursor = 'default'
                    dataAddAction()
                }
            }}
            onMouseOver={e => {
                if (realtimeBtn && isRealTime) return
                if (!isDataExist) {
                    e.currentTarget.style.cursor = 'pointer'
                    setIsHover(true)
                }
            }} onMouseLeave={e => {
                if (realtimeBtn && isRealTime) return
                if (!isDataExist) {
                    e.currentTarget.style.cursor = 'default'
                    setIsHover(false)
                }
            }}>
            {isDataExist ? <>
                {!dataAddDelete && <DataExistAndAddComponent onClick={() => {
                    if (!((realtimeBtn || false) && isRealTime)) dataAddAction()
                }} disabled={(realtimeBtn || false) && isRealTime}>
                    <NoDataComponent txt={noDataText} hover={false} isTime={realtimeBtn} />
                </DataExistAndAddComponent>}
                {!disableAllSelect && <AllSelectBtn onClick={allSelectAction} activate={allSelected} disabled={isRealTime && realtimeBtn}>
                    전체 선택 {allSelected && '해제'}
                </AllSelectBtn>}
                {children}
            </> : <NoDataComponent txt={noDataText} hover={isHover} isTime={realtimeBtn} />}
        </DataContainer>
    </>
}

export default ConditionParamsInputColumnComponent

const ButtonsContainer = styled.div`
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '8px' })}
`

const OptionButton = styled(Button) <{ $isRealTime?: boolean }>`
    height: 100%;
    border: none;
`

const DataContainer = styled.div<{ isDataExist: boolean, isRealTime?: boolean }>`
    height: calc(100% - 48px);
    width: 100%;
    padding: 12px 8px;
    ${globalStyles.flex({ justifyContent: 'flex-start', gap: '12px' })}
    background-color: ${SectionBackgroundColor};
    ${({ isRealTime }) => isRealTime && `
        background-color: rgba(128,128,128,.5);
    `}
`

const DataExistAndAddComponent = styled.div<{ disabled: boolean }>`
    border-width: 2px;
    width: 100%;
    text-align: center;
    cursor: pointer;
    ${globalStyles.flex()}
    ${({ disabled }) => disabled && `&:hover {
        cursor: default;
    }`}
`

const TitleContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
    flex: 0 0 ${ConditionDataFormColumnTitleHeight}px;
    width: 100%;
`

const TitleInnerContainer = styled.div`
    ${globalStyles.flex({flexDirection:'row', justifyContent:'flex-start'})}
    flex: 1;
`

const TitleIconContainer = styled.div<{isTarget: boolean}>`
    flex: 0 0 ${({isTarget}) => isTarget ? 40 : 20}px;
    margin-right: 6px;
    height: 100%;
    ${globalStyles.flex()}
`

const TitleIcon = styled.img`
    width: 100%;
    height: 100%;
`

const TitleText = styled.div`
    font-size: 1.3rem;
    color: white;
`


const NoDataText = styled.div`
    font-size: 1.5rem;
    margin-bottom: 12px;
    color: white;
`

const NoDataAddIcon = styled.img`
    height: 30%;
    max-height: 120px;
    pointer-events: auto;
`

const NoDataContainer = styled.div`
    ${globalStyles.flex()}
    width: 100%;
    height: 100%;
`

const AllSelectBtn = styled(Button)`
    width: 100%;
    font-size: .9rem;
    padding: 8px 0;
`