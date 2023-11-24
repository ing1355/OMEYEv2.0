import { CSSProperties, createGlobalStyle, keyframes, css } from 'styled-components'
import { HeaderHeight } from '../Constants/CSSValues';
import NanumGothicBold from '../assets/fonts/NanumFont/NanumGothicBold.otf'
import NanumGothic from '../assets/fonts/NanumFont/NanumGothic.otf'
import NanumGothicLight from '../assets/fonts/NanumFont/NanumGothicLight.otf'

export const GlobalBackgroundColor = '#0f0e11';
export const SectionBackgroundColor = '#201f25';
export const ButtonDisabledBackgroundColor = 'rgba(0,170,113,.5)';
export const ButtonBackgroundColor = '#302f35';
export const ButtonBorderColor = '#45454c';
export const ButtonActiveBackgroundColor = '#00aa71';
export const ButtonActivateHoverColor = '#1EC682';
export const ButtonDefaultHoverColor = '#1EC682';
export const ButtonInActiveBackgroundColor = '#467061';
export const TextActivateColor = '#14c9aa';
export const InputBackgroundColor = '#151619';
export const InputTextColor = 'rgba(255,255,255,.5)';
export const StopBackgroundColor = '#EF7070'
export const StopBorderColor = '#C62222'
export const ContentsBorderColor = ButtonBorderColor
export const ContentsActivateColor = ButtonActiveBackgroundColor
export const ContentsDisableColor = 'rgba(128,128,128,.5)'
export const loadingVideoDownloadColor = ContentsActivateColor
export const loadingAIAnalysisColor = ButtonActiveBackgroundColor
export const ScrollBarColor = "#4f4f56"
export const ModalBoxShadow = '0 0 20px #060607'

const fadeOut = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const zoomIn = keyframes`
  from {
    opacity: 0;
    width: 0;
    height: 0;
  }

  100% {
    opacity: 1;
    width: 600px;
    height: 800px;
  }
`

const slideToLeft = keyframes`
  0% {
    left: 100%;
  }

  100% {
    left: 0;
  }
`

export const globalStyles = {
  flex: (attr?: CSSProperties) => `
    display: ${attr?.display ?? "flex"};
    flex-direction: ${attr?.flexDirection ?? "column"};
    justify-content: ${attr?.justifyContent ?? "center"};
    align-items: ${attr?.alignItems ?? "center"};
    gap: ${attr?.gap ?? "0px"};
    flex-wrap: ${attr?.flexWrap ?? "nowrap"};
  `,
  fadeOut: (attr?: CSSProperties) => css`
    animation: ${fadeOut} ${attr?.animationDuration ?? '.5s'} ${attr?.animationTimingFunction ?? 'linear'} ${attr?.animationDelay ?? '0s'};
  `,
  zoomIn: (attr?: CSSProperties) => css`
    animation: ${zoomIn} ${attr?.animationDuration ?? '.25s'} ${attr?.animationTimingFunction ?? 'ease-out'} ${attr?.animationDelay ?? '0s'};
  `,
  slideToLeft: (attr?: CSSProperties) => css`
    animation: ${slideToLeft} ${attr?.animationDuration ?? '.25s'} ${attr?.animationTimingFunction ?? 'ease-out'} ${attr?.animationDelay ?? '0s'};
  `,
  displayNoneByState: (state: boolean) => state && `
    display: none;
  `,
  contentsBorder: `
    border: 1.5px solid ${ContentsBorderColor};
    border-radius: 8px;
  `,
  conditionParamsColumnContainer: `
    flex: 1;
    height: 100%;
    display:flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  `,
  conditionDataItemBox: `
    border-radius: 8px;
    padding: 2px 6px 8px;
  `,
  conditionDataItemBoxSelectBtn: `
    font-size: .8rem;
  `
}

const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: 'NanumGothicBold';
  src: local('NanumGothicBold'), local('NanumGothicBold');
  font-style: normal;
  src: url(${NanumGothicBold}) format('opentype');
}
@font-face {
  font-family: 'NanumGothic';
  src: local('NanumGothic'), local('NanumGothic');
  font-style: normal;
  src: url(${NanumGothic}) format('opentype');
}
@font-face {
  font-family: 'NanumGothicLight';
  src: local('NanumGothicLight'), local('NanumGothicLight');
  font-style: normal;
  src: url(${NanumGothicLight}) format('opentype');
}
   button {
     padding: 4px 12px;
     border-radius: 6px;
     color: white;
     cursor: pointer;
     border-width: 1px;
     border-style: ridge;
     &:disabled:hover {
      cursor: no-drop;
     }
   }
   #global-notification-container {
    position: absolute;
    z-index: 9999;
    margin-inline-end: 8px;
    top: ${HeaderHeight}px;
    max-height: calc(100% - ${HeaderHeight}px);
    right: 0px;
    overflow: hidden;
    & > div {
      margin-bottom: 10px;
      overflow: hidden;
      transition: all .35s;
      width: 384px;
      height: 200px;
    }
    & > div.closed {
      height: 0px;
      opacity: 0;
    }
   }
   body {
    background-color: ${GlobalBackgroundColor};
   }
   img, video {
      object-fit: contain;
   }
   img {
    pointer-events: none;
   }
   * {
      box-sizing: border-box;
      user-select: none;
      font-size: .9rem;
      font-family: NanumGothic;
      &::-webkit-scrollbar {
        width: 14px;
        height: 14px;
        overflow: hidden;
      }
      &::-webkit-scrollbar-thumb {
        background-color: ${ScrollBarColor};
        border-radius: 15px;
        outline: none;
        border: 4px solid transparent;
        background-clip: padding-box;
        &:hover {
          background-color: #66666b;
        }
      }
      &::-webkit-scrollbar-track {
        border-radius: 15px;
        border: 4px solid transparent;
        background-clip: padding-box;
        background-color: transparent;
        box-shadow: none;
      }
   }
`

export default GlobalStyle