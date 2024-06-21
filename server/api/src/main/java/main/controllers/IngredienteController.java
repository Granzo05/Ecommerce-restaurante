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
    @GetMapping("/ingredientes/vacios/{idSucursal}")
    public Set<Ingrediente> getIngredientesVacios(@PathVariable("idSucursal") Long idSucursal) {
        List<Ingrediente> ingredientes = ingredienteRepository.findAllByIdSucursal(idSucursal);

        Set<Ingrediente> ingredientesSinStock = new HashSet<>();

        for (Ingrediente ingrediente: ingredientes) {
            Optional<StockIngredientes> stockDB = stockIngredientesRepository.findByIdIngredienteAndIdSucursal(ingrediente.getId(), idSucursal);

            if(stockDB.isPresent()) {
                StockIngredientes stock = stockDB.get();
                if (stock.getCantidadActual() == 0 && stock.getCantidadMinima() == 0 && stock.getCantidadMinima() == 0) ingredientesSinStock.add(ingrediente);
            }
        }

        return ingredientesSinStock;
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

                    sucursal.getIngredientes().add(ingredienteDetails);
                    ingredienteDetails.getSucursales().add(sucursal);
                }
            } else {
                Optional<Sucursal> sucursalOpt = sucursalRepository.findById(idSucursal);
                if (sucursalOpt.isPresent()) {
                    Sucursal sucursal = sucursalOpt.get();
                    if (!sucursal.getIngredientes().contains(ingredienteDetails)) {
                        sucursal.getIngredientes().add(ingredienteDetails);
                        ingredienteDetails.getSucursales().add(sucursal);
                    }
                } else {
                    return new ResponseEntity<>("Sucursal no encontrada con id: " + idSucursal, HttpStatus.NOT_FOUND);
                }
            }

            ingredienteDetails.setBorrado("NO");

            ingredienteRepository.save(ingredienteDetails);

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
