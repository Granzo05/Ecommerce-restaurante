const InputComponent: React.FC<{ onInputClick: () => void, selectedProduct: string, placeHolder: string }> = ({ onInputClick, selectedProduct, placeHolder }) => {
  return (
    <div className="inputBox">
      <input type="text" required={true} onClick={onInputClick} defaultValue={selectedProduct} />
      <span>{placeHolder}</span>
    </div>
  );
};
export default InputComponent;
