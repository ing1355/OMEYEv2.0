import styled from "styled-components"
import DataSelectModal from "./DataSelectModal"
import { useEffect, useState } from "react"
import { CameraDataType } from "../../../../Constants/GlobalTypes"
import { globalStyles } from "../../../../styles/global-styled"
import useMessage from "../../../../Hooks/useMessage"
import TreeAndMapComponent from "../../../Constants/TreeAndMapComponent"

type AreaSelectProps = {
    defaultSelected?: CameraDataType['cameraId'][]
    visible: boolean
    complete: (data: CameraDataType['cameraId'][]) => void
    close: () => void
    title: string
    singleSelect?: boolean
}

const AreaSelect = ({ defaultSelected, visible, complete, close, title, singleSelect }: AreaSelectProps) => {
    const [selectedCCTVs, setSelectedCCTVs] = useState<CameraDataType['cameraId'][]>([])
    const [needInit, setNeedInit] = useState(false)
    const message = useMessage()

    useEffect(() => {
        if (visible && defaultSelected && defaultSelected.length > 0) {
            setSelectedCCTVs(defaultSelected)
        } else if (visible) {
            setSelectedCCTVs([])
            setNeedInit(false)
        } else {
            setNeedInit(true)
        }
    }, [visible])

    return <ModalWrapper visible={visible} title={<>
        {title}<SelectedText>({selectedCCTVs.length})</SelectedText>
    </>} close={close} complete={() => {
        if (selectedCCTVs.length === 0) return message.preset('WRONG_PARAMETER', "CCTV를 선택해주세요.");
        complete(selectedCCTVs)
        close()
    }}>
        <Container>
            <TreeAndMapComponent selectedCCTVs={selectedCCTVs} setSelectedCCTVs={setSelectedCCTVs} singleSelect={singleSelect} visible={visible}/>
        </Container>
    </ModalWrapper>
}

export default AreaSelect

const ModalWrapper = styled(DataSelectModal)`
    ${globalStyles.flex({ flexDirection: 'row', gap: '24px' })}
`

const Container = styled.div`
    width: 100%;
    height: 100%;
`

const SelectedText = styled.div`
    font-size: 1.3rem;
    display: inline-block;
`