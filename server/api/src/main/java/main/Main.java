package main;

import main.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.*;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.Medida;
import main.entities.Ingredientes.Subcategoria;
import main.entities.Productos.ArticuloVenta;
import main.entities.Productos.Imagenes;
import main.entities.Restaurante.Empresa;
import main.entities.Restaurante.PrivilegiosSucursales;
import main.entities.Restaurante.Roles;
import main.entities.Restaurante.Sucursal;
import main.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import javax.mail.MessagingException;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

@SpringBootApplication
@EntityScan("main.entities")
@ComponentScan(basePackages = {"main.controllers", "main.repositories", "main.*"})
public class Main {
    private final String RUTACSV = "C://Buen-sabor//buen-sabor-app-typescript-react//server//api//src//main//resources//localidades.csv";
    private final String SEPARACIONCSV = ";";
    @Autowired(required = true)
    private PaisRepository paisRepository;
    @Autowired(required = true)
    private ProvinciaRepository provinciaRepository;
    @Autowired(required = true)
    private LocalidadRepository localidadRepository;
    @Autowired(required = true)
    private EmpresaRepository empresaRepository;
    @Autowired(required = true)
    private ClienteRepository clienteRepository;

    public static void main(String[] args) throws GeneralSecurityException, IOException, MessagingException {
        SpringApplication.run(Main.class, args);
    }

    @Bean
    CommandLineRunner init() {
        return args -> {

            try {


                int cantidadProvincias = provinciaRepository.getCantidadProvincias();
                System.out.println("Provincias listas para usar");

                if (cantidadProvincias < 24) {
                    System.out.println("No se han encontrado provincias. Creandolas...");
                    try (BufferedReader br = new BufferedReader(new FileReader(RUTACSV))) {
                        Pais pais = crearPais("Argentina");
                        String line;

                        while ((line = br.readLine()) != null) {
                            String[] data = line.split(SEPARACIONCSV);
                            cargarDatos(data[0], data[1], data[2], pais);
                        }

                        paisRepository.save(pais);

                    } catch (IOException e) {
                        System.out.println(e);
                    }
                }

                Optional<Empresa> empresaOp = empresaRepository.findByCuit("201234566");

                if (empresaOp.isEmpty()) {
                    Empresa empresa = new Empresa();
                    empresa.setNombre("El Buen Sabor");
                    empresa.setCuit("201234566");
                    empresa.setRazonSocial("El Buen Sabor S.R.L.");
                    empresa.setContraseña(Encrypt.cifrarPassword("123456"));

                    Sucursal sucursal = new Sucursal();
                    sucursal.setEmpresa(empresa);
                    sucursal.setNombre("Sucursal Capital");
                    sucursal.setTelefono(2634123456L);
                    sucursal.setHorarioApertura(LocalTime.of(18, 0));
                    sucursal.setHorarioCierre(LocalTime.of(23, 0));
                    sucursal.setEmail("a@gmail.com");
                    sucursal.setContraseña(Encrypt.cifrarPassword("123"));
                    sucursal.setBorrado("NO");

                    Domicilio domicilio = new Domicilio();
                    domicilio.setNumero(774);
                    domicilio.setCalle("San martin");
                    domicilio.setCodigoPostal(4441);
                    Optional<Localidad> localidad = localidadRepository.findByName("GODOY CRUZ");
                    domicilio.setLocalidad(localidad.get());
                    domicilio.setSucursal(sucursal);
                    sucursal.getDomicilios().add(domicilio);

                    Categoria categoriaHamburguesa = new Categoria();
                    categoriaHamburguesa.setNombre("HAMBURGUESAS");
                    categoriaHamburguesa.setBorrado("NO");
                    categoriaHamburguesa.getSucursales().add(sucursal);

                    Subcategoria subcategoriaVegana = new Subcategoria();
                    subcategoriaVegana.setCategoria(categoriaHamburguesa);
                    subcategoriaVegana.setNombre("Vegana");
                    subcategoriaVegana.getSucursales().add(sucursal);

                    Subcategoria subcategoriaPollo = new Subcategoria();
                    subcategoriaPollo.setCategoria(categoriaHamburguesa);
                    subcategoriaPollo.setNombre("Pollo");
                    subcategoriaPollo.getSucursales().add(sucursal);

                    Subcategoria subcategoriaCarne = new Subcategoria();
                    subcategoriaCarne.setCategoria(categoriaHamburguesa);
                    subcategoriaCarne.setNombre("Carne");
                    subcategoriaCarne.getSucursales().add(sucursal);

                    categoriaHamburguesa.getSubcategorias().add(subcategoriaVegana);
                    categoriaHamburguesa.getSubcategorias().add(subcategoriaPollo);
                    categoriaHamburguesa.getSubcategorias().add(subcategoriaCarne);

                    Imagenes imagen = new Imagenes();
                    imagen.setNombre("hamburguesas.png");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaHamburguesa.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaHamburguesa);
                    imagen.getSucursales().add(sucursal);

                    categoriaHamburguesa.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaHamburguesa);

                    Categoria categoriaPanchos = new Categoria();
                    categoriaPanchos.setNombre("PANCHOS");
                    categoriaPanchos.setBorrado("NO");
                    categoriaPanchos.getSucursales().add(sucursal);

                    Subcategoria subcategoriaCompleto = new Subcategoria();
                    subcategoriaCompleto.setCategoria(categoriaPanchos);
                    subcategoriaCompleto.setNombre("Completo");
                    subcategoriaCompleto.getSucursales().add(sucursal);

                    Subcategoria subcategoriaConPoncho = new Subcategoria();
                    subcategoriaConPoncho.setCategoria(categoriaPanchos);
                    subcategoriaConPoncho.setNombre("Con poncho");
                    subcategoriaConPoncho.getSucursales().add(sucursal);

                    Subcategoria subcategoria12 = new Subcategoria();
                    subcategoria12.setCategoria(categoriaPanchos);
                    subcategoria12.setNombre("Doble");
                    subcategoria12.getSucursales().add(sucursal);

                    categoriaPanchos.getSubcategorias().add(subcategoriaCompleto);
                    categoriaPanchos.getSubcategorias().add(subcategoriaConPoncho);
                    categoriaPanchos.getSubcategorias().add(subcategoria12);

                    imagen = new Imagenes();
                    imagen.setNombre("panchos.webp");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaPanchos.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaPanchos);
                    imagen.getSucursales().add(sucursal);

                    categoriaPanchos.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaPanchos);

