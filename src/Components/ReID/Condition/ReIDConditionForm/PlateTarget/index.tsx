import styled from "styled-components"
import { globalStyles } from "../../../../../styles/global-styled"
import { CaptureResultListItemType, setStateType } from "../../../../../Constants/GlobalTypes"
import { PlateStatusType } from "../TargetSelectColumn"
import Button from "../../../../Constants/Button"
import Input from "../../../../Constants/Input"
import emptyIcon from '../../../../../assets/img/emptyPlateObjectIcon.png'
import { useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { conditionTargetDatas } from "../../../../../Model/ConditionDataModel"
import { GetObjectIdByImage, SubmitCarVrp } from "../../../../../Functions/NetworkFunctions"

type PlateTargetProps = {
    data?: CaptureResultListItemType
    status: PlateStatusType
    setStatus: setStateType<PlateStatusType>
}

let plateId = 1

const PlateTarget = ({ data, status, setStatus }: PlateTargetProps) => {
    const { src, vrp, id, selected } = data || {}
    const [plateInput, setPlateInput] = useState('')
    const imgRef = useRef<HTMLImageElement>(null)
    const [globalData, setGlobalData] = useRecoilState(conditionTargetDatas)

    useEffect(() => {
        if (plateInput) {
            const img = new Image();
            img.src = emptyIcon;
            img.onload = (e) => {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx!.drawImage(img, 0, 0);
                ctx!.textAlign = "center";
                ctx!.font = "120px Sans-serif";
                ctx!.fillStyle = "rgba(255,255,255,1)";
                ctx!.fillText(plateInput, 330, 270);
                imgRef.current!.src = canvas.toDataURL();
                img.src = ""
            };
        }
    }, [plateInput])

    const addCompleteCallback = async () => {
        if (plateInput.length !== 4) return;
        if (status === 'add') {
            const vrpObjectId = (await GetObjectIdByImage([{
                image: imgRef.current!.src,
                type: 'car_plate',
                vrp: plateInput
            }]))[0]
            setGlobalData(globalData.concat({
                id: plateId++,
                src: imgRef.current!.src,
                vrp: plateInput,
                type: 'car_plate',
                selected: false,
                objectId: vrpObjectId
            }))
        }
        setStatus('none')
    }

    return <Container>
        <PlateIcon src={src || emptyIcon} ref={imgRef} />
        <PlateDescription>
            <PlateDescriptionInputContainer>
                {vrp ? <>
                    번호판 : {vrp}
                </> : <>
                    번호판을 입력해주세요
                    <PlateDescriptionInput onlyNumber maxLength={4} value={plateInput} onChange={(str) => {
                        setPlateInput(str)
                    }} />
                </>}
            </PlateDescriptionInputContainer>
            {!data ? <PlateDescriptionBtnsContainer>
                <PlateDescriptionBtn onClick={addCompleteCallback}>
                    저장
                </PlateDescriptionBtn>
                {status === 'update' && <PlateDescriptionBtn onClick={() => {
                    setStatus('none')
                }}>
                    취소
                </PlateDescriptionBtn>}
            </PlateDescriptionBtnsContainer> : <PlateDescriptionBtnsContainer>
                <PlateDescriptionBtn onClick={() => {
                    setGlobalData(globalData.map(_ => _.id === id ? ({
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
                <PlateDescriptionBtn onClick={() => {
                    setGlobalData(globalData.filter(_ => _.id !== id))
                }}>
                    삭제
                </PlateDescriptionBtn>
            </PlateDescriptionBtnsContainer>}
        </PlateDescription>
    </Container>
}

export default PlateTarget

const Container = styled.div`
    height: 100px;
    width: 100%;
    border: 1px solid white;
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
    border-left: 1px solid white;
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