package main.controllers;

import jakarta.transaction.Transactional;
import main.controllers.EncryptMD5.Encrypt;
import main.entities.Cliente.Cliente;
import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.DomicilioDTO;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.CategoriaDTO;
import main.entities.Ingredientes.Medida;
import main.entities.Ingredientes.MedidaDTO;
import main.entities.Restaurante.*;
import main.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class SucursalController {
    private final SucursalRepository sucursalRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ClienteRepository clienteRepository;
    private final EmpresaRepository empresaRepository;
    private final LocalidadDeliveryRepository localidadDeliveryRepository;
    private final FechaContratacionRepository fechaContratacionRepository;
    private final DomicilioRepository domicilioRepository;
    private final LocalidadRepository localidadRepository;
    private final DepartamentoRepository departamentoRepository;
    private final ProvinciaRepository provinciaRepository;
    private final MedidaRepository medidaRepository;
    private final CategoriaRepository categoriaRepository;


    public SucursalController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, ClienteRepository clienteRepository, EmpresaRepository empresaRepository, LocalidadDeliveryRepository localidadDeliveryRepository, FechaContratacionRepository fechaContratacionRepository, DomicilioRepository domicilioRepository, LocalidadRepository localidadRepository, DepartamentoRepository departamentoRepository, ProvinciaRepository provinciaRepository, MedidaRepository medidaRepository, CategoriaRepository categoriaRepository) {
        this.sucursalRepository = sucursalRepository;
        this.empleadoRepository = empleadoRepository;
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
        this.localidadDeliveryRepository = localidadDeliveryRepository;
        this.fechaContratacionRepository = fechaContratacionRepository;
        this.domicilioRepository = domicilioRepository;
        this.localidadRepository = localidadRepository;
        this.departamentoRepository = departamentoRepository;
        this.provinciaRepository = provinciaRepository;
        this.medidaRepository = medidaRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @CrossOrigin
    @GetMapping("/sucursal/login/{email}/{password}")
    public SucursalDTO loginSucursal(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        return sucursalRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
    }

    @CrossOrigin
    @GetMapping("/empleado/login/{email}/{password}")
    public EmpleadoDTO loginEmpleado(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        Optional<EmpleadoDTO> empleadoDb = empleadoRepository.findByEmailAndPassword(Encrypt.encriptarString(email), Encrypt.cifrarPassword(password));

        if (empleadoDb.isPresent()) {
            EmpleadoDTO empleado = empleadoDb.get();

            empleado.setNombre(Encrypt.desencriptarString(empleado.getNombre()));
            empleado.setEmail(Encrypt.desencriptarString(empleado.getEmail()));
            empleado.setCuil(Encrypt.desencriptarString(empleado.getCuil()));
        }

        return empleadoDb.get();
    }

    @CrossOrigin
    @GetMapping("/sucursales")
    public Set<SucursalDTO> getSucursales() throws Exception {
        List<SucursalDTO> sucursales = sucursalRepository.findAllDTO();

        for (SucursalDTO sucursal : sucursales) {
            DomicilioDTO domicilio = domicilioRepository.findByIdSucursal(sucursal.getId());

            domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));

            sucursal.setDomicilio(domicilio);
            sucursal.setLocalidadesDisponiblesDelivery(localidadDeliveryRepository.findByIdSucursal(sucursal.getId()));
        }

        return new HashSet<>(sucursales);
    }

    @CrossOrigin
    @GetMapping("/localidades/delivery/sucursal/{id}")
    public Set<LocalidadDelivery> getLocalidadesDeliverySucursal(@PathVariable("id") Long id) throws Exception {
        List<LocalidadDelivery> localidades = sucursalRepository.findLocalidadesByIdSucursal(id);

        return new HashSet<>(localidades);
    }

    @CrossOrigin
    @GetMapping("/check/{email}")
    public boolean checkPrivilegios(@PathVariable("email") String email) {
        Sucursal sucursal = sucursalRepository.findByEmail(email);

        // Sucursal tiene acceso a todo, por lo tanto si el email coincide entonces se concede acceso
        if (sucursal != null) {
            return true;
        }

        // Recibo un email y para chequear si se puede dar acceso o no
        Optional<Cliente> cliente = clienteRepository.findByEmail(email);
        // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
        if (cliente.isPresent()) {
            return false;
        }

        Optional<Empleado> empleado = empleadoRepository.findByEmail(email);
        // De entrada un cliente no va a poder acceder, asi que si el email coincide se descarta automaticamente
        if (empleado.isPresent()) {
            return true;
        }

        return false;
    }

    @PostMapping("/sucursal/create")
    @Transactional
    public ResponseEntity<String> crearSucursal(@RequestBody Sucursal sucursalDetails) throws Exception {
        Sucursal sucursalDB = sucursalRepository.findByEmail(sucursalDetails.getEmail());

        if (sucursalDB == null) {
            Domicilio domicilio = new Domicilio();
            domicilio.setCalle(Encrypt.encriptarString(sucursalDetails.getDomicilio().getCalle()));
            domicilio.setLocalidad(sucursalDetails.getDomicilio().getLocalidad());
            domicilio.setNumero(sucursalDetails.getDomicilio().getNumero());
            domicilio.setCodigoPostal(sucursalDetails.getDomicilio().getCodigoPostal());
            domicilio.setSucursal(sucursalDetails);

            sucursalDetails.setDomicilio(domicilio);

            sucursalDetails.setContraseña(Encrypt.cifrarPassword(sucursalDetails.getContraseña()));

            sucursalDetails.setHorarioApertura(LocalTime.parse(sucursalDetails.getHorarioApertura().toString()));
            sucursalDetails.setHorarioCierre(LocalTime.parse(sucursalDetails.getHorarioCierre().toString()));
            sucursalDetails.setPrivilegios("negocio");

            Empresa empresa = empresaRepository.findById(1l).get();

            sucursalDetails.setEmpresa(empresa);
            sucursalDetails.setBorrado("NO");
            for (LocalidadDelivery localidad : sucursalDetails.getLocalidadesDisponiblesDelivery()) {
                localidad.setSucursal(sucursalDetails);
            }

            HashSet<MedidaDTO> medidas = new HashSet<>(medidaRepository.findAllDTOByIdSucursal(1l));

            for (MedidaDTO medidaDTO: medidas) {
                Medida medida = new Medida();
                medida.setDenominacion(medidaDTO.getDenominacion());
                medida.getSucursales().add(sucursalDetails);
                medida.setBorrado("NO");

                sucursalDetails.getMedidas().add(medida);
            }

            HashSet<CategoriaDTO> categorias = new HashSet<>(categoriaRepository.findAllDTOByIdSucursal(1l));

            for (CategoriaDTO categoriaDTO: categorias) {
                Categoria categoria = new Categoria();
                categoria.setDenominacion(categoriaDTO.getDenominacion());
                categoria.getSucursales().add(sucursalDetails);
                categoria.setBorrado("NO");

                sucursalDetails.getCategorias().add(categoria);
            }

            sucursalRepository.save(sucursalDetails);

            return ResponseEntity.ok("Carga con éxito");
        } else {
            return ResponseEntity.ofNullable("Hay una sucursal cargada con ese correo");
        }
    }

    @Transactional
    @PostMapping("/empleado/create")
    public ResponseEntity<String> crearEmpleado(@RequestBody Empleado empleadoDetails) throws Exception {
        Optional<Empleado> empleadoDB = empleadoRepository.findByCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

        if (empleadoDB.isEmpty()) {
            empleadoDetails.setNombre(Encrypt.encriptarString(empleadoDetails.getNombre()));

            empleadoDetails.setEmail(Encrypt.encriptarString(empleadoDetails.getEmail()));

            empleadoDetails.setContraseña(Encrypt.cifrarPassword(empleadoDetails.getContraseña()));

            for (Domicilio domicilio : empleadoDetails.getDomicilios()) {
                domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
                domicilio.setEmpleado(empleadoDetails);
            }

            empleadoDetails.setSucursal(sucursalRepository.findById(empleadoDetails.getSucursal().getId()).get());
            empleadoDetails.setCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

            FechaContratacionEmpleado fecha = new FechaContratacionEmpleado();
            fecha.setEmpleado(empleadoDetails);
            empleadoDetails.getFechaContratacion().add(fecha);
            empleadoDetails.setBorrado("NO");

            empleadoRepository.save(empleadoDetails);

            return ResponseEntity.ok("Carga con exito");
        } else {
            return ResponseEntity.ofNullable("Ya existe un empleado con ese cuil");
        }
    }

    @GetMapping("/empleados")
    public Set<EmpleadoDTO> getEmpleados() throws Exception {

        List<EmpleadoDTO> empleados = empleadoRepository.findAllDTO();

        for (EmpleadoDTO empleado : empleados) {
            empleado.setNombre(Encrypt.desencriptarString(empleado.getNombre()));
            empleado.setEmail(Encrypt.desencriptarString(empleado.getEmail()));
            empleado.setCuil(Encrypt.desencriptarString(empleado.getCuil()));

            List<DomicilioDTO> domicilios = domicilioRepository.findByIdEmpleadoDTO(empleado.getId());

            for (DomicilioDTO domicilio : domicilios) {
                domicilio.setCalle(Encrypt.desencriptarString(domicilio.getCalle()));
            }

            empleado.setDomicilios(new HashSet<>(domicilios));

            empleado.setFechaContratacionEmpleado(new HashSet<>(fechaContratacionRepository.findByIdEmpleado(empleado.getId())));
        }

        return new HashSet<>(empleados);
    }


    @Transactional
    @PutMapping("/empleado/update")
    public ResponseEntity<String> updateEmpleado(@RequestBody Empleado empleadoDetails) throws Exception {
        Optional<Empleado> empleadoOptional = empleadoRepository.findById(empleadoDetails.getId());

        if (empleadoOptional.isPresent() && empleadoOptional.get().getBorrado().equals(empleadoDetails.getBorrado())) {
            // Comparo cada uno de los datos a ver si ha cambiado, ya que clienteDetails viene de un DTO y no contiene los mismos datos del empleadoDB entonces hay valores nulos
            Empleado empleadoDb = empleadoOptional.get();

            String contraseña = empleadoDetails.getContraseña();
            if (contraseña != null && !contraseña.isEmpty()) {
                empleadoDb.setContraseña(Encrypt.cifrarPassword(contraseña));
            }

            String nombre = empleadoDetails.getNombre();
            empleadoDb.setNombre(Encrypt.encriptarString(nombre));


            Long telefono = empleadoDetails.getTelefono();
            empleadoDb.setTelefono(telefono);


            String email = empleadoDetails.getEmail();
            empleadoDb.setEmail(Encrypt.encriptarString(email));


            LocalDate fechaNacimiento = empleadoDetails.getFechaNacimiento();
            empleadoDb.setFechaNacimiento(fechaNacimiento);

            empleadoDb.setSucursal(sucursalRepository.findById(empleadoDetails.getSucursal().getId()).get());

            empleadoDb.setCuil(Encrypt.encriptarString(empleadoDetails.getCuil()));

            domicilioRepository.deleteAllByEmpleadoId(empleadoDb.getId());
            empleadoDetails.getDomicilios().size();
            for (Domicilio domicilio : empleadoDetails.getDomicilios()) {
                domicilio.setCalle(Encrypt.encriptarString(domicilio.getCalle()));
                domicilio.setEmpleado(empleadoDetails);
                empleadoDb.getDomicilios().add(domicilio);
            }

            empleadoRepository.save(empleadoDb);

            return ResponseEntity.ok("El empleado se modificó correctamente");
        } else if (empleadoOptional.isPresent() && !empleadoOptional.get().getBorrado().equals(empleadoDetails.getBorrado())) {
            empleadoOptional.get().setBorrado(empleadoDetails.getBorrado());

            empleadoRepository.save(empleadoOptional.get());

            return ResponseEntity.ok("El empleado se modificó correctamente");
        }

        return ResponseEntity.ok("El empleado no se encontró");

    }

    @Transactional
    @PutMapping("/sucursal/update")
    public ResponseEntity<String> updateSucursal(@RequestBody Sucursal sucursalDetails) throws Exception {
        Optional<Sucursal> sucursalDb = sucursalRepository.findById(sucursalDetails.getId());
        System.out.println(sucursalDetails.getId());

        if (sucursalDb.isPresent()) {
            Sucursal sucursal = sucursalDb.get();

            if (sucursal.getBorrado().equals(sucursalDetails.getBorrado())) {
                // Actualizar domicilio
                sucursal.getDomicilio().setCalle(Encrypt.encriptarString(sucursalDetails.getDomicilio().getCalle()));
                sucursal.getDomicilio().setLocalidad(sucursalDetails.getDomicilio().getLocalidad());
                sucursal.getDomicilio().setNumero(sucursalDetails.getDomicilio().getNumero());
                sucursal.getDomicilio().setSucursal(sucursalDetails);
                sucursal.getDomicilio().setCodigoPostal(sucursalDetails.getDomicilio().getCodigoPostal());

                // Actualizar contraseña
                if (sucursalDetails.getContraseña().length() > 1) {
                    sucursal.setContraseña(Encrypt.cifrarPassword(sucursalDetails.getContraseña()));
                }

                // Actualizar horarios
                sucursal.setHorarioApertura(LocalTime.parse(sucursalDetails.getHorarioApertura().toString()));
                sucursal.setHorarioCierre(LocalTime.parse(sucursalDetails.getHorarioCierre().toString()));

                // Borrar todas las localidades
                localidadDeliveryRepository.deleteAllBySucursalId(sucursal.getId());

                // Agregar nuevas localidades
                Set<LocalidadDelivery> nuevasLocalidades = new HashSet<>();
                for (LocalidadDelivery localidad : sucursalDetails.getLocalidadesDisponiblesDelivery()) {
                    localidad.setSucursal(sucursal);
                    nuevasLocalidades.add(localidad);
                }
                sucursal.setLocalidadesDisponiblesDelivery(nuevasLocalidades);

                // Actualizar otros campos
                sucursal.setEmail(sucursalDetails.getEmail());
                sucursal.setTelefono(sucursalDetails.getTelefono());

                sucursalRepository.save(sucursal);

                return ResponseEntity.ok("La sucursal se actualizó correctamente");
            } else {
                sucursal.setBorrado(sucursalDetails.getBorrado());
                sucursalRepository.save(sucursal);
                return ResponseEntity.ok("La sucursal se actualizó correctamente");
            }
        } else {
            return ResponseEntity.ok("La sucursal no se encontró");
        }
    }
}
