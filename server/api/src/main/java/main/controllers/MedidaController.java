package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Medida;
import main.entities.Restaurante.Sucursal;
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


    @CrossOrigin
    @GetMapping("/medidas/{idSucursal}")
    public Set<Medida> getMedidas(@PathVariable("idSucursal") Long idSucursal) {
        return new HashSet<>(medidaRepository.findAllByIdSucursal(idSucursal));
    }

    @CrossOrigin
    @Transactional
    @PostMapping("/medida/create/{idSucursal}")
    public ResponseEntity<String> crearMedida(@RequestBody Medida medidaDetails, @PathVariable("idSucursal") Long idSucursal) {
        // Busco el medida en la base de datos
        Optional<Medida> medidaDB = medidaRepository.findByDenominacionAndIdSucursal(medidaDetails.getNombre(), idSucursal);

        if (medidaDB.isEmpty()) {
            if (!medidaDetails.getSucursales().isEmpty()) {
                Set<Sucursal> sucursales = new HashSet<>(medidaDetails.getSucursales());
                for (Sucursal sucursalVacia : sucursales) {
                    Sucursal sucursal = sucursalRepository.findById(sucursalVacia.getId()).get();

                    sucursal.getMedidas().add(medidaDetails);
                    medidaDetails.getSucursales().add(sucursal);
                }
            } else {
                Optional<Sucursal> sucursalOpt = sucursalRepository.findById(idSucursal);
                if (sucursalOpt.isPresent()) {
                    Sucursal sucursal = sucursalOpt.get();
                    if (!sucursal.getMedidas().contains(medidaDetails)) {
                        sucursal.getMedidas().add(medidaDetails);
                        medidaDetails.getSucursales().add(sucursal);
                    }
                } else {
                    return new ResponseEntity<>("Sucursal no encontrada con id: " + idSucursal, HttpStatus.NOT_FOUND);
                }
            }

            medidaRepository.save(medidaDetails);

            return new ResponseEntity<>("El medida ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return ResponseEntity.badRequest().body("Hay una medida existente con ese nombre");
    }

    @CrossOrigin
    @Transactional
    @PutMapping("/medida/update/{idSucursal}")
    public ResponseEntity<String> actualizarMedida(@RequestBody Medida medida, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Medida> medidaDB = medidaRepository.findByIdMedidaAndIdSucursal(medida.getId(), idSucursal);

        if (medidaDB.isEmpty()) {
            return ResponseEntity.ofNullable("La medida no existe");
        } else {
            Optional<Medida> medidaEncontrada = medidaRepository.findByDenominacionAndIdSucursal(medida.getNombre(), idSucursal);

            if (medidaEncontrada.isPresent() && medidaEncontrada.get().getId() != medidaDB.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe una medida con ese nombre");
            }

            medidaDB.get().setNombre(medida.getNombre());
            medidaDB.get().setBorrado(medida.getBorrado());
            medidaRepository.save(medidaDB.get());
            return ResponseEntity.ok("Medida actualizada correctamente");
        }
    }
}
