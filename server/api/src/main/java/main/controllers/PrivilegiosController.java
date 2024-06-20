package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Restaurante.Privilegios;
import main.entities.Restaurante.PrivilegiosSucursales;
import main.entities.Restaurante.Sucursal;
import main.repositories.PrivilegiosSucursalesRepository;
import main.repositories.SucursalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
public class PrivilegiosController {
    private final PrivilegiosSucursalesRepository privilegiosSucursalesRepository;
    private final SucursalRepository sucursalRepository;

    public PrivilegiosController(PrivilegiosSucursalesRepository privilegiosSucursalesRepository, SucursalRepository sucursalRepository) {
        this.privilegiosSucursalesRepository = privilegiosSucursalesRepository;
        this.sucursalRepository = sucursalRepository;
    }


    @CrossOrigin
    @GetMapping("/privilegios/{idSucursal}")
    public Set<PrivilegiosSucursales> getPrivilegios(@PathVariable("idSucursal") Long idSucursal) {
        return new HashSet<>(privilegiosSucursalesRepository.findAllByIdSucursal(idSucursal));
    }

    @CrossOrigin
    @Transactional
    @PostMapping("/prvilegio/create/{idSucursal}")
    public ResponseEntity<String> crearPrivilegio(@RequestBody PrivilegiosSucursales privilegiosDetails, @PathVariable("idSucursal") Long idSucursal) {
        // Busco el privilegio en la base de datos
        Optional<PrivilegiosSucursales> privilegiosDB = privilegiosSucursalesRepository.findByNombreAndIdSucursal(privilegiosDetails.getNombre(), idSucursal);

        if (privilegiosDB.isEmpty()) {
            if (!privilegiosDetails.getSucursales().isEmpty()) {
                Set<Sucursal> sucursales = new HashSet<>(privilegiosDetails.getSucursales());
                for (Sucursal sucursalVacia : sucursales) {
                    Sucursal sucursal = sucursalRepository.findById(sucursalVacia.getId()).get();

                    sucursal.getPrivilegios().add(privilegiosDetails);
                    privilegiosDetails.getSucursales().add(sucursal);
                    sucursalRepository.save(sucursal);
                }
            } else {
                Optional<Sucursal> sucursalOpt = sucursalRepository.findById(idSucursal);
                if (sucursalOpt.isPresent()) {
                    Sucursal sucursal = sucursalOpt.get();
                    if (!sucursal.getMedidas().contains(privilegiosDetails)) {
                        sucursal.getPrivilegios().add(privilegiosDetails);
                        privilegiosDetails.getSucursales().add(sucursal);
                        sucursalRepository.save(sucursal);
                    }
                } else {
                    return new ResponseEntity<>("Sucursal no encontrada con id: " + idSucursal, HttpStatus.NOT_FOUND);
                }
            }

            privilegiosDetails.setBorrado("NO");
            privilegiosSucursalesRepository.save(privilegiosDetails);

            return new ResponseEntity<>("El privilegio ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return ResponseEntity.badRequest().body("Hay una privilegio existente con ese nombre");
    }

    @CrossOrigin
    @Transactional
    @PutMapping("/privilegio/update/{idSucursal}")
    public ResponseEntity<String> actualizarPrivilegio(@RequestBody PrivilegiosSucursales privilegio, @PathVariable("idSucursal") Long idSucursal) {
        Optional<PrivilegiosSucursales> rolDB = privilegiosSucursalesRepository.findByIdPrivilegioAndIdSucursal(privilegio.getId(), idSucursal);

        if (rolDB.isEmpty()) {
            return ResponseEntity.ofNullable("La privilegio no existe");
        } else {
            Optional<PrivilegiosSucursales> privilegioEncontrado = privilegiosSucursalesRepository.findByNombreAndIdSucursal(privilegio.getNombre(), idSucursal);

            if (privilegioEncontrado.isPresent() && privilegioEncontrado.get().getId() != rolDB.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe una privilegio con ese nombre");
            }

            rolDB.get().setNombre(privilegio.getNombre());
            rolDB.get().setBorrado(privilegio.getBorrado());
            privilegiosSucursalesRepository.save(rolDB.get());
            return ResponseEntity.ok("Medida actualizada correctamente");
        }
    }
}
