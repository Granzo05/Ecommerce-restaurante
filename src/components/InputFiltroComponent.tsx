import TuneIcon from '@mui/icons-material/Tune';

const InputComponent: React.FC<{ onInputClick: () => void, selectedProduct: string, placeHolder: string }> = ({ onInputClick, selectedProduct, placeHolder }) => {
  return (
    <div className="inputBox">
      <TuneIcon className='icon-filter'/>
      <input type="text" required={true} onClick={onInputClick} defaultValue={selectedProduct} />
      <span>{placeHolder}</span>
    </div>
  );
};
export default InputComponent;
