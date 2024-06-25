package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.StockIngredientes;
import main.repositories.IngredienteRepository;
import main.repositories.MedidaRepository;
import main.repositories.StockIngredientesRepository;
import main.repositories.SucursalRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class IngredienteController {
    private final IngredienteRepository ingredienteRepository;
    private final SucursalRepository sucursalRepository;
    private final StockIngredientesRepository stockIngredientesRepository;
    private final MedidaRepository medidaRepository;

    public IngredienteController(IngredienteRepository ingredienteRepository, SucursalRepository sucursalRepository, StockIngredientesRepository stockIngredientesRepository, MedidaRepository medidaRepository) {
        this.ingredienteRepository = ingredienteRepository;
        this.sucursalRepository = sucursalRepository;
        this.stockIngredientesRepository = stockIngredientesRepository;
        this.medidaRepository = medidaRepository;
    }

    @CrossOrigin
    @GetMapping("/ingredientes/{idSucursal}")
    public Set<Ingrediente> getIngredientes(@PathVariable("idSucursal") Long idSucursal) {
        return new HashSet<>(ingredienteRepository.findAllByIdSucursal(idSucursal));
    }

    @CrossOrigin
    @GetMapping("/ingredientes/disponibles/{idSucursal}")
    public Set<Ingrediente> getIngredientesDisponibles(@PathVariable("idSucursal") Long idSucursal) {
        return new HashSet<>(ingredienteRepository.findAllByIdSucursalNotBorrado(idSucursal));
    }

    @CrossOrigin
    @Transactional
    @PostMapping("/ingrediente/create/{idSucursal}")
    public ResponseEntity<String> crearIngrediente(@RequestBody Ingrediente ingredienteDetails, @PathVariable("idSucursal") Long idSucursal) {
        // Busco el ingrediente en la base de datos
        Optional<Ingrediente> ingredienteDB = ingredienteRepository.findByNameAndIdSucursal(ingredienteDetails.getNombre(), idSucursal);

        if (ingredienteDB.isEmpty()) {
            if (!ingredienteDetails.getSucursales().isEmpty()) {
                Set<Sucursal> sucursales = new HashSet<>(ingredienteDetails.getSucursales());
                for (Sucursal sucursalVacia : sucursales) {
                    Sucursal sucursal = sucursalRepository.findById(sucursalVacia.getId()).get();

                    ingredienteDetails.getSucursales().add(sucursal);

                    ingredienteDetails = ingredienteRepository.save(ingredienteDetails);

                    sucursal.getIngredientes().add(ingredienteDetails);

                    sucursalRepository.save(sucursal);
                }
            } else {
                Optional<Sucursal> sucursalOpt = sucursalRepository.findById(idSucursal);
                if (sucursalOpt.isPresent()) {
                    Sucursal sucursal = sucursalOpt.get();
                    if (!sucursal.getIngredientes().contains(ingredienteDetails)) {
                        ingredienteDetails.getSucursales().add(sucursal);
                        ingredienteDetails.setBorrado("NO");

                        ingredienteDetails = ingredienteRepository.save(ingredienteDetails);

                        sucursal.getIngredientes().add(ingredienteDetails);

                        sucursalRepository.save(sucursal);
                    }
                } else {
                    return new ResponseEntity<>("Sucursal no encontrada con id: " + idSucursal, HttpStatus.NOT_FOUND);
                }
            }

            return new ResponseEntity<>("El ingrediente ha sido añadido correctamente", HttpStatus.OK);
        } else {
            return ResponseEntity.badRequest().body("Hay un ingrediente existente con ese nombre");
        }
    }

    @CrossOrigin
    @PutMapping("/ingrediente/update/{idSucursal}")
    public ResponseEntity<String> actualizarIngrediente(@RequestBody Ingrediente ingrediente, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Ingrediente> ingredienteEncontrado = ingredienteRepository.findByIdIngredienteAndIdSucursal(ingrediente.getId(), idSucursal);
        if (ingredienteEncontrado.isEmpty()) {
            return ResponseEntity.ofNullable("El ingrediente no existe");
        } else {
            Optional<Ingrediente> ingredienteDB = ingredienteRepository.findByNameAndIdSucursal(ingrediente.getNombre(), idSucursal);

            if (ingredienteDB.isPresent() && ingredienteDB.get().getId() != ingredienteEncontrado.get().getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existe un ingrediente con ese nombre");
            }

            ingredienteEncontrado.get().setNombre(ingrediente.getNombre());

            ingredienteEncontrado.get().setBorrado(ingrediente.getBorrado());

            ingredienteRepository.save(ingredienteEncontrado.get());

            return ResponseEntity.ok("El ingrediente ha sido actualizado correctamente");
        }
    }
}
