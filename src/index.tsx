import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyle, {globalStyles} from './styles/global-styled';
import { RecoilRoot } from 'recoil';
import './Extensions'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <>
    <GlobalStyle />
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </>
);
reportWebVitals();