                    Categoria categoriaEMPANADAS = new Categoria();
                    categoriaEMPANADAS.setNombre("EMPANADAS");
                    categoriaEMPANADAS.setBorrado("NO");
                    categoriaEMPANADAS.getSucursales().add(sucursal);

                    Subcategoria subcategoria20 = new Subcategoria();
                    subcategoria20.setCategoria(categoriaEMPANADAS);
                    subcategoria20.setNombre("Jamón y queso");
                    subcategoria20.getSucursales().add(sucursal);

                    Subcategoria subcategoria21 = new Subcategoria();
                    subcategoria21.setCategoria(categoriaEMPANADAS);
                    subcategoria21.setNombre("Carne");
                    subcategoria21.getSucursales().add(sucursal);

                    Subcategoria subcategoria22 = new Subcategoria();
                    subcategoria22.setCategoria(categoriaEMPANADAS);
                    subcategoria22.setNombre("Cebolla");
                    subcategoria22.getSucursales().add(sucursal);

                    categoriaEMPANADAS.getSubcategorias().add(subcategoria20);
                    categoriaEMPANADAS.getSubcategorias().add(subcategoria21);
                    categoriaEMPANADAS.getSubcategorias().add(subcategoria22);

                    imagen = new Imagenes();
                    imagen.setNombre("empanadas.jpg");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaEMPANADAS.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaEMPANADAS);
                    imagen.getSucursales().add(sucursal);

                    categoriaEMPANADAS.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaEMPANADAS);

                    Categoria categoriaPIZZAS = new Categoria();
                    categoriaPIZZAS.setNombre("PIZZAS");
                    categoriaPIZZAS.setBorrado("NO");
                    categoriaPIZZAS.getSucursales().add(sucursal);

                    Subcategoria subcategoriapiedra = new Subcategoria();
                    subcategoriapiedra.setCategoria(categoriaPIZZAS);
                    subcategoriapiedra.setNombre("A la piedra");
                    subcategoriapiedra.getSucursales().add(sucursal);

                    Subcategoria subcategoriamasa = new Subcategoria();
                    subcategoriamasa.setCategoria(categoriaPIZZAS);
                    subcategoriamasa.setNombre("A la masa");
                    subcategoriamasa.getSucursales().add(sucursal);

                    Subcategoria subcategoria32 = new Subcategoria();
                    subcategoria32.setCategoria(categoriaPIZZAS);
                    subcategoria32.setNombre("Media");
                    subcategoria32.getSucursales().add(sucursal);

                    categoriaPIZZAS.getSubcategorias().add(subcategoriapiedra);
                    categoriaPIZZAS.getSubcategorias().add(subcategoriamasa);
                    categoriaPIZZAS.getSubcategorias().add(subcategoria32);

                    imagen = new Imagenes();
                    imagen.setNombre("pizzas.png");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaPIZZAS.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaPIZZAS);
                    imagen.getSucursales().add(sucursal);

                    categoriaPIZZAS.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaPIZZAS);

                    Categoria categoriaLOMOS = new Categoria();
                    categoriaLOMOS.setNombre("LOMOS");
                    categoriaLOMOS.setBorrado("NO");
                    categoriaLOMOS.getSucursales().add(sucursal);

                    Subcategoria subcategoria40 = new Subcategoria();
                    subcategoria40.setCategoria(categoriaLOMOS);
                    subcategoria40.setNombre("Cerdo");
                    subcategoria40.getSucursales().add(sucursal);

                    Subcategoria subcategoria41 = new Subcategoria();
                    subcategoria41.setCategoria(categoriaLOMOS);
                    subcategoria41.setNombre("Carne");
                    subcategoria41.getSucursales().add(sucursal);

                    Subcategoria subcategoria42 = new Subcategoria();
                    subcategoria42.setCategoria(categoriaLOMOS);
                    subcategoria42.setNombre("Pollo");
                    subcategoria42.getSucursales().add(sucursal);

                    categoriaLOMOS.getSubcategorias().add(subcategoria40);
                    categoriaLOMOS.getSubcategorias().add(subcategoria41);
                    categoriaLOMOS.getSubcategorias().add(subcategoria42);

                    imagen = new Imagenes();
                    imagen.setNombre("lomos.avif");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaLOMOS.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaLOMOS);
                    imagen.getSucursales().add(sucursal);

                    categoriaLOMOS.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaLOMOS);

                    Categoria categoriaHELADO = new Categoria();
                    categoriaHELADO.setNombre("HELADO");
                    categoriaHELADO.setBorrado("NO");
                    categoriaHELADO.getSucursales().add(sucursal);

                    Subcategoria subcategoria50 = new Subcategoria();
                    subcategoria50.setCategoria(categoriaHELADO);
                    subcategoria50.setNombre("A la crema");
                    subcategoria50.getSucursales().add(sucursal);

                    Subcategoria subcategoria51 = new Subcategoria();
                    subcategoria51.setCategoria(categoriaHELADO);
                    subcategoria51.setNombre("Al agua");
                    subcategoria51.getSucursales().add(sucursal);

                    categoriaHELADO.getSubcategorias().add(subcategoria50);
                    categoriaHELADO.getSubcategorias().add(subcategoria51);

                    imagen = new Imagenes();
                    imagen.setNombre("helados.jpg");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaHELADO.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaHELADO);
                    imagen.getSucursales().add(sucursal);

                    categoriaHELADO.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaHELADO);

                    Categoria categoriaPARRILLA = new Categoria();
                    categoriaPARRILLA.setNombre("PARRILLA");
                    categoriaPARRILLA.setBorrado("NO");
                    categoriaPARRILLA.getSucursales().add(sucursal);

                    Subcategoria subcategoria60 = new Subcategoria();
                    subcategoria60.setCategoria(categoriaPARRILLA);
                    subcategoria60.setNombre("Vacio a la llama");
                    subcategoria60.getSucursales().add(sucursal);

                    Subcategoria subcategoria61 = new Subcategoria();
                    subcategoria60.setCategoria(categoriaPARRILLA);
                    subcategoria60.setNombre("Cordero a la llama");
                    subcategoria60.getSucursales().add(sucursal);

                    Subcategoria subcategoria62 = new Subcategoria();
                    subcategoria60.setCategoria(categoriaPARRILLA);
                    subcategoria60.setNombre("Costillar a la llama");
                    subcategoria60.getSucursales().add(sucursal);

                    categoriaPARRILLA.getSubcategorias().add(subcategoria60);
                    categoriaPARRILLA.getSubcategorias().add(subcategoria61);
                    categoriaPARRILLA.getSubcategorias().add(subcategoria62);

                    imagen = new Imagenes();
                    imagen.setNombre("parrilla.avif");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaPARRILLA.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaPARRILLA);
                    imagen.getSucursales().add(sucursal);

                    categoriaPARRILLA.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaPARRILLA);

                    Categoria categoriaPASTAS = new Categoria();
                    categoriaPASTAS.setNombre("PASTAS");
                    categoriaPASTAS.setBorrado("NO");
                    categoriaPASTAS.getSucursales().add(sucursal);

                    Subcategoria subcategoria70 = new Subcategoria();
                    subcategoria70.setCategoria(categoriaPASTAS);
                    subcategoria70.setNombre("Ñoquis");
                    subcategoria70.getSucursales().add(sucursal);

                    Subcategoria subcategoria71 = new Subcategoria();
                    subcategoria71.setCategoria(categoriaPASTAS);
                    subcategoria71.setNombre("Fideos");
                    subcategoria71.getSucursales().add(sucursal);

                    Subcategoria subcategoria72 = new Subcategoria();
                    subcategoria72.setCategoria(categoriaPASTAS);
                    subcategoria72.setNombre("Ravioles");
                    subcategoria72.getSucursales().add(sucursal);

                    categoriaPASTAS.getSubcategorias().add(subcategoria70);
                    categoriaPASTAS.getSubcategorias().add(subcategoria71);
                    categoriaPASTAS.getSubcategorias().add(subcategoria72);

                    imagen = new Imagenes();
                    imagen.setNombre("pastas.jpeg");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaPASTAS.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaPASTAS);
                    imagen.getSucursales().add(sucursal);

                    categoriaPASTAS.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaPASTAS);

                    Categoria categoriaSUSHI = new Categoria();
                    categoriaSUSHI.setNombre("SUSHI");
                    categoriaSUSHI.setBorrado("NO");
                    categoriaSUSHI.getSucursales().add(sucursal);

                    imagen = new Imagenes();
                    imagen.setNombre("sushi.jpg");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaSUSHI.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaSUSHI);
                    imagen.getSucursales().add(sucursal);

                    categoriaSUSHI.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaSUSHI);

                    Categoria categoriaMILANESAS = new Categoria();
                    categoriaMILANESAS.setNombre("MILANESAS");
                    categoriaMILANESAS.setBorrado("NO");
                    categoriaMILANESAS.getSucursales().add(sucursal);

                    imagen = new Imagenes();
                    imagen.setNombre("milanesas.png");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaMILANESAS.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaMILANESAS);
                    imagen.getSucursales().add(sucursal);

                    categoriaMILANESAS.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaMILANESAS);

                    Categoria categoriaBEBIDA_SIN_ALCOHOL = new Categoria();
                    categoriaBEBIDA_SIN_ALCOHOL.setNombre("BEBIDA_SIN_ALCOHOL");
                    categoriaBEBIDA_SIN_ALCOHOL.setBorrado("NO");
                    categoriaBEBIDA_SIN_ALCOHOL.getSucursales().add(sucursal);

                    Subcategoria subcategoria100 = new Subcategoria();
                    subcategoria100.setCategoria(categoriaBEBIDA_SIN_ALCOHOL);
                    subcategoria100.setNombre("Gaseosas");
                    subcategoria100.getSucursales().add(sucursal);

                    Subcategoria subcategoria101 = new Subcategoria();
                    subcategoria101.setCategoria(categoriaBEBIDA_SIN_ALCOHOL);
                    subcategoria101.setNombre("Agua");
                    subcategoria101.getSucursales().add(sucursal);

                    Subcategoria subcategoria102 = new Subcategoria();
                    subcategoria102.setCategoria(categoriaBEBIDA_SIN_ALCOHOL);
                    subcategoria102.setNombre("Gaseosas sin azúcar");
                    subcategoria102.getSucursales().add(sucursal);

                    categoriaBEBIDA_SIN_ALCOHOL.getSubcategorias().add(subcategoria100);
                    categoriaBEBIDA_SIN_ALCOHOL.getSubcategorias().add(subcategoria101);
                    categoriaBEBIDA_SIN_ALCOHOL.getSubcategorias().add(subcategoria102);

                    imagen = new Imagenes();
                    imagen.setNombre("sin-alcohol.jpg");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaBEBIDA_SIN_ALCOHOL.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaBEBIDA_SIN_ALCOHOL);
                    imagen.getSucursales().add(sucursal);

                    categoriaBEBIDA_SIN_ALCOHOL.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaBEBIDA_SIN_ALCOHOL);

                    Categoria categoriaBEBIDA_CON_ALCOHOL = new Categoria();
                    categoriaBEBIDA_CON_ALCOHOL.setNombre("BEBIDA_CON_ALCOHOL");
                    categoriaBEBIDA_CON_ALCOHOL.setBorrado("NO");
                    categoriaBEBIDA_CON_ALCOHOL.getSucursales().add(sucursal);

                    Subcategoria subcategoria110 = new Subcategoria();
                    subcategoria110.setCategoria(categoriaBEBIDA_CON_ALCOHOL);
                    subcategoria110.setNombre("Vino");
                    subcategoria110.getSucursales().add(sucursal);

                    Subcategoria subcategoria111 = new Subcategoria();
                    subcategoria111.setCategoria(categoriaBEBIDA_CON_ALCOHOL);
                    subcategoria111.setNombre("Cerveza");
                    subcategoria111.getSucursales().add(sucursal);

                    Subcategoria subcategoria112 = new Subcategoria();
                    subcategoria112.setCategoria(categoriaBEBIDA_CON_ALCOHOL);
                    subcategoria112.setNombre("Tragos");
                    subcategoria112.getSucursales().add(sucursal);

                    categoriaBEBIDA_CON_ALCOHOL.getSubcategorias().add(subcategoria110);
                    categoriaBEBIDA_CON_ALCOHOL.getSubcategorias().add(subcategoria111);
                    categoriaBEBIDA_CON_ALCOHOL.getSubcategorias().add(subcategoria112);

                    imagen = new Imagenes();
                    imagen.setNombre("alcohol.jpg");
                    imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoriaBEBIDA_CON_ALCOHOL.getNombre() + "/" + imagen.getNombre());
                    imagen.getCategorias().add(categoriaBEBIDA_CON_ALCOHOL);
                    imagen.getSucursales().add(sucursal);

                    categoriaBEBIDA_CON_ALCOHOL.getImagenes().add(imagen);

                    sucursal.getCategorias().add(categoriaBEBIDA_CON_ALCOHOL);

                    Medida medida = new Medida();
                    medida.setNombre("KILOGRAMOS");
                    medida.getSucursales().add(sucursal);
                    medida.setBorrado("NO");

                    sucursal.getMedidas().add(medida);

                    Medida medida1 = new Medida();
                    medida1.setNombre("GRAMOS");
                    medida1.getSucursales().add(sucursal);
                    medida1.setBorrado("NO");

                    sucursal.getMedidas().add(medida1);

                    Medida medida2 = new Medida();
                    medida2.setNombre("LITROS");
                    medida2.getSucursales().add(sucursal);
                    medida2.setBorrado("NO");

                    sucursal.getMedidas().add(medida2);

                    Medida medida3 = new Medida();
                    medida3.setNombre("CENTIMETROS CUBICOS");
                    medida3.getSucursales().add(sucursal);
                    medida3.setBorrado("NO");

                    sucursal.getMedidas().add(medida3);

                    Medida medida4 = new Medida();
                    medida4.setNombre("PAQUETES");
                    medida4.getSucursales().add(sucursal);
                    medida4.setBorrado("NO");

                    sucursal.getMedidas().add(medida4);

                    Medida medida5 = new Medida();
                    medida5.setNombre("UNIDADES");
                    medida5.getSucursales().add(sucursal);
                    medida5.setBorrado("NO");

                    sucursal.getMedidas().add(medida5);
                    
                    
                    /// ARTICULOS


                    ArticuloVenta articuloVenta = new ArticuloVenta();
                    articuloVenta.setCategoria();

                    imagen = new Imagenes();
                    imagen.setNombre("ACA BUSCA FOTO Y METELA EN LA CARPETA DE LAS IMAGESARTICULOS Y MANDALE EL MISMO NOMBRE.jpeg");
                    imagen.setRuta("http://localhost:8080/imagesArticulos/" + articuloVenta.getNombre() + "/" + imagen.getNombre());
                    imagen.getArticulosVenta().add(articuloVenta);
                    imagen.getSucursales().add(sucursal);
                    

                    PrivilegiosSucursales privilegio = new PrivilegiosSucursales();
                    privilegio.setNombre("Articulos de venta");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Artículos menú");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Clientes");
                    privilegio.setPermisos(Arrays.asList("READ", "DELETE", "ACTIVATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Stock");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Stock entrante");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Ingredientes");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Categorias");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Medidas");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Promociones");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Subcategorias");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Estadísticas");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Pedidos entrantes");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Pedidos aceptados");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Pedidos cocinados");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Pedidos entregados");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Pedidos en camino");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Empleados");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Sucursales");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Empresas");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    privilegio = new PrivilegiosSucursales();
                    privilegio.getSucursales().add(sucursal);
                    privilegio.setNombre("Roles");
                    privilegio.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                    sucursal.getPrivilegios().add(privilegio);

                    Roles rolCajero = new Roles();
                    rolCajero.setBorrado("NO");
                    rolCajero.setNombre("CAJERO");
                    rolCajero.getSucursales().add(sucursal);
                    sucursal.getRoles().add(rolCajero);

                    Roles rolLimpieza = new Roles();
                    rolLimpieza.setBorrado("NO");
                    rolLimpieza.setNombre("LIMPIEZA");
                    rolLimpieza.getSucursales().add(sucursal);

                    sucursal.getRoles().add(rolLimpieza);

                    Roles rolEncargado = new Roles();
                    rolEncargado.setNombre("ENCARGADO");
                    rolEncargado.setBorrado("NO");
                    rolEncargado.getSucursales().add(sucursal);

                    sucursal.getRoles().add(rolEncargado);

                    Roles rolMozo = new Roles();
                    rolMozo.setNombre("MOZO");
                    rolMozo.setBorrado("NO");
                    rolMozo.getSucursales().add(sucursal);

                    sucursal.getRoles().add(rolMozo);

                    Roles rolSupervisor = new Roles();
                    rolSupervisor.setNombre("SUPERVISOR");
                    rolSupervisor.setBorrado("NO");
                    rolSupervisor.getSucursales().add(sucursal);

                    sucursal.getRoles().add(rolSupervisor);

                    Roles rolManejoStock = new Roles();
                    rolManejoStock.setNombre("MANEJO_DE_STOCK");
                    rolManejoStock.setBorrado("NO");
                    rolManejoStock.getSucursales().add(sucursal);

                    sucursal.getRoles().add(rolManejoStock);

                    Roles rolBartender = new Roles();
                    rolBartender.setBorrado("NO");
                    rolBartender.setNombre("BARTENDER");
                    rolBartender.getSucursales().add(sucursal);

                    sucursal.getRoles().add(rolBartender);

                    Roles rolLavaplatos = new Roles();
                    rolLavaplatos.setNombre("LAVAPLATOS");
                    rolLavaplatos.setBorrado("NO");
                    rolLavaplatos.getSucursales().add(sucursal);

                    sucursal.getRoles().add(rolLavaplatos);

                    Roles rolDelivery = new Roles();
                    rolDelivery.setNombre("DELIVERY");
                    rolDelivery.setBorrado("NO");
                    rolDelivery.getSucursales().add(sucursal);

                    sucursal.getRoles().add(rolDelivery);

                    Roles rolAdministrativo = new Roles();
                    rolAdministrativo.setNombre("ADMINISTRATIVO");
                    rolAdministrativo.setBorrado("NO");
                    rolAdministrativo.getSucursales().add(sucursal);

                    sucursal.getRoles().add(rolAdministrativo);

                    Roles rolCocineroJefe = new Roles();
                    rolCocineroJefe.setNombre("COCINERO_JEFE");
                    rolCocineroJefe.setBorrado("NO");
                    rolCocineroJefe.getSucursales().add(sucursal);

                    sucursal.getRoles().add(rolCocineroJefe);

                    Roles rolCocineroAyudante = new Roles();
                    rolCocineroAyudante.setNombre("COCINERO_AYUDANTE");
                    rolCocineroAyudante.setBorrado("NO");
                    rolCocineroAyudante.getSucursales().add(sucursal);

                    sucursal.getRoles().add(rolCocineroAyudante);

                    empresa.getSucursales().add(sucursal);

                    empresaRepository.save(empresa);
                }

                // CARGA DE PEDIDOS Y CLIENTES


                Cliente cliente = new Cliente();
                cliente.setContraseña("123456");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615488541l);
                cliente.setFechaNacimiento(LocalDate.of(1991, 7, 4));
                cliente.setNombre("Juliana Vargas");

                Domicilio domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(1518);
                domicilio.setCalle("San martin");
                domicilio.setCodigoPostal(4485);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("COLONIA EL SALADO").get());

                cliente.getDomicilios().add(domicilio);

                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("123456");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615489123l);
                cliente.setFechaNacimiento(LocalDate.of(1992, 7, 4));
                cliente.setNombre("Raul Garcia");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(785);
                domicilio.setCalle("Belgrano");
                domicilio.setCodigoPostal(4874);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("MANANTIALES DE PEREDA").get());

                cliente.getDomicilios().add(domicilio);

                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("123456");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615489553l);
                cliente.setFechaNacimiento(LocalDate.of(2001, 8, 5));
                cliente.setNombre("Victor Heredia");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(123);
                domicilio.setCalle("San Juan");
                domicilio.setCodigoPostal(4174);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("LA TORTUGA").get());

                cliente.getDomicilios().add(domicilio);

                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("123456");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615484417l);
                cliente.setFechaNacimiento(LocalDate.of(1985, 7, 25));
                cliente.setNombre("Sofia Lopez");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(123);
                domicilio.setCalle("Rivadavia");
                domicilio.setCodigoPostal(5584);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("SAN MIGUEL DEL MONTE").get());

                cliente.getDomicilios().add(domicilio);

                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("123456");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615484417l);
                cliente.setFechaNacimiento(LocalDate.of(2002, 7, 25));
                cliente.setNombre("Manuel Lopez");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(537);
                domicilio.setCalle("Sarmiento");
                domicilio.setCodigoPostal(5514);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("BELEN DE ESCOBAR").get());

                cliente.getDomicilios().add(domicilio);

                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("abcdef");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615489592L);
                cliente.setFechaNacimiento(LocalDate.of(1985, 12, 15));
                cliente.setNombre("Maria Lopez");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(456);
                domicilio.setCalle("Córdoba");
                domicilio.setCodigoPostal(5500);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("COLONIA SAN LUIS").get());

                cliente.getDomicilios().add(domicilio);
                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("qwerty");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615489593L);
                cliente.setFechaNacimiento(LocalDate.of(1978, 3, 22));
                cliente.setNombre("Carlos Martinez");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(789);
                domicilio.setCalle("Rivadavia");
                domicilio.setCodigoPostal(4000);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("MOORES").get());

                cliente.getDomicilios().add(domicilio);
                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("pass1234");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615489594L);
                cliente.setFechaNacimiento(LocalDate.of(1993, 9, 5));
                cliente.setNombre("Ana Perez");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(321);
                domicilio.setCalle("Belgrano");
                domicilio.setCodigoPostal(5000);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("HUESO CLAVADO").get());

                cliente.getDomicilios().add(domicilio);
                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("mypassword");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615489595L);
                cliente.setFechaNacimiento(LocalDate.of(2000, 11, 10));
                cliente.setNombre("Lucia Fernandez");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(654);
                domicilio.setCalle("Mitre");
                domicilio.setCodigoPostal(4400);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("INGENIERO PABLO NOGUES").get());

                cliente.getDomicilios().add(domicilio);
                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("secure123");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615489596L);
                cliente.setFechaNacimiento(LocalDate.of(1989, 5, 18));
                cliente.setNombre("Federico Gomez");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(987);
                domicilio.setCalle("Las Heras");
                domicilio.setCodigoPostal(4600);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("GUAYMALLEN").get());

                cliente.getDomicilios().add(domicilio);
                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("hunter2");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615489597L);
                cliente.setFechaNacimiento(LocalDate.of(1975, 2, 28));
                cliente.setNombre("Gabriela Suarez");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(741);
                domicilio.setCalle("San Martin");
                domicilio.setCodigoPostal(4300);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("SAN SIMON").get());

                cliente.getDomicilios().add(domicilio);
                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("1234abcd");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615489598L);
                cliente.setFechaNacimiento(LocalDate.of(1997, 6, 30));
                cliente.setNombre("Diego Ramirez");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(258);
                domicilio.setCalle("Colon");
                domicilio.setCodigoPostal(5700);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("EL GLIPTODONTE").get());

                cliente.getDomicilios().add(domicilio);
                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("pass4321");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615489599L);
                cliente.setFechaNacimiento(LocalDate.of(1982, 4, 12));
                cliente.setNombre("Laura Diaz");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(159);
                domicilio.setCalle("Sarmiento");
                domicilio.setCodigoPostal(6200);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("LA BLANQUEADA").get());

                cliente.getDomicilios().add(domicilio);
                clienteRepository.save(cliente);

                cliente = new Cliente();
                cliente.setContraseña("abcdefg");
                cliente.setBorrado("NO");
                cliente.setTelefono(2615489600L);
                cliente.setFechaNacimiento(LocalDate.of(1990, 8, 20));
                cliente.setNombre("Sofia Lopez");

                domicilio = new Domicilio();
                domicilio.setCliente(cliente);
                domicilio.setNumero(852);
                domicilio.setCalle("9 de Julio");
                domicilio.setCodigoPostal(6600);
                domicilio.setBorrado("NO");
                domicilio.setLocalidad(localidadRepository.findByName("SAN GENARO").get());

                cliente.getDomicilios().add(domicilio);
                clienteRepository.save(cliente);

            } catch (Exception ignored) {
            }
        };
    }

    private Pais crearPais(String nombre) {
        Optional<Pais> paisDb = paisRepository.findByNombre(nombre);

        if (paisDb.isEmpty()) {
            Pais pais = new Pais();
            pais.setNombre(nombre);
            return pais;
        }

        return paisDb.get();
    }

    private void cargarDatos(String nombreLocalidad, String nombreDepartamento, String nombreProvincia, Pais pais) {
        crearProvincia(nombreProvincia, pais);
        Provincia provincia = pais.getProvincias().stream().filter(p -> p.getNombre().equals(nombreProvincia)).findFirst().orElse(null);
        // Una vez que la provincia se encuentra se crea el departamento asignado a esta provincia
        if (provincia != null) {
            crearDepartamento(nombreDepartamento, provincia);
            Departamento departamento = provincia.getDepartamentos().stream().filter(d -> d.getNombre().equals(nombreDepartamento)).findFirst().orElse(null);
            // Una vez que el departamento se encuentra se crea la localidad asignada a esta provincia
            if (departamento != null) {
                // Todos los valores se almacenan en Pais y sus hijos
                crearLocalidad(nombreLocalidad, departamento);
            }
        }
    }

    private void crearProvincia(String nombre, Pais pais) {
        // Buscamos si la provincia existe
        boolean provinciaExistente = pais.getProvincias().stream().anyMatch(provincia -> provincia.getNombre().equals(nombre));
        // Sino la creamos
        if (!provinciaExistente) {
            Provincia provinciaNueva = new Provincia();
            provinciaNueva.setNombre(nombre);
            provinciaNueva.setPais(pais);
            pais.getProvincias().add(provinciaNueva);
        }
    }

    private void crearDepartamento(String nombre, Provincia provincia) {
        boolean departamentoExistente = provincia.getDepartamentos().stream().anyMatch(departamento -> departamento.getNombre().equals(nombre));
        if (!departamentoExistente) {
            Departamento departamentoNuevo = new Departamento();
            departamentoNuevo.setNombre(nombre);
            departamentoNuevo.setProvincia(provincia);
            provincia.getDepartamentos().add(departamentoNuevo);
        }
    }

    private void crearLocalidad(String nombre, Departamento departamento) {
        boolean localidadExistente = departamento.getLocalidades().stream().anyMatch(localidad -> localidad.getNombre().equals(nombre));
        if (!localidadExistente) {
            Localidad localidadNueva = new Localidad();
            localidadNueva.setNombre(nombre);
            localidadNueva.setDepartamento(departamento);
            departamento.getLocalidades().add(localidadNueva);
        }
    }
}
