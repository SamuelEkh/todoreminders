import '../style/Popup.css';
import { IState as Props } from './List';

interface IProps {
  trigger: Props['popupTrigger'],
  setPopupTrigger: React.Dispatch<React.SetStateAction<Props['popupTrigger']>>
}

const Popup: React.FC<IProps> = ({ children, trigger, setPopupTrigger }) => ((trigger) ? (
  <div className="popup">
    <div className="popup-inner">
      <button type="button" className="popup-inner__close" onClick={() => setPopupTrigger(false)}>
        X
      </button>
      {children}
    </div>
  </div>
) : null);

export default Popup;
