import '../styles/homePage-header-footer.css'

export default function MainMenu() {

    function handleMenu(tipoComida: string) {
        window.location.href = 'menu/' + tipoComida;
    }

    /*
    const cargarDB = () => {
        ProvinciaService.createProvincias()
            .catch(error => {
                console.error("Error al obtener las provincias:", error);
            });
    }
    */

    window.addEventListener("scroll", function(){
        var header = document.querySelector("our");
        header?.classList.toggle("sticky", window.scrollY > 0)
    })

    return (
        <>
        <section id='servicios' className='information container'>
            <div  className="information-content">
                <div className='information-1'>
                    <div className="information-c1">
                        <h3>Historia</h3>
                        <p>"El Buen Sabor", fundado en 2000 por la familia Rodríguez, ofrece una experiencia culinaria única y auténtica en nuestro país.</p>
                        <a href="" className='btn-1'>Conocer historia</a>
                    </div>
                    <div className="information-a1">
                        <img src="../src/assets/img/restaurante-bg.avif" alt="" />
                    </div>
                </div>
                <div className='information-2'>
                <div className="information-b1">
                        <img src="../src/assets/img/meseros.jpg" alt="" />
                    </div>
                    <div className="information-c1">
                        <h3>Sobre nosotros</h3>
                        <p>Somos "El Buen Sabor", un lugar de comidas dedicado a ofrecer lo mejor de la gastronomía local. 
                            Nuestro compromiso es brindar platos deliciosos con ingredientes frescos 
                            y de alta calidad, en un ambiente acogedor y familiar.
                        </p>
                        <a href="" className='btn-1'>Más sobre nosotros</a>
                    </div>
                </div>
            </div>
        </section>
        <section className='our'>
            <div id='ofertas' className="container">
                <h2>Nuestras promociones</h2>
            </div>
        </section>
        <section className="oferts">
            <div className="ofert-content container">
                <div className="ofert-1">
                    <div className="ofert-txt">
                        <h3>Lorem</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <a href="" className='btn-2'>Más Información</a>
                    </div>
                    <div className="ofert-img">
                        <img src="../src/assets/img/hamburguesa-background.png" alt="" />
                    </div>
                </div>

                <div className="ofert-1">
                    <div className="ofert-img">
                        <img src="../src/assets/img/lomo-background.jpeg" alt="" />
                    </div>
                    <div className="ofert-txt">
                        <h3>Lorem</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <a href="" className='btn-2'>Más Información</a>
                    </div>
                    
                </div>

                <div className="ofert-1">
                    <div className="ofert-txt">
                        <h3>Lorem</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        <a href="" className='btn-2'>Más Información</a>
                    </div>
                    <div className="ofert-img">
                        <img src="../src/assets/img/pizza-background.png" alt="" />
                    </div>
                </div>

                <div className="ofert-1">
                    <div className="ofert-img">
                        <img src="../src/assets/img/tacos.jpg" alt="" />
                    </div>
                    <div className="ofert-txt">
                        <h3>Lorem</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
                        <a href="" className='btn-2'>Más Información</a>
                    </div>
                    
                </div>
            </div>
        </section>
        <section className='bg'></section>
        <section id='menus' className='food container'>
            <h2>Menús</h2>
            <span>Categorías</span>
            <div className="food-content">
                <div className="left">
                    <div className="food-1">
                        <h3>Hamburguesas</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" className="menu-img"/></p>
                            
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                    <div className="food-1">
                        <h3>Lorem impsum</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" /></p>
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                    <div className="food-1">
                        <h3>Lorem impsum</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" /></p>
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                    <div className="food-1">
                        <h3>Lorem impsum</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" /></p>
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                    <div className="food-1">
                        <h3>Lorem impsum</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" /></p>
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                    <div className="food-1">
                        <h3>Lorem impsum</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" /></p>
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="food-1">
                        <h3>Lorem impsum</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" /></p>
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                    <div className="food-1">
                        <h3>Lorem impsum</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" /></p>
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                    <div className="food-1">
                        <h3>Lorem impsum</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" /></p>
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                    <div className="food-1">
                        <h3>Lorem impsum</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" /></p>
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                    <div className="food-1">
                        <h3>Lorem impsum</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" /></p>
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                    <div className="food-1">
                        <h3>Lorem impsum</h3>
                        <div className="food-txt">
                            <p><img src="../src/assets/img/menus/burguer-bg.avif" alt="" /></p>
                            <div className="overlay">

                            <p className='abrir-menu' onClick={() => handleMenu('hamburguesas')}>Ver menú</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        </>
        
    );
}

