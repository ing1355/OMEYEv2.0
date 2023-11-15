import styled from "styled-components"
import { globalStyles } from "../../../../../styles/global-styled"
import { ImageUploadImagesType } from "."
import CaptureImageContainer from "../../Constants/CaptureImageContainer"
import Button from "../../../../Constants/Button"
import { useRecoilState } from "recoil"
import { conditionTargetDatasImageTemp } from "../../../../../Model/ConditionDataModel"
import { CaptureResultListItemType, ReIDObjectTypeKeys } from "../../../../../Constants/GlobalTypes"
import maskIcon from "../../../../../assets/img/maskIcon.png"
import { ConditionDataTargetSelectMethodTypeKeys, ConditionDataTargetSelectMethodTypes } from "../../Constants/Params"
import ImageView from "../../Constants/ImageView"
import { ObjectTypes } from "../../../ConstantsValues"
import ResetIcon from '../../../../../assets/img/resetIcon.png'

type ImageDetailContainerProps = {
    images: ImageUploadImagesType[]
    selected: number
}

const ImageDetailContainer = ({ images, selected }: ImageDetailContainerProps) => {
    const [targetList, setTargetList] = useRecoilState(conditionTargetDatasImageTemp)

    const captureCallback = (resultList: CaptureResultListItemType[]) => {
        setTargetList(targetList.concat(resultList.map(_ => ({
            ..._,
            selected: false,
            method: ConditionDataTargetSelectMethodTypeKeys[ConditionDataTargetSelectMethodTypes['IMAGEUPLOAD']]
        }))))
    }

    return <SelectedImageDetailContainer>
        <DetailTitle>
            이미지 상세 정보
        </DetailTitle>
        <DetailInfoRow>
            <DetailInfoCol>
                파일명
            </DetailInfoCol>
            <DetailInfoCol>
                {images[selected].name}
            </DetailInfoCol>
        </DetailInfoRow>
        <DetailInfoRow>
            <DetailInfoCol>
                이미지 크기
            </DetailInfoCol>
            <DetailInfoCol>
                {images[selected].size}
            </DetailInfoCol>
        </DetailInfoRow>
        <DetailInfoRow>
            <DetailInfoCol>
                이미지 해상도
            </DetailInfoCol>
            <DetailInfoCol>
                {images[selected].width} x {images[selected].height}
            </DetailInfoCol>
        </DetailInfoRow>
        <DetailInfoRow>
            <DetailInfoCol>
                이미지 타입
            </DetailInfoCol>
            <DetailInfoCol>
                {images[selected].type}
            </DetailInfoCol>
        </DetailInfoRow>
        <CaptureImageContainer src={images[selected].src} captureCallback={captureCallback} />
        <DetailTitle>
            대상 조회 결과
            <ResetBtn disabled={targetList.length === 0} onClick={() => {
                setTargetList([])
            }}>
                <img src={ResetIcon} width="100%" height="100%" />
            </ResetBtn>
        </DetailTitle>
        <CaptureResultListItemsContainer>
            {
                targetList.map(_ => <CaptureResultListItemBox key={_.id} selected={_.selected!}>
                    <CaptureResultListItemImageContainer>
                        <CaptureResultListItemImage src={_.src} isFace={_.type === ReIDObjectTypeKeys[ObjectTypes['FACE']]} />
                    </CaptureResultListItemImageContainer>
                    <CaptureResultListItemFaceSelectContainer>
                        {_.type === ReIDObjectTypeKeys[ObjectTypes['FACE']] && <MaskSelect hoverBorder activate={_.mask || false} onClick={() => {
                                setTargetList(targetList.map(__ => __.id === _.id ? ({
                                    ...__,
                                    mask: !__.mask
                                }) : __))
                            }}>
                                <img src={maskIcon} style={{
                                    width: '100%',
                                    height: '100%'
                                }}/>
                            </MaskSelect>}
                        <CaptureResultListItemSelectButton hover activate={_.selected!} selected={_.selected!} isMask={_.type === ReIDObjectTypeKeys[ObjectTypes['FACE']]} onClick={() => {
                            setTargetList(targetList.map(__ => __.id === _.id ? {
                                ...__,
                                selected: !__.selected
                            } : __))
                        }}>
                            {_.selected ? '지정 해제' : '대상 지정'}
                        </CaptureResultListItemSelectButton>
                    </CaptureResultListItemFaceSelectContainer>

                </CaptureResultListItemBox>)
            }
        </CaptureResultListItemsContainer>
    </SelectedImageDetailContainer>
}

export default ImageDetailContainer

const SelectedImageDetailContainer = styled.div`
    height: 100%;
    flex: 0 0 50%;
    padding: 24px 16px;
    overflow: auto;
`

const DetailTitle = styled.div`
    font-size: 1.8rem;
    margin-bottom: 16px;
`

const DetailInfoRow = styled.div`
    ${globalStyles.flex({ flexDirection: 'row' })}
    line-height: 32px;
    overflow: hidden;
`

const DetailInfoCol = styled.div`
    font-size: 1.1rem;
    &:first-child {
        flex: 0 0 30%;
    }
    &:last-child {
        flex: 0 0 70%;
        min-width: 0;
    }
`

const CaptureResultListItemsContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', gap: '12px', flexWrap: 'wrap' })}
`

const CaptureResultListItemBox = styled.div<{ selected: boolean }>`
    height: 200px;
    width: 200px;
    ${globalStyles.flex({gap: '6px'})}
`

const CaptureResultListItemImageContainer = styled.div`
    height: calc(100% - 40px);
    border: 1px solid white;
    width: 100%;
    ${globalStyles.flex()}
`

const CaptureResultListItemImage = styled(ImageView) <{ isFace: boolean }>`
    width: 100%;
    height: 100%;
`

const MaskSelectIcon = styled.img`
    cursor: pointer;
`

const CaptureResultListItemFaceSelectContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between', gap: '6px' })}
    width: 100%;
    height: 40px;
`

const CaptureResultListItemSelectButton = styled(Button) <{ selected: boolean, isMask: boolean }>`
    ${({ isMask }) => `flex: 0 0 ${isMask ? 75 : 100}%;`}
    height: 100%;
    border-radius: 6px;
`

const ResetBtn = styled(Button)`
    height: 30px;
    width: 30px;
    padding: 4px;
    margin-left: 12px;
`

const MaskSelect = styled(Button)`
    height: 100%;
    width: 120px;
    padding: 4px;
    ${globalStyles.flex()}
`