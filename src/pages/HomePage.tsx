import Fondo1 from '../assets/img/fondo.jpg'
import '../styles/mainMenu.css'

export default function MainMenu() {
    

    return (
        <div className='container'>
            <div className='carta'>
                <img className='fondo' src={Fondo1} alt="" />
                <div className='carta-content'>
                    <h3 className='titulo'>HAMBURGUESAS</h3>
                </div>
                <div className='backdrop'></div>
            </div>
        </div>
    );
}
