import styles from '../assets/styleMainMenu.module.css'
import { toggleImage } from '../js/mainMenu'

export default function MainMenu () {
  return (
        <div className={styles.options}>
            <div
                style={{ backgroundImage: 'url(https://cdn.sanity.io/images/jsdrzfkj/production-esmx/5e2316cc629ede9cd6646163efeafc5486161751-6240x4160.jpg?w=800&h=533&fit=crop)' }}
                id="hamburguesas" onClick={() => { toggleImage('hamburguesas') }}>
                <div className={styles.label}>
                    <div className={styles.icon}>
                        <img width="28" height="28"
                            src="https://img.icons8.com/external-line-zulfa-mahendra/48/external-burguer-food-delivery-line-zulfa-mahendra.png"
                            alt="external-burguer-food-delivery-line-zulfa-mahendra" />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.main}>HAMBURGUESAS</div>
                        <div className={styles.sub}>¡Encuentra la que gustes!</div>
                    </div>
                </div>
            </div>
            <div className={styles.option}
                style={{ backgroundImage: 'url(https://media.minutouno.com/p/7b22d01bdaf2dfb7c979c5b2e993b6c1/adjuntos/150/imagenes/038/105/0038105149/610x0/smart/super-pancho.jpg)' }}
                id="panchos" onClick={() => { toggleImage('panchos') }}>
                <div className={styles.label}>
                    <div className={styles.icon}>
                        <img width="28" height="28" src="https://img.icons8.com/ios/50/hot-dog.png" alt="hot-dog" />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.main}>PANCHOS</div>
                        <div className={styles.sub}>¡Encuentra tu favorito!</div>
                    </div>
                </div>
            </div>
            <div className={styles.option}
                style={{ backgroundImage: 'url(https://www.clarin.com/img/2022/05/18/f91_3iwyd_1200x630__1.jpg)' }}
                id="empanadas" onClick={() => { toggleImage('empanadas') }}>
                <div className={styles.label}>
                    <div className={styles.icon}>
                        <img width="35" height="35"
                            src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-empanada-world-cuisine-flaticons-lineal-color-flat-icons-3.png"
                            alt="external-empanada-world-cuisine-flaticons-lineal-color-flat-icons-3" />
                    </div>
                    <div className={styles.icon}>
                        <div className={styles.main}>EMPANADAS</div>
                        <div className={styles.sub}>¡Las mejores están aquí!</div>
                    </div>
                </div>
            </div>
            <div className={styles.option}
                style={{ backgroundImage: 'url(https://media.istockphoto.com/id/938742222/photo/cheesy-pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=D1z4xPCs-qQIZyUqRcHrnsJSJy_YbUD9udOrXpilNpI=)' }}
                id="pizzas" onClick={() => { toggleImage('pizzas') }}>
                <div className={styles.label}>
                    <div className={styles.icon}>
                        <img width="27" height="27" src="https://img.icons8.com/ios/50/pizza.png" alt="pizza" />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.main}>PIZZAS</div>
                        <div className={styles.sub}>¿Buscas algo italiano? ¡Te presentamos las mejores pizzas!</div>
                    </div>
                </div>
            </div>
            <div className={styles.option}
                style={{ backgroundImage: 'url(https://saboresmendoza.com/wp-content/uploads/2019/09/lomos-1.jpg)' }}
                id="lomos" onClick={() => { toggleImage('lomos') }}>
                <div className={styles.label}>
                    <div className={styles.icon}>
                        <img width="31" height="31" src="https://img.icons8.com/ios/50/steak-medium.png"
                            alt="steak-medium" />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.main}>LOMOS</div>
                        <div className={styles.sub}>¡Los mejores de la ciudad!</div>
                    </div>
                </div>
            </div>
            <div className={styles.option} style={{ backgroundImage: '../css/img/helado.jpg' }} id="helado" onClick={() => { toggleImage('helado') }}>
                <div className={styles.label}>
                    <div className={styles.icon}>
                        <img width="31" height="31" src='css/img/helado.jpg' alt="helado" />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.main}>HELADO</div>
                        <div className={styles.sub}>¡El postre más rico!</div>
                    </div>
                </div>
            </div>
            <div className={styles.option} style={{ backgroundImage: 'url(/Front-End/css/img/asado.jpg)' }} id="parrilla" onClick={() => { toggleImage('parrilla') }}>
                <div className={styles.label}>
                    <div className={styles.icon}>
                        <img width="31" height="31" src="/Front-End/css/img/icons8-parrilla-60.png" alt="carne" />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.main}>PARRILLA</div>
                        <div className={styles.sub}>¡Ta para un asadaso!</div>
                    </div>
                </div>
            </div>
            <div className={styles.option} style={{ backgroundImage: 'url(/Front-End/css/img/pastas.png)' }} id="pastas" onClick={() => { toggleImage('pastas') }}>
                <div className={styles.label}>
                    <div className={styles.icon}>
                        <img width="31" height="31" src="/Front-End/css/img/icons8-pastas-100.png" alt="pasta" />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.main}>PASTAS</div>
                        <div className={styles.sub}>¡Pero que rico!</div>
                    </div>
                </div>
            </div>
            <div className={styles.option} style={{ backgroundImage: 'url(/Front-End/css/img/sanguche.jpeg)' }} id="sanguche" onClick={() => { toggleImage('sanguche') }}>
                <div className={styles.label}>
                    <div className={styles.icon}>
                        <img width="31" height="31" src="/Front-End/css/img/icons8-sándwich-50.png" alt="sanguche" />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.main}>SANGUCHES</div>
                        <div className={styles.sub}>¡Ese viene completo
                            Jamón y queso y pan
                            Que lindo que es mirarte
                            Con tu milanga, Hernán!</div>
                    </div>
                </div>
            </div>
            <div className={styles.option} style={{ backgroundImage: 'url(/Front-End/css/img/sushi.jpg)' }} id="sushi" onClick={() => { toggleImage('sushi') }}>
                <div className={styles.label}>
                    <div className={styles.icon}>
                        <img width="31" height="31" src="/Front-End/css/img/icons8-sushi-50.png" alt="sushi" />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.main}>SUSHI</div>
                        <div className={styles.sub}>¡No seas tan trolo man!</div>
                    </div>
                </div>
            </div>
            <div className={styles.option} style={{ backgroundImage: 'url(src/css/img/vegetariano.jpg)' }} id="vegetariano" onClick={() => { toggleImage('vegetariano') }}>
                <div className={styles.label}>
                    <div className={styles.icon}>
                        <img width="31" height="31" src="/Front-End/css/img/icons8-ensalada-50.png" alt="ensalada" />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.main}>VEGETARIANO</div>
                        <div className={styles.sub}>¡Ah bue lo que nos falta!</div>
                    </div>
                </div>
            </div>
        </div>
  )
}
