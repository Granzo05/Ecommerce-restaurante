import '../styles/notFound.css'
import '../styles/header.css';
import Header from '../components/Header'
import { getBaseUrl } from '../utils/global_variables/const';


function NotFound() {

  return (
    <>
      <Header></Header>
      <section className="py-5">
        <div className="d-flex justify-content-center 
                    align-items-center flex-column 
                    text-center w-100">
          <div className="bg_img w-50">
          </div>
          <div>
            <p className="display-4">Creo que te has perdido</p>
            <p>No se ha encontrado la página buscada</p>
            <a onClick={() => window.location.href = getBaseUrl()}
              className="text-white text-decoration-none px-4 py-3 
                          bg-success d-inline-block mt-2 rounded">
              Volver a la página principal
            </a>
          </div>
        </div>
      </section>
    </>
  );

}

export default NotFound;
