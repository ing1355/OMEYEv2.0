import styled from "styled-components"
import DataSelectModal from "./DataSelectModal"
import { useEffect, useState } from "react"
import { CameraDataType } from "../../../../Constants/GlobalTypes"
import { globalStyles } from "../../../../styles/global-styled"
import useMessage from "../../../../Hooks/useMessage"
import TreeAndMapComponent from "../../../Constants/TreeAndMapComponent"
import Modal from "../../../Layout/Modal"
import { useRecoilValue } from "recoil"
import { GetAllSiteCameras } from "../../../../Model/SiteDataModel"

type AreaSelectProps = {
    defaultSelected?: CameraDataType['cameraId'][]
    visible: boolean
    complete: (data: CameraDataType['cameraId'][]) => void
    close: () => void
    title: string
    singleSelect?: boolean
    lowBlur?: boolean
}

const AreaSelect = ({ defaultSelected, visible, complete, close, title, singleSelect, lowBlur=false }: AreaSelectProps) => {
    const [selectedCCTVs, setSelectedCCTVs] = useState<CameraDataType['cameraId'][]>([])
    const [confirmVisible, setConfirmVisible] = useState(false)
    const allCameras = useRecoilValue(GetAllSiteCameras)
    const message = useMessage()
    
    useEffect(() => {
        if (visible && defaultSelected && defaultSelected.length > 0) {
            setSelectedCCTVs(defaultSelected)
        } else if (visible) {
            setSelectedCCTVs([])
        }
    }, [visible])

    const completeCallback = () => {
        if (selectedCCTVs.length === 0) {
            message.preset('WRONG_PARAMETER', "CCTV를 선택해주세요.");
            return true
        } else {
            complete(selectedCCTVs)
            return false
        }        
    }
    
    return <>
    <ModalWrapper visible={visible} title={<>
        {title}<SelectedText>({selectedCCTVs.length}/{allCameras.length})</SelectedText>
    </>} close={() => {
        if(JSON.stringify(defaultSelected) !== JSON.stringify(selectedCCTVs)) setConfirmVisible(true)
        else close()
    }} complete={() => {
        if(!completeCallback()) close()
    }} lowBlur={lowBlur}>
        <Container>
            <TreeAndMapComponent selectedCCTVs={selectedCCTVs} setSelectedCCTVs={setSelectedCCTVs} singleSelect={singleSelect} visible={visible} />
        </Container>
    </ModalWrapper>
    <Modal title="정보 변경" completeText="저장" visible={confirmVisible} close={() => {
        setConfirmVisible(false)
        close()
    }} complete={() => {
        if(completeCallback()) {
            setConfirmVisible(false)
            return true
        } else {
            return false
        }
    }}>
        현재 변경값을 적용하시겠습니까?
    </Modal>
    </>
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