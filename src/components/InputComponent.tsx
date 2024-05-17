const InputComponent: React.FC<{ onInputClick: () => void, selectedProduct: string, placeHolder: string }> = ({ onInputClick, selectedProduct, placeHolder }) => {
  return (
    <input type="text" placeholder={placeHolder} onClick={onInputClick} defaultValue={selectedProduct}  />
  );
};
export default InputComponent;
