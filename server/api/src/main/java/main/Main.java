package main;

import main.controllers.EncryptMD5.Encrypt;
import main.entities.Domicilio.*;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.Medida;
import main.entities.Restaurante.Empresa;
import main.entities.Restaurante.Sucursal;
import main.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.mail.MessagingException;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalTime;
import java.util.Optional;

@SpringBootApplication
@EntityScan("main.entities")
@ComponentScan(basePackages = {"main.controllers", "main.repositories", "main.*"})
public class Main {
    public static void main(String[] args) throws GeneralSecurityException, IOException, MessagingException {
        SpringApplication.run(Main.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:5173/")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("Origin", "Content-Type", "Accept", "Authorization")
                        .allowCredentials(true);

            }
        };
    }

    @Autowired(required = true)
    private PaisRepository paisRepository;
    @Autowired(required = true)
    private ProvinciaRepository provinciaRepository;
    @Autowired(required = true)
    private LocalidadRepository localidadRepository;
    @Autowired(required = true)
    private EmpresaRepository empresaRepository;
    @Autowired(required = true)
    private CategoriaRepository categoriaRepository;
    @Autowired(required = true)
    private MedidaRepository medidaRepository;
    private final String RUTACSV = "C://Buen-sabor//buen-sabor-app-typescript-react//server//api//src//main//resources//localidades.csv";
    private final String SEPARACIONCSV = ";";

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
                empresa.setCuit("201234566");
                empresa.setRazonSocial("El buen sabor");

                Sucursal sucursal = new Sucursal();
                sucursal.setEmpresa(empresa);
                sucursal.setHorarioApertura(LocalTime.of(18, 0));
                sucursal.setHorarioCierre(LocalTime.of(23, 0));
                sucursal.setEmail("a@gmail.com");
                sucursal.setPrivilegios("negocio");
                sucursal.setContraseña(Encrypt.cifrarPassword("123"));

                Domicilio domicilio = new Domicilio();
                domicilio.setNumero(774);
                domicilio.setCalle(Encrypt.encriptarString("San martin"));
                domicilio.setCodigoPostal(4441);
                Optional<Localidad> localidad = localidadRepository.findById(5906l);
                domicilio.setLocalidad(localidad.get());
                domicilio.setSucursal(sucursal);

                sucursal.setDomicilio(domicilio);

                Categoria categoria = new Categoria();
                categoria.setDenominacion("HAMBURGUESAS");
                categoria.setBorrado("NO");
                categoria.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria);

                Categoria categoria1 = new Categoria();
                categoria1.setDenominacion("PANCHOS");
                categoria1.setBorrado("NO");
                categoria1.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria1);

                Categoria categoria2 = new Categoria();
                categoria2.setDenominacion("EMPANADAS");
                categoria2.setBorrado("NO");
                categoria2.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria2);

                Categoria categoria3 = new Categoria();
                categoria3.setDenominacion("PIZZAS");
                categoria3.setBorrado("NO");
                categoria3.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria3);

                Categoria categoria4 = new Categoria();
                categoria4.setDenominacion("LOMOS");
                categoria4.setBorrado("NO");
                categoria4.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria4);

                Categoria categoria5 = new Categoria();
                categoria5.setDenominacion("HELADO");
                categoria5.setBorrado("NO");
                categoria5.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria5);

                Categoria categoria6 = new Categoria();
                categoria6.setDenominacion("PARRILLA");
                categoria6.setBorrado("NO");
                categoria6.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria6);

                Categoria categoria7 = new Categoria();
                categoria7.setDenominacion("PASTAS");
                categoria7.setBorrado("NO");
                categoria7.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria7);

                Categoria categoria8 = new Categoria();
                categoria8.setDenominacion("SUSHI");
                categoria8.setBorrado("NO");
                categoria8.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria8);

                Categoria categoria9 = new Categoria();
                categoria9.setDenominacion("MILANESAS");
                categoria9.setBorrado("NO");
                categoria9.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria9);

                Categoria categoria10 = new Categoria();
                categoria10.setDenominacion("BEBIDA_SIN_ALCOHOL");
                categoria10.setBorrado("NO");
                categoria10.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria10);

                Categoria categoria11 = new Categoria();
                categoria11.setDenominacion("BEBIDA_CON_ALCOHOL");
                categoria11.setBorrado("NO");
                categoria11.getSucursales().add(sucursal);
                sucursal.getCategorias().add(categoria11);

                Medida medida = new Medida();
                medida.setDenominacion("KILOGRAMOS");
                medida.getSucursales().add(sucursal);
                medida.setBorrado("NO");
                sucursal.getMedidas().add(medida);

                Medida medida1 = new Medida();
                medida1.setDenominacion("GRAMOS");
                medida1.getSucursales().add(sucursal);
                medida1.setBorrado("NO");
                sucursal.getMedidas().add(medida1);

                Medida medida2 = new Medida();
                medida2.setDenominacion("LITROS");
                medida2.getSucursales().add(sucursal);
                medida2.setBorrado("NO");
                sucursal.getMedidas().add(medida2);

                Medida medida3 = new Medida();
                medida3.setDenominacion("CENTIMETROS_CUBICOS");
                medida3.getSucursales().add(sucursal);
                medida3.setBorrado("NO");
                sucursal.getMedidas().add(medida3);

                Medida medida4 = new Medida();
                medida4.setDenominacion("PAQUETES");
                medida4.getSucursales().add(sucursal);
                medida4.setBorrado("NO");
                sucursal.getMedidas().add(medida4);

                Medida medida5 = new Medida();
                medida5.setDenominacion("UNIDADES");
                medida5.getSucursales().add(sucursal);
                medida5.setBorrado("NO");
                sucursal.getMedidas().add(medida5);

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
