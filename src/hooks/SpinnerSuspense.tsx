import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/spinnerLoader.css'

const SpinnerSuspense = () => {
  return (
    <div className="spinner-container">
      <Spinner animation="border" role="status" className="spinner">
      </Spinner>
      <span className="spinner-text">Cargando...</span>
    </div>
  );
}

export default SpinnerSuspense;
