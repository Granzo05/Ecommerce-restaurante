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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    private final DomicilioRepository domicilioRepository;
    private final MedidaRepository medidaRepository;
    private final CategoriaRepository categoriaRepository;

    public SucursalController(SucursalRepository sucursalRepository, EmpleadoRepository empleadoRepository, ClienteRepository clienteRepository, EmpresaRepository empresaRepository, LocalidadDeliveryRepository localidadDeliveryRepository, DomicilioRepository domicilioRepository, MedidaRepository medidaRepository, CategoriaRepository categoriaRepository) {
        this.sucursalRepository = sucursalRepository;
        this.empleadoRepository = empleadoRepository;
        this.clienteRepository = clienteRepository;
        this.empresaRepository = empresaRepository;
        this.localidadDeliveryRepository = localidadDeliveryRepository;
        this.domicilioRepository = domicilioRepository;
        this.medidaRepository = medidaRepository;
        this.categoriaRepository = categoriaRepository;
    }


    @CrossOrigin
    @GetMapping("/sucursal/login/{email}/{password}")
    public SucursalDTO loginSucursal(@PathVariable("email") String email, @PathVariable("password") String password) throws Exception {
        return sucursalRepository.findByEmailAndPassword(email, Encrypt.cifrarPassword(password));
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
    @GetMapping("/sucursal/{idSucursal}")
    public Sucursal getSucursal(@PathVariable("idSucursal") Long idSucursal) throws Exception {
        Optional<Sucursal> sucursal = sucursalRepository.findById(idSucursal);

        if(sucursal.isPresent()) {
            return sucursal.get();
        }

        return null;
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
        Optional<Sucursal> sucursal = sucursalRepository.findByEmail(email);

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
        Optional<Sucursal> sucursalDB = sucursalRepository.findByEmail(sucursalDetails.getEmail());

        if (sucursalDB.isEmpty()) {
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

            for (MedidaDTO medidaDTO : medidas) {
                Medida medida = new Medida();
                medida.setNombre(medidaDTO.getNombre());
                medida.getSucursales().add(sucursalDetails);
                medida.setBorrado("NO");

                sucursalDetails.getMedidas().add(medida);
            }

            HashSet<CategoriaDTO> categorias = new HashSet<>(categoriaRepository.findAllDTOByIdSucursal(1l));

            for (CategoriaDTO categoriaDTO : categorias) {
                Categoria categoria = new Categoria();
                categoria.setNombre(categoriaDTO.getNombre());
                categoria.getSucursales().add(sucursalDetails);
                categoria.setBorrado("NO");

                sucursalDetails.getCategorias().add(categoria);
            }

            sucursalRepository.save(sucursalDetails);

            return ResponseEntity.ok("Carga con éxito");
        } else {
            return ResponseEntity.badRequest().body("Hay una sucursal cargada con ese email");
        }
    }

    @Transactional
    @PutMapping("/sucursal/update")
    public ResponseEntity<String> updateSucursal(@RequestBody Sucursal sucursalDetails) throws Exception {
        Optional<Sucursal> sucursalDb = sucursalRepository.findById(sucursalDetails.getId());
        if (sucursalDb.isPresent()) {
            Optional<Sucursal> sucursalEncontrada = sucursalRepository.findByEmail(sucursalDetails.getEmail());

            // Si no es la misma sucursal pero si el mismo email entonces ejecuta esto
            if (sucursalEncontrada.isPresent() && sucursalDb.get().getId() != sucursalEncontrada.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe una sucursal con ese email");
            }

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
