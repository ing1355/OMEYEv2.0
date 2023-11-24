import styled from 'styled-components'
import emptyIcon from '../../../../assets/img/emptyPlateObjectIcon.png'
import Modal from '../../../Layout/Modal'
import Input from '../../../Constants/Input'
import { useEffect, useRef, useState } from 'react'
import { globalStyles } from '../../../../styles/global-styled'
import { conditionTargetDatas } from '../../../../Model/ConditionDataModel'
import { useRecoilState } from 'recoil'
import { GetObjectIdByImage } from '../../../../Functions/NetworkFunctions'
import { ObjectTypes } from '../../ConstantsValues'
import { ReIDObjectTypeKeys } from '../../../../Constants/GlobalTypes'
import { ConditionDataTargetSelectMethodTypeKeys, ConditionDataTargetSelectMethodTypes } from '../Constants/Params'
import useConditionRoutes from '../Hooks/useConditionRoutes'
import { ReIDConditionFormRoute } from '../Constants/RouteInfo'

const PlateModal = ({ visible, close }: {
    visible: boolean
    close: () => void
}) => {
    const [plateInput, setPlateInput] = useState('')
    const [globalData, setGlobalData] = useRecoilState(conditionTargetDatas)
    const { routeJump } = useConditionRoutes()
    const imgRef = useRef<HTMLImageElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const addCompleteCallback = async () => {
        const vrpObjectId = await GetObjectIdByImage([{
            image: imgRef.current!.src,
            type: ReIDObjectTypeKeys[ObjectTypes['PLATE']],
            ocr: plateInput
        }])
        if (vrpObjectId) {
            console.debug('input : ', plateInput)
            setGlobalData(globalData.concat({
                src: imgRef.current!.src,
                ocr: plateInput,
                method: ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['PLATE']],
                type: ReIDObjectTypeKeys[ObjectTypes['PLATE']],
                selected: false,
                objectId: vrpObjectId[0]
            }))
            routeJump(ReIDConditionFormRoute.key)
        }
    }

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
                ctx!.textAlign = "start";
                ctx!.font = "120px Sans-serif";
                ctx!.fillStyle = "rgba(0,0,0,1)";
                // ctx!.fillText((ocr||plateInput).replace(/[\*]/gi, 'X').padEnd(4, " "), 330, 270);
                ctx!.fillText(plateInput.replace(/[\*]/gi, 'X').padEnd(4, " "), 215, 275);
                // ctx!.fillText((ocr||plateInput).replace(/[\*]/gi, 'X').padEnd(4, " "), 260, 270);
                imgRef.current!.src = canvas.toDataURL();
                img.src = ""
            };
        } else {
            if (imgRef.current) imgRef.current.src = emptyIcon
        }
    }, [plateInput])

    useEffect(() => {
        if (visible) {
            if (inputRef.current) inputRef.current.focus()
        } else {
            setPlateInput('')
        }
    }, [visible])

    return <Modal title="번호판 추가" visible={visible} close={close} complete={addCompleteCallback} completeText='추가'>
        <Container>
            <PlateIconContainer>
                <PlateIcon src={emptyIcon} ref={imgRef} />
            </PlateIconContainer>
            <InputPlateNumber onlyNumber canEmpty enableAsterisk maxLength={4} value={plateInput} onChange={(str) => {
                setPlateInput(str)
            }} autoFocus onEnter={addCompleteCallback} inputRef={inputRef} />
        </Container>
    </Modal>
}

export default PlateModal

const Container = styled.div`
    padding: 4px 48px;
`

const PlateIconContainer = styled.div`
    width: 100%;
    height: 160px;
    ${globalStyles.flex()}
`

const PlateIcon = styled.img`
    width: 100%;
    height: 100%;
`

const InputPlateNumber = styled(Input)`
    height: 32px;
    width: 100%;
    color: white;
`