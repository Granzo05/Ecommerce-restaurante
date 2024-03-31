import '../styles/mainMenu.css'
import burguerImage from '../assets/img/hamburguesa-background.png'
import pizzaImage from '../assets/img/pizza-background.png'
import lomoImage from '../assets/img/lomo-background.jpeg'
import sushiImage from '../assets/img/sushi-background.jpg'
import heladoImage from '../assets/img/helado-background.jpg'
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import IcecreamIcon from '@mui/icons-material/Icecream';
import lomoIcono from '../assets/img/icono-lomos.png'
import sushiIcono from '../assets/img/icono-sushi.png'

export default function MainMenu() {

    
    return (
    <div className='body'>
        <div className="container">
            <div className="card">
                <img className="background" src={burguerImage} alt=""/>

                <div className="card-content">
                <div className="profile-image">
                    <label style={{color: 'white'}}><LunchDiningIcon/></label>
                </div>

                <h3 className="title">HAMBURGUESAS</h3>
                </div>
                <div className="backdrop"></div>
            </div>

            <div className="card">
                <img className="background" src={pizzaImage} alt=""/>

                <div className="card-content">
                <div className="profile-image">
                <label style={{color: 'white'}}><LocalPizzaIcon/></label>
                </div>

                <h3 className="title">PIZZAS</h3>
                </div>
                <div className="backdrop"></div>
            </div>

            <div className="card">
                <img className="background" src={lomoImage} alt=""/>

                <div className="card-content">
                <div className="profile-image">
                    <img src={lomoIcono} alt="" style={{width: '30px', marginTop: '-15px', height: '35px'}} />
                </div>

                <h3 className="title">LOMOS</h3>
                </div>
                <div className="backdrop"></div>
            </div>

            <div className="card">
                <img className="background" src={sushiImage} alt=""/>

                <div className="card-content">
                <div className="profile-image">
                    <img src={sushiIcono} alt="" style={{width: '30px', height: '35px'}} />
                </div>

                <h3 className="title">SUSHI</h3>
                </div>
                <div className="backdrop"></div>
            </div>

            <div className="card">
                <img className="background" src={heladoImage} alt=""/>

                <div className="card-content">
                <div className="profile-image">
                    <label style={{color: 'white'}}><IcecreamIcon/></label>
                </div>

                <h3 className="title">HELADOS</h3>
                </div>
                <div className="backdrop"></div>
            </div>
        </div>
    </div>
    );
}
