import styled from "styled-components"
import { globalStyles } from "../../../../../styles/global-styled"
import { ImageUploadImagesType } from "."
import CaptureImageContainer from "../../Constants/CaptureImageContainer"
import Button from "../../../../Constants/Button"
import { useRecoilState } from "recoil"
import { conditionTargetDatasImageTemp } from "../../../../../Model/ConditionDataModel"
import { CaptureResultListItemType } from "../../../../../Constants/GlobalTypes"
import maskOffIcon from "../../../../../assets/img/maskOffIcon.png"
import maskOnIcon from "../../../../../assets/img/maskOnIcon.png"
import { ConditionDataTargetSelectMethodTypeKeys, ConditionDataTargetSelectMethodTypes } from "../../Constants/Params"
import ImageView from "../../Constants/ImageView"

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
        </DetailTitle>
        <CaptureResultListItemsContainer>
            {
                targetList.map(_ => <CaptureResultListItemBox key={_.id} selected={_.selected!}>
                    <CaptureResultListItemImageContainer>
                        <CaptureResultListItemImage src={_.src} isFace={_.type === 'Face'} />
                    </CaptureResultListItemImageContainer>
                    <CaptureResultListItemFaceSelectContainer>
                        {_.type === 'Face' && <MaskSelectIcon src={maskOffIcon} height="90%"/>}
                        <CaptureResultListItemSelectButton activate={_.selected!} selected={_.selected!} isMask={_.type === 'Face'} onClick={() => {
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
    flex: 0 0 200px;
    height: 200px;
    ${globalStyles.flex()}
`

const CaptureResultListItemImageContainer = styled.div`
    height: calc(100% - 40px);
    border: 1px solid white;
    width: 100%;
    ${globalStyles.flex()}
`

const CaptureResultListItemImage = styled(ImageView)<{ isFace: boolean }>`
    width: 100%;
    height: 100%;
`

const MaskSelectIcon = styled.img`
    cursor: pointer;
`

const CaptureResultListItemFaceSelectContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent:'space-between' })}
    width: 100%;
    height: 40px;
`

const CaptureResultListItemSelectButton = styled(Button)<{selected: boolean, isMask: boolean}>`
    ${({isMask}) => `flex: 0 0 ${isMask ? 75 : 100}%;`}
    height: 100%;
    border-radius: 12px;
`