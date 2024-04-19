package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Restaurante.Menu.Ingrediente;
import main.entities.Restaurante.Menu.IngredienteMenu;
import main.entities.Restaurante.Menu.Menu;
import main.entities.Restaurante.Menu.Stock;
import main.entities.Restaurante.Restaurante;
import main.repositories.IngredienteRepository;
import main.repositories.RestauranteRepository;
import main.repositories.StockRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class StockController {
    private final StockRepository stockRepository;
    private final IngredienteRepository ingredienteRepository;

    public StockController(StockRepository stockRepository, IngredienteRepository ingredienteRepository) {
        this.stockRepository = stockRepository;
        this.ingredienteRepository = ingredienteRepository;
    }

    @GetMapping("/stock")
    public List<Stock> getStock() {
        List<Stock> stock = stockRepository.findAll();
        if (stock.isEmpty()) {
            return null;
        }

        return stock;
    }


    @GetMapping("/stock/{nombre}/{cantidad}")
    public boolean getStockPorNombre(@PathVariable("nombre") String nombre, @PathVariable("cantidad") int cantidad) {
        Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(nombre);
        if (stockEncontrado.isEmpty()) {
            return false;
        }
        Stock stock = stockEncontrado.get();
        // Si hay mayor stock que producto solicitado se devuelve true para aceptar el pedido
        if(stock.getCantidad() > cantidad) {
            return true;
        }

        return false;
    }

    // Busca stock mediante el menu, utilizando cada ingrediente para corroborar que hay cantidad para cocinar
    @GetMapping("/restaurant/stock/check")
    public ResponseEntity<String> checkStock(@RequestParam(value = "menus") List<Menu> menus) {
        for (Menu menu : menus) {
            for (IngredienteMenu ingrediente : menu.getIngredientesMenu()) {
                Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(ingrediente.getIngrediente().getNombre());

                if (stockEncontrado.isPresent() && stockEncontrado.get().getCantidad() < ingrediente.getCantidad()) {
                    // Si es menor solo devuelve los menus que puede producir junto con un error
                    return new ResponseEntity<>("El stock no es suficiente", HttpStatus.BAD_REQUEST);
                }
            }
        }
        return new ResponseEntity<>("El stock es suficiente", HttpStatus.CREATED);
    }


    @Transactional
    @PostMapping("/stock/create")
    public ResponseEntity<String> crearStock(@RequestBody Stock stockDetail) {
        System.out.println(stockDetail);
        // Busco el ingrediente en la base de datos
        Ingrediente ingredienteDB = ingredienteRepository.findByName(stockDetail.getIngrediente().getNombre());

        // Si no hay stock del producto cargado, entonces creamos uno nuevo. Caso contrario utilizamos y editamos el que ya está cargado en la base de datos
        if (ingredienteDB == null) {
            // Si no existe stock de ese producto se crea un nuevo objeto
            Stock stock = new Stock();

            stock.setFechaIngreso(stockDetail.getFechaIngreso());
            stock.setCantidad(stockDetail.getCantidad());
            stock.setBorrado("NO");

            Ingrediente ingrediente = new Ingrediente();

            ingrediente.setNombre(stockDetail.getIngrediente().getNombre());

            ingrediente.setCosto(stockDetail.getIngrediente().getCosto());

            ingrediente.setMedida(stockDetail.getIngrediente().getMedida());

            ingrediente.setBorrado("NO");

            // Asignamos el ingrediente a este nuevo stock
            stock.setIngrediente(ingrediente);
            // Guardamos nuevamente el ingredienteDB con los posibles datos nuevos
            ingredienteRepository.save(ingrediente);

            System.out.println(stockDetail.getFechaIngreso());
            // Finalmente se guarda y se devuelve un mensaje con el ok
            stockRepository.save(stock);

            return new ResponseEntity<>("El stock ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return new ResponseEntity<>("El stock ya existe", HttpStatus.FOUND);
    }

    @PutMapping("/stock/update")
    public ResponseEntity<String> actualizarStock(@RequestBody Stock stock) {
        Ingrediente ingredienteDB = ingredienteRepository.findByName(stock.getIngrediente().getNombre());

        // Busco el stock de ese ingrediente
        Optional<Stock> stockEncontrado = stockRepository.findByIdIngrediente(ingredienteDB.getId());

        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stock no existe", HttpStatus.FOUND);
        }

        stockRepository.save(stockEncontrado.get());
        return new ResponseEntity<>("El stock ha sido añadido correctamente", HttpStatus.CREATED);
    }

    @DeleteMapping("stock/delete")
    public ResponseEntity<String> borrarStock(@RequestBody Stock stock) {
        Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(stock.getIngrediente().getNombre());
        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stock ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        stockEncontrado.get().setBorrado("SI");
        stockRepository.save(stockEncontrado.get());
        return new ResponseEntity<>("El stock ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
