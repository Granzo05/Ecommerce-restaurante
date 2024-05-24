package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Medida;
import main.entities.Ingredientes.MedidaDTO;
import main.repositories.MedidaRepository;
import main.repositories.SucursalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RestController
public class MedidaController {
    private final MedidaRepository medidaRepository;
    private final SucursalRepository sucursalRepository;

    public MedidaController(MedidaRepository medidaRepository, SucursalRepository sucursalRepository) {
        this.medidaRepository = medidaRepository;
        this.sucursalRepository = sucursalRepository;
    }


    @GetMapping("/medidas/{idSucursal}")
    public Set<MedidaDTO> getMedidas(@PathVariable("idSucursal") Long idSucursal) {
        return new HashSet<>(medidaRepository.findAllDTOByIdSucursal(idSucursal));
    }

    @Transactional
    @PostMapping("/medida/create/{idSucursal}")
    public ResponseEntity<String> crearMedida(@RequestBody Medida medidaDetails, @PathVariable("idSucursal") Long idSucursal) {
        // Busco el medida en la base de datos
        Optional<Medida> medidaDB = medidaRepository.findByDenominacionAndIdSucursal(medidaDetails.getNombre(), idSucursal);

        if (medidaDB.isEmpty()) {
            medidaDetails.getSucursales().add(sucursalRepository.findById(idSucursal).get());

            medidaRepository.save(medidaDetails);

            return new ResponseEntity<>("El medida ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return ResponseEntity.ofNullable("El medida ya existe");
    }

    @Transactional
    @PutMapping("/medida/update/{idSucursal}")
    public ResponseEntity<String> actualizarMedida(@RequestBody Medida medida, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Medida> medidaDB = medidaRepository.findByIdMedidaAndIdSucursal(medida.getId(), idSucursal);

        if (medidaDB.isEmpty()) {
            return ResponseEntity.ofNullable("La medida no existe");
        } else {
            medidaDB.get().setNombre(medida.getNombre());
            medidaDB.get().setBorrado(medida.getBorrado());
            medidaRepository.save(medidaDB.get());
            return ResponseEntity.ok("Medida actualizada correctamente");
        }
    }
}
