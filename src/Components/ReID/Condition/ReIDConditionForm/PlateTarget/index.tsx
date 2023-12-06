import styled from "styled-components"
import { ContentsActivateColor, ContentsBorderColor, globalStyles } from "../../../../../styles/global-styled"
import { CaptureResultListItemType, ReIDObjectTypeKeys, setStateType } from "../../../../../Constants/GlobalTypes"
import { PlateStatusType } from "../TargetSelectColumn"
import Button from "../../../../Constants/Button"
import Input from "../../../../Constants/Input"
import emptyIcon from '../../../../../assets/img/emptyPlateObjectIcon.png'
import checkIcon from '../../../../../assets/img/checkIcon.png'
import { useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { conditionTargetDatas } from "../../../../../Model/ConditionDataModel"
import { GetObjectIdByImage } from "../../../../../Functions/NetworkFunctions"
import { ObjectTypes } from "../../../ConstantsValues"
import useMessage from "../../../../../Hooks/useMessage"
import IconBtn from "../../../../Constants/IconBtn"
import { ConditionDataTargetSelectMethodTypeKeys, ConditionDataTargetSelectMethodTypes } from "../../Constants/Params"

type PlateTargetProps = {
    data?: CaptureResultListItemType
    status: PlateStatusType
    setStatus: setStateType<PlateStatusType>
}

const PlateTarget = ({ data, status, setStatus }: PlateTargetProps) => {
    const { src, ocr, selected } = data || {}
    const [plateInput, setPlateInput] = useState('')
    const [globalData, setGlobalData] = useRecoilState(conditionTargetDatas)
    const imgRef = useRef<HTMLImageElement>(null)
    const message = useMessage()

    useEffect(() => {
        if (status !== 'none') {
            const img = new Image();
            img.src = emptyIcon;
            img.onload = (e) => {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx!.drawImage(img, 0, 0);
                ctx!.textAlign = "start";
                ctx!.font = "120px Sans-serif";
                ctx!.fillStyle = "rgba(0,0,0,1)";
                // ctx!.fillText((ocr||plateInput).replace(/[\*]/gi, 'X').padEnd(4, " "), 330, 270);
                ctx!.fillText((ocr || plateInput).replace(/[\*]/gi, 'X').padEnd(4, " "), 215, 275);
                // ctx!.fillText((ocr||plateInput).replace(/[\*]/gi, 'X').padEnd(4, " "), 260, 270);
                imgRef.current!.src = canvas.toDataURL();
                img.src = ""
            };
        }
    }, [ocr, plateInput])

    const addCompleteCallback = async () => {
        if (plateInput.length !== 4) {
            return message.error({ title: "입력값 에러", msg: "번호판 4자리를 입력해주세요." })
        }
        if (plateInput.match(/[\*]{3}/g)) {
            return message.error({ title: "입력값 에러", msg: "번호판을 최소 2자리는 입력해주세요." })
        }
        if (globalData.find(_ => _.ocr === plateInput)) {
            return message.error({ title: "입력값 에러", msg: "동일한 번호판 대상이 이미 존재합니다." })
        }
        if (status === 'add') {
            const vrpObjectId = (await GetObjectIdByImage([{
                src: imgRef.current!.src,
                type: ReIDObjectTypeKeys[ObjectTypes['PLATE']],
                ocr: plateInput,
                method: ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['REIDRESULT']]
            }]))[0]
            setGlobalData(globalData.concat({
                src: imgRef.current!.src,
                ocr: plateInput,
                type: ReIDObjectTypeKeys[ObjectTypes['PLATE']],
                selected: false,
                objectId: vrpObjectId
            }))
        }
        setStatus('none')
    }

    return <Container selected={selected || false} onClick={() => {
        setGlobalData(globalData.map(_ => _.ocr === ocr ? ({
            ..._,
            selected: !_.selected
        }) : _))
    }}>
            {status === "none" && <IconBtn type="delete" onClick={(e) => {
                e.stopPropagation()
                setGlobalData(globalData.filter(_ => _.ocr !== _.ocr))
            }} style={{
                position: 'absolute',
                top: 4,
                right: 6
            }}/>}
        <CheckIcon>
            {selected && <img src={checkIcon}/>}
        </CheckIcon>
        <PlateIcon src={src || emptyIcon} ref={imgRef} />
        <PlateDescription>
            <PlateDescriptionInputContainer>
                {ocr ? <>
                    번호판 : {ocr}
                </> : <>
                    번호판을 입력해주세요
                    <PlateDescriptionInput onlyNumber enableAsterisk maxLength={4} value={plateInput} onChange={(str) => {
                        setPlateInput(str)
                    }} autoFocus onEnter={addCompleteCallback}/>
                </>}
            </PlateDescriptionInputContainer>
            {!data ? <PlateDescriptionBtnsContainer>
                <PlateDescriptionBtn hover onClick={addCompleteCallback}>
                    대상 추가
                </PlateDescriptionBtn>
                <PlateDescriptionBtn hover onClick={() => {
                    setStatus('none')
                }}>
                    취소
                </PlateDescriptionBtn>
            </PlateDescriptionBtnsContainer> : <PlateDescriptionBtnsContainer>
                <PlateDescriptionBtn hover onClick={() => {
                    setGlobalData(globalData.map(_ => _.ocr === ocr ? ({
                        ..._,
                        selected: !_.selected
                    }) : _))
                }}>
                    {selected ? '해제' : '선택'}
                </PlateDescriptionBtn>
                {/* <PlateDescriptionBtn onClick={() => {
                    setStatus('update')
                }}>
                    수정
                </PlateDescriptionBtn> */}
                {/* <PlateDescriptionBtn hover onClick={() => {
                    setGlobalData(globalData.filter(_ => _.id !== id))
                }}>
                    삭제
                </PlateDescriptionBtn> */}
            </PlateDescriptionBtnsContainer>}
        </PlateDescription>
    </Container>
}

export default PlateTarget

const Container = styled.div<{ selected: boolean }>`
    height: 120px;
    width: 100%;
    border-radius: 8px;
    border: 1px solid ${({ selected }) => selected ? ContentsActivateColor : ContentsBorderColor};
    &:hover {
        border: 1px solid ${ContentsActivateColor};
    }
    cursor: pointer;
    position: relative;
    ${globalStyles.flex({ flexDirection: 'row' })}
`

const PlateIcon = styled.img`
    max-width: 40%;
    height: 100%;
    ${globalStyles.flex()}
    flex: 0 0 40%;
`

const PlateDescription = styled.div`
    height: 100%;
    flex: 0 0 60%;
    border-left: 1px solid ${ContentsBorderColor};
`

const PlateDescriptionInputContainer = styled.div`
    ${globalStyles.flex({ gap: '8px' })}
    height: calc(100% - 32px);
`

const PlateDescriptionInput = styled(Input)`
    width: 80px;
    height: 28px;
`

const PlateDescriptionBtnsContainer = styled.div`
    height: 32px;
    ${globalStyles.flex({ flexDirection: 'row' })}
`

const PlateDescriptionBtn = styled(Button)`
    height: 100%;
    flex: 1;
`

const CheckIcon = styled.div`
    position: absolute;
    left: 11px;
    top: 5px;
    width: 20px;
    height: 20px;
    border: 1px solid ${ContentsActivateColor};
    border-radius: 50%;
    padding: 4px;
    & > img {
        width: 100%;
        height: 100%;
    }
`