/*<div className='body'>
            <div className="container">

                <div className="card" onClick={() => handleMenu('hamburguesas')}>
                    <img className="background" src={burguerImage} alt="" />

                    <div className="card-content">
                        <div className="profile-image">
                            <label style={{ color: 'white' }}><LunchDiningIcon /></label>
                        </div>
                        <h3 className="title">HAMBURGUESAS</h3>
                    </div>
                    <div className="backdrop"></div>
                </div>

                <div className="card" onClick={() => handleMenu('pizzas')}>
                    <img className="background" src={pizzaImage} alt="" />

                    <div className="card-content">
                        <div className="profile-image">
                            <label style={{ color: 'white' }}><LocalPizzaIcon /></label>
                        </div>

                        <h3 className="title">PIZZAS</h3>
                    </div>
                    <div className="backdrop"></div>
                </div>

                <div className="card" onClick={() => handleMenu('lomos')}>
                    <img className="background" src={lomoImage} alt="" />

                    <div className="card-content">
                        <div className="profile-image">
                            <img src={lomoIcono} alt="" style={{ width: '30px', marginTop: '-15px', height: '35px' }} />
                        </div>

                        <h3 className="title">LOMOS</h3>
                    </div>
                    <div className="backdrop"></div>
                </div>

                <div className="card" onClick={() => handleMenu('sushi')}>
                    <img className="background" src={sushiImage} alt="" />

                    <div className="card-content">
                        <div className="profile-image">
                            <img src={sushiIcono} alt="" style={{ width: '30px', height: '35px' }} />
                        </div>

                        <h3 className="title">SUSHI</h3>
                    </div>
                    <div className="backdrop"></div>
                </div>

                <div className="card" onClick={() => handleMenu('helado')}>
                    <img className="background" src={heladoImage} alt="" />

                    <div className="card-content">
                        <div className="profile-image">
                            <label style={{ color: 'white' }}><IcecreamIcon /></label>
                        </div>

                        <h3 className="title">HELADOS</h3>
                    </div>
                    <div className="backdrop"></div>
                </div>
                <div className="card">
                    <img className="background" src={heladoImage} alt="" />

                    <div className="card-content">
                        <div className="profile-image">
                            <label style={{ color: 'white' }}><IcecreamIcon /></label>
                        </div>

                        <h3 className="title">HELADOS</h3>
                    </div>
                    <div className="backdrop"></div>
                </div>
                <div className="card">
                    <img className="background" src={heladoImage} alt="" />

                    <div className="card-content">
                        <div className="profile-image">
                            <label style={{ color: 'white' }}><IcecreamIcon /></label>
                        </div>

                        <h3 className="title">HELADOS</h3>
                    </div>
                    <div className="backdrop"></div>
                </div>
                <div className="card">
                    <img className="background" src={heladoImage} alt="" />

                    <div className="card-content">
                        <div className="profile-image">
                            <label style={{ color: 'white' }}><IcecreamIcon /></label>
                        </div>

                        <h3 className="title">HELADOS</h3>
                    </div>
                    <div className="backdrop"></div>
                </div>
                <div className="card">
                    <img className="background" src={heladoImage} alt="" />

                    <div className="card-content">
                        <div className="profile-image">
                            <label style={{ color: 'white' }}><IcecreamIcon /></label>
                        </div>

                        <h3 className="title">HELADOS</h3>
                    </div>
                    <div className="backdrop"></div>
                </div>
                <div className="card">
                    <img className="background" src={heladoImage} alt="" />

                    <div className="card-content">
                        <div className="profile-image">
                            <label style={{ color: 'white' }}><IcecreamIcon /></label>
                        </div>

                        <h3 className="title">HELADOS</h3>
                    </div>
                    <div className="backdrop"></div>
                </div>
            </div>

        </div>*/
