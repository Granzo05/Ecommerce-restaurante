package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Productos.ArticuloMenu;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.StockIngredientes;
import main.entities.Stock.StockIngredientesDTO;
import main.repositories.ArticuloMenuRepository;
import main.repositories.IngredienteRepository;
import main.repositories.StockIngredientesRepository;
import main.repositories.SucursalRepository;
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
    private final IngredienteRepository ingredienteRepository;
    private final ArticuloMenuRepository articuloMenuRepository;
    private final SucursalRepository sucursalRepository;

    public StockIngredientesController(StockIngredientesRepository stockIngredientesRepository, IngredienteRepository ingredienteRepository, ArticuloMenuRepository articuloMenuRepository, SucursalRepository sucursalRepository) {
        this.stockIngredientesRepository = stockIngredientesRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.articuloMenuRepository = articuloMenuRepository;
        this.sucursalRepository = sucursalRepository;
    }

    @GetMapping("/stockIngredientes/{idSucursal}")
    public Set<StockIngredientesDTO> getStock(@PathVariable("idSucursal") long id) {
        List<StockIngredientesDTO> stockIngredientes = stockIngredientesRepository.findAllByIdSucursal(id);
        if (stockIngredientes.isEmpty()) {
            return null;
        }

        return new HashSet<>(stockIngredientes);
    }


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
                    System.out.println("StockIngredientes db medida: " + stockEncontrado.get().getMedida() + " y cantidad: " + stockEncontrado.get().getCantidadActual());
                    System.out.println("StockIngredientes db cliente medida: " + ingrediente.getMedida() + " y cantidad: " + ingrediente.getCantidad());
                    // Si el ingrediente tiene la misma medida que el stockIngredientes almacenado entonces se calcula a la misma medida.

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

    @GetMapping("/sucursal/{idSucursal}/stockIngredientes/check")
    public ResponseEntity<String> checkStock(@RequestParam(value = "articuloMenus") List<ArticuloMenu> articuloMenus, @PathVariable("idSucursal") long id) {
        System.out.println(articuloMenus);
        for (ArticuloMenu articuloMenu : articuloMenus) {
            for (IngredienteMenu ingrediente : articuloMenu.getIngredientesMenu()) {
                Optional<StockIngredientes> stockEncontrado = stockIngredientesRepository.findByIdIngredienteAndIdSucursal(ingrediente.getIngrediente().getId(), id);

                if (stockEncontrado.isPresent()) {
                    System.out.println("StockIngredientes db medida: " + stockEncontrado.get().getMedida() + " y cantidad: " + stockEncontrado.get().getCantidadActual());
                    System.out.println("StockIngredientes db cliente medida: " + ingrediente.getMedida() + " y cantidad: " + ingrediente.getCantidad());
                    // Si el ingrediente tiene la misma medida que el stockIngredientes almacenado entonces se calcula a la misma medida.
                    if (stockEncontrado.get().getMedida().equals(ingrediente.getMedida()) && stockEncontrado.get().getCantidadActual() < ingrediente.getCantidad()) {
                        return new ResponseEntity<>("El stockIngredientes no es suficiente", HttpStatus.BAD_REQUEST);
                    } else if (!stockEncontrado.get().getMedida().equals("Kg") && ingrediente.getMedida().equals("Gramos")) {
                        // Si almacené el ingrediente por KG, y necesito 300 gramos en el menu, entonces convierto de KG a gramos para calcularlo en la misma medida
                        if (stockEncontrado.get().getCantidadActual() * 1000 < ingrediente.getCantidad()) {
                            return new ResponseEntity<>("El stockIngredientes no es suficiente", HttpStatus.BAD_REQUEST);
                        }
                    }
                }
            }
        }
        return new ResponseEntity<>("El stockIngredientes es suficiente", HttpStatus.CREATED);
    }


    @Transactional
    @PostMapping("sucursal/{idSucursal}/stockIngredientes/create")
    public ResponseEntity<String> crearStock(@RequestBody StockIngredientes stockDetail, @PathVariable("idSucursal") long id) {
        Optional<Ingrediente> ingredienteDb = ingredienteRepository.findByNombreNotBorrado(stockDetail.getIngrediente().getNombre());

        Long idIngrediente = 0L;
        // Si el cliente no se ha creado en su sección lo creamos para evitar trabajar doble
        if (ingredienteDb.isEmpty()) {
            Ingrediente ingrediente = new Ingrediente();
            ingrediente.setNombre(stockDetail.getIngrediente().getNombre());

            ingrediente = ingredienteRepository.save(ingrediente);
            idIngrediente = ingrediente.getId();
        } else {
            idIngrediente = ingredienteDb.get().getId();
        }

        // Busco el ingrediente en la base de datos
        Optional<StockIngredientes> stockIngrediente = stockIngredientesRepository.findByIdIngredienteAndIdSucursal(idIngrediente, id);

        // Si no hay stock creado entonces necesitamos recuperar el ingrediente creado
        if (stockIngrediente.isEmpty()) {
            Ingrediente ingrediente = ingredienteRepository.findByIdNotBorrado(idIngrediente).get();

            // Si no existe stockIngredientes de ese producto se crea un nuevo objeto
            StockIngredientes stock = new StockIngredientes();

            stock.setCantidadMaxima(stockDetail.getCantidadMaxima());
            stock.setCantidadMinima(stockDetail.getCantidadMinima());
            stock.setCantidadActual(stockDetail.getCantidadActual());
            stock.setPrecioCompra(stockDetail.getPrecioCompra());
            stock.setMedida(stockDetail.getMedida());
            stock.setIngrediente(ingrediente);

            Sucursal sucursal = sucursalRepository.findById(id).get();
            stock.setSucursal(sucursal);

            stockIngredientesRepository.save(stock);

            return ResponseEntity.ok("El stock del ingrediente ha sido añadido correctamente");
        }

        return ResponseEntity.ofNullable("El stock ya existe");
    }

    @PutMapping("sucursal/{idSucursal}/stockIngredientes/update")
    public ResponseEntity<String> actualizarStock(@RequestBody StockIngredientes stockIngredientes, @PathVariable("idSucursal") long id) {
        Optional<Ingrediente> ingredienteDB = Optional.of(ingredienteRepository.findByIdNotBorrado(stockIngredientes.getIngrediente().getId()).get());

        // Busco el stockIngredientes de ese ingrediente
        Optional<StockIngredientes> stockEncontrado = stockIngredientesRepository.findByIdIngredienteAndIdSucursal(ingredienteDB.get().getId(), id);

        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stockIngredientes no existe", HttpStatus.FOUND);
        } else {
            stockIngredientesRepository.save(stockEncontrado.get());
            return new ResponseEntity<>("El stockIngredientes ha sido añadido correctamente", HttpStatus.CREATED);
        }
    }

    @DeleteMapping("sucursal/{idSucursal}/stockIngredientes/delete")
    public ResponseEntity<String> borrarStock(@RequestBody StockIngredientes stockIngredientes, @PathVariable("idSucursal") long id) {
        Optional<StockIngredientes> stockEncontrado = stockIngredientesRepository.findByIdIngredienteAndIdSucursal(stockIngredientes.getId(), id);
        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stockIngredientes ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        stockEncontrado.get().setBorrado("SI");
        stockIngredientesRepository.save(stockEncontrado.get());
        return new ResponseEntity<>("El stockIngredientes ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
