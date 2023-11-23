import styled from "styled-components"
import { globalStyles } from "../../../../../styles/global-styled"
import { useEffect, useState } from "react"
import ImageDetailContainer from "./ImageDetailContainer"
import ImageListContainer from "./ImageListContainer"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { conditionSelectedType, conditionTargetDatasImageTemp } from "../../../../../Model/ConditionDataModel"

export type ImageUploadImagesType = {
    name: string
    size: number
    type: string
    src: string
    width: number
    height: number
}

const ImageUpload = () => {
    const [images, setImages] = useState<ImageUploadImagesType[]>([])
    const [selected, setSelected] = useState<number | null>(null)
    const currentObjectType = useRecoilValue(conditionSelectedType)
    const setImageDatasTemp = useSetRecoilState(conditionTargetDatasImageTemp)
    
    useEffect(() => {
        setImageDatasTemp([])
    },[selected])

    useEffect(() => {
        setSelected(null)
    },[currentObjectType])

    return <Container noData={images.length === 0}>
        <ImageListContainer images={images} setImages={setImages} selected={selected} setSelected={setSelected} />
        {
            images.length !== 0 && (
                (selected !== null && images[selected]) ? <ImageDetailContainer images={images} selected={selected} /> : <NoSelectedDetailContainer>
                    좌측에서 이미지를 선택해주세요.
                </NoSelectedDetailContainer>
            )
        }
    </Container>
}

export default ImageUpload

const Container = styled.div<{noData: boolean}>`
    height: 100%;
    ${globalStyles.flex({ flexDirection: 'row' })}
    ${({noData}) => ({
        justifyContent: noData ? 'center' : 'space-between'
    })}
`

const NoSelectedDetailContainer = styled.div`
    border: 1px solid black;
    height: 100%;
    flex: 0 0 40%;
    ${globalStyles.flex()}
    font-size: 2.5rem;
`