import TuneIcon from '@mui/icons-material/Tune';

const InputComponent: React.FC<{ onInputClick: () => void, selectedProduct: string, placeHolder: string, disabled: boolean }> = ({ disabled, onInputClick, selectedProduct, placeHolder }) => {
  return (
    <>

      {selectedProduct.length === 0 ? (
        <div className="inputBox">
          <TuneIcon className='icon-filter' />
          <input
            type="text"
            required={true}
            onClick={(e) => {
              e.preventDefault();
              onInputClick();
            }}
            defaultValue={selectedProduct}
            disabled={disabled}
            readOnly
          />
          <span>{placeHolder}</span>
        </div>
      ) : (
        <div className="inputBox">
          <TuneIcon className='icon-filter' />
          <input
            type="text"
            required={true}
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              onInputClick();
            }}
            defaultValue={selectedProduct}
            readOnly
          />
        </div>
      )}

    </>
  );
};

export default InputComponent;
