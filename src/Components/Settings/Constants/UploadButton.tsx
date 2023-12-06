import styled from "styled-components";
import Form from "../../Constants/Form";
import Button from "../../Constants/Button";
import { ButtonDefaultHoverColor, globalStyles } from "../../../styles/global-styled";
import { PropsWithChildren, useRef, useState } from "react";
import useMessage from "../../../Hooks/useMessage";

type UploadButtonProps = PropsWithChildren & {
    onSubmit: (files: FileList) => void
    accept?: React.InputHTMLAttributes<HTMLInputElement>['accept']
    fileChangeCallback?: (file: React.ChangeEvent<HTMLInputElement>['target']['files']) => void
}

const UploadButton = ({ onSubmit, accept, fileChangeCallback, children }: UploadButtonProps) => {
    const [fileName, setFileName] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const message = useMessage()
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        if (fileInput.files && fileInput.files[0]) {
            const name = fileInput.files[0].name;
            setFileName(name);
        }
        if (fileChangeCallback) fileChangeCallback(fileInput.files)
    };

    return <Form
        id='fileUpload'
        onSubmit={() => {
            if(inputRef.current) {
                if(!inputRef.current.files) return message.error({title: "파일 업로드 에러", msg:"파일이 존재하지 않습니다.\n다시 업로드해주세요."})
                onSubmit(inputRef.current?.files)
                setFileName('')
            }
        }}
    >
        <FormContainer>
            <div>
                <FormLabel>
                    파일 선택
                    <input
                        type='file'
                        ref={inputRef}
                        accept={accept || '.zip'}
                        hidden
                        onChange={handleFileChange}
                    />
                </FormLabel>
            </div>
            <div>
                {fileName}
            </div>
            <div>
                <OMEYEButton
                    hover
                    type='submit'
                >
                    업로드
                </OMEYEButton>
            </div>
        </FormContainer>
    </Form>
}

export default UploadButton

const OMEYEButton = styled(Button)`
  height: 30px;
`

const FormContainer = styled.div`
    width: 100%;
    ${globalStyles.flex({ flexDirection:'row', justifyContent: 'flex-start', gap:'15px', flexWrap: 'wrap' })}
    & > div {
        line-height: 30px;
    }
    & label {
        cursor: pointer;
        &:hover {
            background-color: ${ButtonDefaultHoverColor};
        }
    }
`

const FormLabel = styled.label`
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
`