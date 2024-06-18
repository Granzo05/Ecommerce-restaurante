package main;

import main.EncryptMD5.Encrypt;
import main.entities.Domicilio.*;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.Medida;
import main.entities.Ingredientes.Subcategoria;
import main.entities.Productos.Imagenes;
import main.entities.Restaurante.*;
import main.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.mail.MessagingException;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalTime;
import java.util.Arrays;
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
    private PrivilegiosRepository privilegiosRepository;
    @Autowired(required = true)
    private EmpleadoRepository empleadoRepository;

    public static void main(String[] args) throws GeneralSecurityException, IOException, MessagingException {
        SpringApplication.run(Main.class, args);
    }

    @Bean
    CommandLineRunner init() {
        return args -> {

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

                Domicilio domicilio = new Domicilio();
                domicilio.setNumero(774);
                domicilio.setCalle("San martin");
                domicilio.setCodigoPostal(4441);
                Optional<Localidad> localidad = localidadRepository.findByName("GODOY CRUZ");
                domicilio.setLocalidad(localidad.get());
                domicilio.setSucursal(sucursal);
                sucursal.getDomicilios().add(domicilio);

                Categoria categoria = new Categoria();
                categoria.setNombre("HAMBURGUESAS");
                categoria.setBorrado("NO");
                categoria.getSucursales().add(sucursal);

                Subcategoria subcategoria0 = new Subcategoria();
                subcategoria0.setCategoria(categoria);
                subcategoria0.setNombre("Stress cheddar");
                subcategoria0.getSucursales().add(sucursal);

                Subcategoria subcategoria1 = new Subcategoria();
                subcategoria1.setCategoria(categoria);
                subcategoria1.setNombre("Actitud positiva");
                subcategoria1.getSucursales().add(sucursal);

                Subcategoria subcategoria2 = new Subcategoria();
                subcategoria2.setCategoria(categoria);
                subcategoria2.setNombre("Demichelis la concha de tu madre");
                subcategoria2.getSucursales().add(sucursal);

                categoria.getSubcategorias().add(subcategoria0);
                categoria.getSubcategorias().add(subcategoria1);
                categoria.getSubcategorias().add(subcategoria2);

                Imagenes imagen = new Imagenes();
                imagen.setNombre("hamburguesas.png");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria);
                imagen.getSucursales().add(sucursal);

                categoria.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria);

                Categoria categoria1 = new Categoria();
                categoria1.setNombre("PANCHOS");
                categoria1.setBorrado("NO");
                categoria1.getSucursales().add(sucursal);

                Subcategoria subcategoria10 = new Subcategoria();
                subcategoria10.setCategoria(categoria1);
                subcategoria10.setNombre("Completo");
                subcategoria10.getSucursales().add(sucursal);

                Subcategoria subcategoria11 = new Subcategoria();
                subcategoria11.setCategoria(categoria1);
                subcategoria11.setNombre("Con poncho");
                subcategoria11.getSucursales().add(sucursal);

                Subcategoria subcategoria12 = new Subcategoria();
                subcategoria12.setCategoria(categoria1);
                subcategoria12.setNombre("Doble");
                subcategoria12.getSucursales().add(sucursal);

                categoria1.getSubcategorias().add(subcategoria10);
                categoria1.getSubcategorias().add(subcategoria11);
                categoria1.getSubcategorias().add(subcategoria12);

                imagen = new Imagenes();
                imagen.setNombre("panchos.webp");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria1.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria1);
                imagen.getSucursales().add(sucursal);

                categoria1.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria1);

                Categoria categoria2 = new Categoria();
                categoria2.setNombre("EMPANADAS");
                categoria2.setBorrado("NO");
                categoria2.getSucursales().add(sucursal);

                Subcategoria subcategoria20 = new Subcategoria();
                subcategoria20.setCategoria(categoria2);
                subcategoria20.setNombre("Jamón y queso");
                subcategoria20.getSucursales().add(sucursal);

                Subcategoria subcategoria21 = new Subcategoria();
                subcategoria21.setCategoria(categoria2);
                subcategoria21.setNombre("Carne");
                subcategoria21.getSucursales().add(sucursal);

                Subcategoria subcategoria22 = new Subcategoria();
                subcategoria22.setCategoria(categoria2);
                subcategoria22.setNombre("Cebolla");
                subcategoria22.getSucursales().add(sucursal);

                categoria2.getSubcategorias().add(subcategoria20);
                categoria2.getSubcategorias().add(subcategoria21);
                categoria2.getSubcategorias().add(subcategoria22);

                imagen = new Imagenes();
                imagen.setNombre("empanadas.jpg");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria2.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria2);
                imagen.getSucursales().add(sucursal);

                categoria2.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria2);

                Categoria categoria3 = new Categoria();
                categoria3.setNombre("PIZZAS");
                categoria3.setBorrado("NO");
                categoria3.getSucursales().add(sucursal);

                Subcategoria subcategoria30 = new Subcategoria();
                subcategoria30.setCategoria(categoria3);
                subcategoria30.setNombre("A la piedra");
                subcategoria30.getSucursales().add(sucursal);

                Subcategoria subcategoria31 = new Subcategoria();
                subcategoria31.setCategoria(categoria3);
                subcategoria31.setNombre("A la masa");
                subcategoria31.getSucursales().add(sucursal);

                Subcategoria subcategoria32 = new Subcategoria();
                subcategoria32.setCategoria(categoria3);
                subcategoria32.setNombre("Media");
                subcategoria32.getSucursales().add(sucursal);

                categoria3.getSubcategorias().add(subcategoria30);
                categoria3.getSubcategorias().add(subcategoria31);
                categoria3.getSubcategorias().add(subcategoria32);

                imagen = new Imagenes();
                imagen.setNombre("pizzas.png");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria3.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria3);
                imagen.getSucursales().add(sucursal);

                categoria3.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria3);

                Categoria categoria4 = new Categoria();
                categoria4.setNombre("LOMOS");
                categoria4.setBorrado("NO");
                categoria4.getSucursales().add(sucursal);

                Subcategoria subcategoria40 = new Subcategoria();
                subcategoria40.setCategoria(categoria4);
                subcategoria40.setNombre("Cerdo");
                subcategoria40.getSucursales().add(sucursal);

                Subcategoria subcategoria41 = new Subcategoria();
                subcategoria41.setCategoria(categoria4);
                subcategoria41.setNombre("Carne");
                subcategoria41.getSucursales().add(sucursal);

                Subcategoria subcategoria42 = new Subcategoria();
                subcategoria42.setCategoria(categoria4);
                subcategoria42.setNombre("Pollo");
                subcategoria42.getSucursales().add(sucursal);

                categoria4.getSubcategorias().add(subcategoria40);
                categoria4.getSubcategorias().add(subcategoria41);
                categoria4.getSubcategorias().add(subcategoria42);

                imagen = new Imagenes();
                imagen.setNombre("lomos.avif");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria4.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria4);
                imagen.getSucursales().add(sucursal);

                categoria4.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria4);

                Categoria categoria5 = new Categoria();
                categoria5.setNombre("HELADO");
                categoria5.setBorrado("NO");
                categoria5.getSucursales().add(sucursal);

                Subcategoria subcategoria50 = new Subcategoria();
                subcategoria50.setCategoria(categoria5);
                subcategoria50.setNombre("A la crema");
                subcategoria50.getSucursales().add(sucursal);

                Subcategoria subcategoria51 = new Subcategoria();
                subcategoria51.setCategoria(categoria5);
                subcategoria51.setNombre("Al agua");
                subcategoria51.getSucursales().add(sucursal);

                categoria5.getSubcategorias().add(subcategoria50);
                categoria5.getSubcategorias().add(subcategoria51);

                imagen = new Imagenes();
                imagen.setNombre("helados.jpg");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria5.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria5);
                imagen.getSucursales().add(sucursal);

                categoria5.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria5);

                Categoria categoria6 = new Categoria();
                categoria6.setNombre("PARRILLA");
                categoria6.setBorrado("NO");
                categoria6.getSucursales().add(sucursal);

                Subcategoria subcategoria60 = new Subcategoria();
                subcategoria60.setCategoria(categoria6);
                subcategoria60.setNombre("Vacio a la llama");
                subcategoria60.getSucursales().add(sucursal);

                Subcategoria subcategoria61 = new Subcategoria();
                subcategoria60.setCategoria(categoria6);
                subcategoria60.setNombre("Cordero a la llama");
                subcategoria60.getSucursales().add(sucursal);

                Subcategoria subcategoria62 = new Subcategoria();
                subcategoria60.setCategoria(categoria6);
                subcategoria60.setNombre("Costillar a la llama");
                subcategoria60.getSucursales().add(sucursal);

                categoria6.getSubcategorias().add(subcategoria60);
                categoria6.getSubcategorias().add(subcategoria61);
                categoria6.getSubcategorias().add(subcategoria62);

                imagen = new Imagenes();
                imagen.setNombre("parrilla.avif");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria6.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria6);
                imagen.getSucursales().add(sucursal);

                categoria6.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria6);

                Categoria categoria7 = new Categoria();
                categoria7.setNombre("PASTAS");
                categoria7.setBorrado("NO");
                categoria7.getSucursales().add(sucursal);

                Subcategoria subcategoria70 = new Subcategoria();
                subcategoria70.setCategoria(categoria7);
                subcategoria70.setNombre("Peronista (Ñoquis)");
                subcategoria70.getSucursales().add(sucursal);

                Subcategoria subcategoria71 = new Subcategoria();
                subcategoria71.setCategoria(categoria7);
                subcategoria71.setNombre("Di Maria (Fideos)");
                subcategoria71.getSucursales().add(sucursal);

                Subcategoria subcategoria72 = new Subcategoria();
                subcategoria72.setCategoria(categoria7);
                subcategoria72.setNombre("Ravioles");
                subcategoria72.getSucursales().add(sucursal);

                categoria7.getSubcategorias().add(subcategoria70);
                categoria7.getSubcategorias().add(subcategoria71);
                categoria7.getSubcategorias().add(subcategoria72);

                imagen = new Imagenes();
                imagen.setNombre("pastas.jpeg");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria7.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria7);
                imagen.getSucursales().add(sucursal);

                categoria7.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria7);

                Categoria categoria8 = new Categoria();
                categoria8.setNombre("SUSHI");
                categoria8.setBorrado("NO");
                categoria8.getSucursales().add(sucursal);

                imagen = new Imagenes();
                imagen.setNombre("sushi.jpg");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria8.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria8);
                imagen.getSucursales().add(sucursal);

                categoria8.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria8);

                Categoria categoria9 = new Categoria();
                categoria9.setNombre("MILANESAS");
                categoria9.setBorrado("NO");
                categoria9.getSucursales().add(sucursal);

                imagen = new Imagenes();
                imagen.setNombre("milanesas.png");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria9.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria9);
                imagen.getSucursales().add(sucursal);

                categoria9.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria9);

                Categoria categoria10 = new Categoria();
                categoria10.setNombre("BEBIDA_SIN_ALCOHOL");
                categoria10.setBorrado("NO");
                categoria10.getSucursales().add(sucursal);

                Subcategoria subcategoria100 = new Subcategoria();
                subcategoria100.setCategoria(categoria10);
                subcategoria100.setNombre("Gaseosas");
                subcategoria100.getSucursales().add(sucursal);

                Subcategoria subcategoria101 = new Subcategoria();
                subcategoria101.setCategoria(categoria10);
                subcategoria101.setNombre("Agua");
                subcategoria101.getSucursales().add(sucursal);

                Subcategoria subcategoria102 = new Subcategoria();
                subcategoria102.setCategoria(categoria10);
                subcategoria102.setNombre("Gaseosas sin azúcar");
                subcategoria102.getSucursales().add(sucursal);

                categoria10.getSubcategorias().add(subcategoria100);
                categoria10.getSubcategorias().add(subcategoria101);
                categoria10.getSubcategorias().add(subcategoria102);

                imagen = new Imagenes();
                imagen.setNombre("sin-alcohol.jpg");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria10.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria10);
                imagen.getSucursales().add(sucursal);

                categoria10.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria10);

                Categoria categoria11 = new Categoria();
                categoria11.setNombre("BEBIDA_CON_ALCOHOL");
                categoria11.setBorrado("NO");
                categoria11.getSucursales().add(sucursal);

                Subcategoria subcategoria110 = new Subcategoria();
                subcategoria110.setCategoria(categoria11);
                subcategoria110.setNombre("Vino");
                subcategoria110.getSucursales().add(sucursal);

                Subcategoria subcategoria111 = new Subcategoria();
                subcategoria111.setCategoria(categoria11);
                subcategoria111.setNombre("Cerveza");
                subcategoria111.getSucursales().add(sucursal);

                Subcategoria subcategoria112 = new Subcategoria();
                subcategoria112.setCategoria(categoria11);
                subcategoria112.setNombre("Tragos");
                subcategoria112.getSucursales().add(sucursal);

                categoria11.getSubcategorias().add(subcategoria110);
                categoria11.getSubcategorias().add(subcategoria111);
                categoria11.getSubcategorias().add(subcategoria112);

                imagen = new Imagenes();
                imagen.setNombre("alcohol.jpg");
                imagen.setRuta("http://localhost:8080/imagesCategoria/" + categoria11.getNombre() + "/" + imagen.getNombre());
                imagen.getCategorias().add(categoria11);
                imagen.getSucursales().add(sucursal);

                categoria11.getImagenes().add(imagen);

                sucursal.getCategorias().add(categoria11);

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
                medida3.setNombre("CENTIMETROS_CUBICOS");
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

                Empleado empleado = new Empleado();
                empleado.setContraseña("123456789");
                empleado.setEmail("pepe@gmail.com");
                empleado.getSucursales().add(sucursal);

                EmpleadoPrivilegio empleadoPrivilegio = new EmpleadoPrivilegio();
                empleadoPrivilegio.setEmpleado(empleado);

                Privilegios privilegios = new Privilegios();
                privilegios.setTarea("Articulos de venta");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Artículos menú");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Stock");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Stock entrante");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Ingredientes");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Categorias");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Medidas");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Promociones");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Subcategorias");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Estadísticas");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Pedidos entrantes");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Pedidos aceptados");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Pedidos cocinados");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Pedidos entregados");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Pedidos en camino");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Empleados");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Sucursales");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                privilegios = new Privilegios();
                privilegios.setTarea("Empresas");
                privilegios.setPermisos(Arrays.asList("READ", "UPDATE", "DELETE", "ACTIVATE", "CREATE"));

                privilegios = privilegiosRepository.save(privilegios);
                empleadoPrivilegio.setPrivilegio(privilegios);
                empleado.getEmpleadoPrivilegios().add(empleadoPrivilegio);

                //empleado = empleadoRepository.save(empleado);

                sucursal.getEmpleados().add(empleado);

                empresa.getSucursales().add(sucursal);

                empresaRepository.save(empresa);
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
