const InputComponent: React.FC<{ onInputClick: () => void, selectedProduct: string }> = ({ onInputClick, selectedProduct }) => {
  return (
    <input type="text" onClick={onInputClick} defaultValue={selectedProduct}  />
  );
};
export default InputComponent;
