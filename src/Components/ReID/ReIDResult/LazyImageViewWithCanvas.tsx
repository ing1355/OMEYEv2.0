import React, { useEffect, useRef, useState } from 'react';
import NoImage from '../../../assets/img/logo.png';
import ImageView from '../Condition/Constants/ImageView';

type ILazyImage = {
    src: string;
    className?: string;
    onLoad?: React.ReactEventHandler<HTMLImageElement>
}

const LazyImageViewWithCanvas: React.FC<ILazyImage> = ({ src, className }): JSX.Element => {
    // state
    const [isLoading, setIsLoading] = useState<boolean>(true); // 실제 화면에 보여지고 있는지 여부를 확인

    // ref
    const imgRef = useRef<HTMLImageElement>(null); // 이미지 태그 요소
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const observer = useRef<IntersectionObserver>(); // IntersectionObserver 변수

    // useEffect
    useEffect(() => {
        observer.current = new IntersectionObserver(intersectionOberserver); // 인스턴스 생성
        imgRef.current && observer.current.observe(imgRef.current); // 이미지 태그 관찰 시작
    }, [])

    // IntersectionObserver 설정
    const intersectionOberserver = (entries: IntersectionObserverEntry[], io: IntersectionObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { // 관찰되고 있는 entry가 보여지게 된 다면
                io.unobserve(entry.target); // 관찰 종료
                setIsLoading(false); // 로딩 체크
            }
        })
    }
    
    return (
        // 화면에 보여지기 전이라면 NoImage, 화면에 보여지고 있다면 src에 해당하는 이미지
        <>
            {
                isLoading ? <img ref={imgRef} src={NoImage} className={className} /> : <ImageView key={src} ref={imgRef} src={src} className={className}/>
            }
            <canvas ref={canvasRef} style={{
                display: 'none'
            }} />
        </>
    )
}

export default LazyImageViewWithCanvas