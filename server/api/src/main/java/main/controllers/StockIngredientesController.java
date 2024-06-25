package main.controllers;

import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Ingredientes.Medida;
import main.entities.Pedidos.DetallesPedido;
import main.entities.Productos.ArticuloMenu;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.StockArticuloVenta;
import main.entities.Stock.StockEntrante;
import main.entities.Stock.StockIngredientes;
import main.repositories.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class StockIngredientesController {
    private final StockIngredientesRepository stockIngredientesRepository;
    private final StockEntranteRepository stockEntranteRepository;
    private final IngredienteRepository ingredienteRepository;
    private final ArticuloMenuRepository articuloMenuRepository;
    private final SucursalRepository sucursalRepository;
    private final MedidaRepository medidaRepository;

    public StockIngredientesController(StockIngredientesRepository stockIngredientesRepository, StockEntranteRepository stockEntranteRepository, IngredienteRepository ingredienteRepository, ArticuloMenuRepository articuloMenuRepository, SucursalRepository sucursalRepository, MedidaRepository medidaRepository) {
        this.stockIngredientesRepository = stockIngredientesRepository;
        this.stockEntranteRepository = stockEntranteRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.articuloMenuRepository = articuloMenuRepository;
        this.sucursalRepository = sucursalRepository;
        this.medidaRepository = medidaRepository;
    }

    @CrossOrigin
    @GetMapping("/stockIngredientes/{idSucursal}")
    public Set<StockIngredientes> getStockCargado(@PathVariable("idSucursal") long id) {
        List<StockIngredientes> stockIngredientes = stockIngredientesRepository.findAllByIdSucursal(id);

        Set<StockIngredientes> stocksCargados = new HashSet<>();

        for (StockIngredientes stock : stockIngredientes) {
            boolean stockEncontrado = false;
            int page = 0;
            int pageSize = 10;

            while (!stockEncontrado) {
                PageRequest pageable = PageRequest.of(page, pageSize);
                Page<StockEntrante> stockEntrantePage = stockEntranteRepository.findByIdIngredienteAndIdSucursal(stock.getIngrediente().getId(), id, pageable);

                if (stockEntrantePage.isEmpty()) {
                    break;
                }

                List<StockEntrante> stockEntranteList = stockEntrantePage.getContent();
                for (StockEntrante se : stockEntranteList) {
                    if (se.getEstado().equals("PENDIENTES")) {
                        stock.setFechaLlegadaProxima(se.getFechaLlegada());
                        stockEncontrado = true;
                        break;
                    }
                }

                page++;
            }

            if (stock.getCantidadActual() > 0) {
                stocksCargados.add(stock);
            }
        }

        return stocksCargados;
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
    @GetMapping("sucursal/{idSucursal}/stockIngredientes/{nombre}/{cantidad}")
    public ResponseEntity<String> getStockPorNombre(@PathVariable("nombre") String nombre, @PathVariable("cantidad") int cantidad, @PathVariable("idSucursal") long id) {
        // Recibimos el nombre del menu y la cantidad pedida del mismo
        Optional<ArticuloMenu> menu = articuloMenuRepository.findByName(nombre);

        if (!menu.isEmpty()) {
            // Buscamos ingrediente por ingrediente a ver si el stockIngredientes es suficiente
            for (IngredienteMenu ingrediente : menu.get().getIngredientesMenu()) {
                // Mediante el ingrediente accedemos al stockIngredientes del mismo
                Optional<StockIngredientes> stockEncontrado = stockIngredientesRepository.findByIdIngredienteAndIdSucursal(ingrediente.getIngrediente().getId(), id);

                if (stockEncontrado.isPresent()) {

                    // Si hay stockIngredientes, entonces se multiplica por la cantidad del menu requerida, si para un menu necesito 300 gramos de X ingrediente, si estoy pidiendo
                    // 4 menus, entonces necesitaría en total 1200 gramos de eso
                    if (stockEncontrado.get().getMedida().equals(ingrediente.getMedida()) && stockEncontrado.get().getCantidadActual() < ingrediente.getCantidad() * cantidad) {
                        return new ResponseEntity<>("El stockIngredientes no es suficiente", HttpStatus.BAD_REQUEST);
                    } else if (!stockEncontrado.get().getMedida().equals("Kg") && ingrediente.getMedida().equals("Gramos")) {
                        // Si almacené el ingrediente por KG, y necesito 300 gramos en el menu, entonces convierto de KG a gramos para calcularlo en la misma medida
                        if (stockEncontrado.get().getCantidadActual() * 1000 < ingrediente.getCantidad() * cantidad) {
                            return new ResponseEntity<>("El stockIngredientes no es suficiente", HttpStatus.BAD_REQUEST);
                        }

                    }
                }
            }
        } else {
            return new ResponseEntity<>("El menú no existe", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("El stockIngredientes es suficiente", HttpStatus.CREATED);
    }

    @CrossOrigin
    @GetMapping("sucursal/{idSucursal}/stock/{nombre}")
    public StockIngredientes getCostoStockPorNombre(@PathVariable("nombre") String nombre, @PathVariable("idSucursal") long id) {
        return stockIngredientesRepository.findStockByIngredienteNameAndIdSucursal(nombre, id).get();
    }

    @CrossOrigin
    @GetMapping("/sucursal/{idSucursal}/stockIngredientes/check/{idIngrediente}/{idMedida}/{cantidadNecesaria}")
    public boolean checkStock(@PathVariable("idIngrediente") long idIngrediente, @PathVariable("idSucursal") long idSucursal, @PathVariable("idMedida") Long idMedida, @PathVariable("cantidadNecesaria") int cantidad) {
        // True hay stock, false no
        Optional<StockIngredientes> stockIngrediente = stockIngredientesRepository.findByIdIngredienteAndIdSucursal(idIngrediente, idSucursal);

        if (stockIngrediente.isPresent()) {
            Medida medida = medidaRepository.findById(idMedida).get();
            // Si el ingrediente tiene la misma medida que el stockIngredientes almacenado entonces se calcula a la misma medida.
            if (stockIngrediente.get().getMedida() != null && stockIngrediente.get().getMedida().equals(medida) && stockIngrediente.get().getCantidadActual() < cantidad || stockIngrediente.get().getCantidadActual() - cantidad <= 0) {
                return false;
            } else if (stockIngrediente.get().getMedida().equals("Kg") && medida.equals("Gramos")) {
                // Si almacené el ingrediente por KG, y necesito 300 gramos en el menu, entonces convierto de KG a gramos para calcularlo en la misma medida
                if (stockIngrediente.get().getCantidadActual() * 1000 < cantidad || stockIngrediente.get().getCantidadActual() * 1000 - cantidad <= 0) {
                    return false;
                }
            }
        }

        return true;
    }


    @CrossOrigin
    @PostMapping("sucursal/{idSucursal}/stockIngredientes/create")
    public ResponseEntity<String> crearStock(@RequestBody StockIngredientes stockDetail, @PathVariable("idSucursal") long id) {
        // Busco el ingrediente en la base de datos
        Optional<StockIngredientes> stockIngrediente = stockIngredientesRepository.findByIdIngredienteAndIdSucursal(stockDetail.getIngrediente().getId(), id);

        // Si no hay stock creado entonces necesitamos recuperar el ingrediente creado
        if (stockIngrediente.isEmpty()) {
            Ingrediente ingrediente = ingredienteRepository.findByNameAndIdSucursal(stockDetail.getIngrediente().getNombre(), id).get();

            stockDetail.setIngrediente(ingrediente);
            stockDetail.getIngrediente().setStockIngrediente(stockDetail);

            Sucursal sucursal = sucursalRepository.findById(id).get();

            stockDetail.getSucursales().add(sucursal);

            if (stockDetail.getMedida().getNombre().isEmpty()) {
                stockDetail.setMedida(medidaRepository.findById(1l).get());
            }

            stockIngredientesRepository.save(stockDetail);

            return ResponseEntity.ok("El stock del ingrediente ha sido añadido correctamente");
        }

        return ResponseEntity.ofNullable("El stock ya existe");
    }
    @CrossOrigin
    @PutMapping("sucursal/{idSucursal}/stockIngredientes/{nombreIngrediente}/cantidad/{cantidad}")
    public ResponseEntity<String> reponerStock(@PathVariable("nombreIngrediente") String nombreIngrediente, @PathVariable("cantidad") int cantidad, @PathVariable("idSucursal") long id) {
        // Busco el stockIngredientes de ese ingrediente
        Optional<StockIngredientes> stockEncontrado = stockIngredientesRepository.findByNameIngredienteAndIdSucursal(nombreIngrediente, id);

        if (stockEncontrado.isPresent()) {
            StockIngredientes stock = stockEncontrado.get();

            stock.setCantidadActual(stock.getCantidadActual() + cantidad);

            stockIngredientesRepository.save(stock);
            return ResponseEntity.ok("El stock ha sido actualizado correctamente");
        }

        return ResponseEntity.ofNullable("El stock no existe o está desactivado");
    }

    @CrossOrigin
    @PutMapping("sucursal/{idSucursal}/stockIngrediente/update")
    public ResponseEntity<String> actualizarStock(@RequestBody StockIngredientes stockIngredientes, @PathVariable("idSucursal") long id) {
        // Busco el stockIngredientes de ese ingrediente
        Optional<StockIngredientes> stockEncontrado = stockIngredientesRepository.findByIdAndIdSucursal(stockIngredientes.getIngrediente().getStockIngrediente().getId(), id);
        if (stockEncontrado.isPresent()) {
            StockIngredientes stock = stockEncontrado.get();

            stock.setCantidadMinima(stockIngredientes.getCantidadMinima());
            stock.setCantidadMaxima(stockIngredientes.getCantidadMaxima());
            stock.setCantidadActual(stockIngredientes.getCantidadActual());
            stock.setPrecioCompra(stockIngredientes.getPrecioCompra());
            stock.setMedida(stockIngredientes.getMedida());
            stock.setBorrado(stockIngredientes.getBorrado());

            stockIngredientesRepository.save(stock);
            return ResponseEntity.ok("El stock ha sido actualizado correctamente");
        } else {
            return ResponseEntity.badRequest().body("El stock no existe o está desactivado");
        }
    }

}
