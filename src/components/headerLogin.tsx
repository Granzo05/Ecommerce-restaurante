import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'
import '../styles/headerLogin.css'
import { getBaseUrl } from '../utils/global_variables/const';

const HeaderLogin = () => {


    return (
            <header id='header-login'>
                <a onClick={() => window.location.href = getBaseUrl()}><img id='logo-header-login' src={Logo} /></a>
            </header>

    )

}

export default HeaderLogin;

