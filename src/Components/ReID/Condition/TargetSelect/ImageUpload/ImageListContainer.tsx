import { useRef, useState } from "react"
import { ImageUploadImagesType } from "."
import styled from "styled-components"
import { ContentsBorderColor, SectionBackgroundColor, globalStyles } from "../../../../../styles/global-styled"
import { multipleFileUploadFunction } from "../../../../../Functions/GlobalFunctions"
import { setStateType } from "../../../../../Constants/GlobalTypes"
import useMessage from "../../../../../Hooks/useMessage"

type ImageListContainerProps = {
    images: ImageUploadImagesType[]
    setImages: setStateType<ImageUploadImagesType[]>
    selected: number|null
    setSelected: setStateType<number|null>
}

const ImageListContainer = ({ images, setImages, selected, setSelected }: ImageListContainerProps) => {
    const [dragging, setDragging] = useState(false)
    const uploadRef = useRef<HTMLInputElement>(null)
    const message = useMessage()

    const fileUploadClick = () => {
        uploadRef.current?.click()
    }

    const setDragEventCallbacks = () => {
        return {
            dragged: dragging,
            onClick: fileUploadClick,
            onDragEnter: () => {
                setDragging(true)
            },
            onDragLeave: () => {
                setDragging(false)
            },
            onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
                e.stopPropagation()
                e.preventDefault()
            },
            onDrop: async (e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                if (e.nativeEvent.dataTransfer?.files.length ?? 0 > 0) {
                    const files = e.nativeEvent.dataTransfer?.files!;
                    const srcs = await multipleFileUploadFunction(files)
                    setImages(images.concat(srcs.map((_, ind: number) => {
                        return {
                            name: files[ind].name,
                            size: files[ind].size,
                            type: files[ind].type,
                            width: _.width,
                            height: _.height,
                            src: _.src
                        }
                    })))
                }
            }
        }
    }

    return <>
        <input
            type="file"
            ref={uploadRef}
            multiple={true}
            accept="image/*"
            hidden
            onInput={async (e: React.FormEvent<HTMLInputElement>) => {
                if (e.currentTarget.files?.length === 0) return;
                const files = e.currentTarget.files!
                const filteredFiles = Array.from({length:files.length}).map((_, ind) => files[ind]).filter(_ => _.type.startsWith('image/'))
                if (filteredFiles.length === 0) {
                    return message.error({title: "입력값 에러", msg: "이미지 파일이 존재하지 않습니다."})
                }
                e.currentTarget.value = ''
                const srcs = await multipleFileUploadFunction(filteredFiles)
                setImages(images.concat(srcs.map((_, ind: number) => {
                    return {
                        name: filteredFiles[ind].name,
                        size: filteredFiles[ind].size,
                        type: filteredFiles[ind].type,
                        width: _.width,
                        height: _.height,
                        src: _.src
                    }
                })))
            }}
        />
        {images.length === 0 ? <NoDataUploadContainer {...setDragEventCallbacks()}>
            클릭 또는 이미지를<br />드래그 & 드랍하여 업로드해주세요.
            <AddDiv>
                +
            </AddDiv>
        </NoDataUploadContainer> : <ImagesContainer>
            <UploadedImagesContainer>
                <UploadedImagesFlexContainer>
                    {
                        images.map((_, ind) => <UploadedImageCard key={_.name} selected={ind === selected} onClick={() => {
                            setSelected(ind)
                        }}>
                            <UploadedImageDelete onClick={(e) => {
                                e.stopPropagation()
                                if (selected === ind) {
                                    setSelected(null)
                                }
                                setImages(images.filter((__, _ind) => ind !== _ind))
                            }}>
                                x
                            </UploadedImageDelete>
                            <UploadedImage src={_.src} />
                        </UploadedImageCard>)
                    }
                    <AddUploadImageContainer {...setDragEventCallbacks()}>
                        클릭 또는 이미지를<br />드래그 & 드랍하여 업로드해주세요.
                        <AddDiv style={{
                            marginTop: '4px',
                            fontSize: '3rem'
                        }}>
                            +
                        </AddDiv>
                    </AddUploadImageContainer>
                </UploadedImagesFlexContainer>
            </UploadedImagesContainer>
        </ImagesContainer>}
    </>
}

export default ImageListContainer

const draggedStyle = (dragged: boolean) => dragged ? `
    border: none;
    background-color: ${SectionBackgroundColor};
` : `
`

const NoDataUploadContainer = styled.div<{ dragged: boolean }>`
    flex: 0 0 60%;
    height: 80%;
    font-size: 2.5rem;
    line-height: 4rem;
    text-align: center;
    cursor: pointer;
    border: 2px dashed ${ContentsBorderColor};
    &:hover {
        border: none;
        background-color: ${SectionBackgroundColor};
    }
    ${globalStyles.flex()}
    ${({ dragged }) => draggedStyle(dragged)}
`

const AddDiv = styled.div`
    font-size: 6rem;
    margin-top: 32px;
    pointer-events: none;
`

const ImagesContainer = styled.div`
    height: 100%;
    flex: 0 0 50%;
    background-color: ${SectionBackgroundColor};
    border-radius: 10px;
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'space-between' })}
`

const UploadedImagesContainer = styled.div`
    border: 1px solid black;
    height: 100%;
    flex: 0 0 100%;
    padding: 24px 16px;
    overflow: auto;
`

const UploadedImagesFlexContainer = styled.div`
    ${globalStyles.flex({ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', alignItems: 'flex-start' })}
    gap: 12px;
`

const AddUploadImageContainer = styled.div<{ dragged: boolean }>`
    cursor: pointer;
    text-align: center;
    flex: 0 0 30%;
    height: 250px;
    position: relative;
    border: 2px dashed ${ContentsBorderColor};
    &:hover {
        background-color: ${ContentsBorderColor};
    }
    font-size: 1.1rem;
    ${({ dragged }) => draggedStyle(dragged)}
    ${globalStyles.flex()}
`

const UploadedImageCard = styled.div<{ selected: boolean }>`
    cursor: pointer;
    flex: 0 0 30%;
    height: 250px;
    position: relative;
    ${globalStyles.flex()}
`

const UploadedImageDelete = styled.div`
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 2.5rem;
    cursor: pointer;
    width: 36px;
    height: 36px;
    ${globalStyles.flex()}
`

const UploadedImage = styled.img`
    width: 100%;
    height: 100%;
`