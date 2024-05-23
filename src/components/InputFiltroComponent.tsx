import TuneIcon from '@mui/icons-material/Tune';

const InputComponent: React.FC<{ onInputClick: () => void, selectedProduct: string, placeHolder: string }> = ({ onInputClick, selectedProduct, placeHolder }) => {
  return (
    <div className="inputBox">
      <TuneIcon className='icon-filter' />
      {selectedProduct.length === 0 ? (
        <div className="inputBox">
          <input
            type="text"
            required={true}
            onClick={(e) => {
              e.preventDefault();
              onInputClick();
            }}
            defaultValue={selectedProduct}
            readOnly
          />
          <span>{placeHolder}</span>
        </div>
      ) : (
        <div className="inputBox">
          <input
            type="text"
            required={true}
            onClick={(e) => {
              e.preventDefault();
              onInputClick();
            }}
            defaultValue={selectedProduct}
            readOnly
          />
        </div>
      )}

    </div>
  );
};

export default InputComponent;
