package main.controllers;

import main.entities.Restaurante.Menu.Ingrediente;
import main.entities.Restaurante.Menu.IngredienteMenu;
import main.entities.Restaurante.Menu.Menu;
import main.entities.Restaurante.Menu.Stock;
import main.entities.Restaurante.Restaurante;
import main.repositories.RestauranteRepository;
import main.repositories.StockRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class StockController {
    private final RestauranteRepository restauranteRepository;
    private final StockRepository stockRepository;

    public StockController(RestauranteRepository restauranteRepository,
                           StockRepository stockRepository) {
        this.restauranteRepository = restauranteRepository;
        this.stockRepository = stockRepository;
    }

    @GetMapping("/stock")
    public List<Stock> getStock() {
        List<Stock> stock = stockRepository.findAll();
        if (stock.isEmpty()) {
            return null;
        }

        return stock;
    }


    @GetMapping("/stock/{nombre}")
    public ResponseEntity<Stock> getStockPorNombre(@PathVariable String nombre) {
        Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(nombre);
        if (stockEncontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Stock stock = stockEncontrado.get();
        return ResponseEntity.ok(stock);
    }

    // Busca stock mediante el menu, utilizando cada ingrediente para corroborar que hay cantidad para cocinar
    @GetMapping("/restaurante/stock/check")
    public ResponseEntity<String> checkStock(@RequestBody List<Menu> menus) {
        for (Menu menu : menus) {
            for (IngredienteMenu ingrediente : menu.getIngredientes()) {
                Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(ingrediente.getNombre());

                if (stockEncontrado.isPresent() && stockEncontrado.get().getCantidad() < ingrediente.getCantidad()) {
                    // Si es menor solo devuelve los menus que puede producir junto con un error
                    return new ResponseEntity<>("El stock no es suficiente", HttpStatus.BAD_REQUEST);
                }
            }
        }
        return new ResponseEntity<>("El stock es suficiente", HttpStatus.CREATED);
    }


    @PostMapping("/restaurante/stock/create")
    public ResponseEntity<String> crearStock(@RequestParam("nombre") String nombre,
                                             @RequestParam("cantidad") int cantidad,
                                             @RequestParam("medida") String medida,
                                             @RequestParam("costo") double costo) {

        Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(nombre);

        Optional<Restaurante> restauranteEncontrado = Optional.ofNullable(restauranteRepository.findAll().get(0));

        // Si no hay stock del producto cargado, entonces creamos uno nuevo. Caso contrario utilizamos y editamos el que ya está cargado en la base de datos
        if (stockEncontrado.isEmpty()) {
            // Si no existe stock de ese producto se crea un nuevo objeto
            Stock stock = new Stock();

            // Creamos el ingrediente con el nombre proporcionado y el costo
            Ingrediente ingrediente = new Ingrediente();
            ingrediente.setNombre(nombre);
            if (costo > 0) ingrediente.setCosto(costo);

            // Asignamos el ingrediente a este nuevo stock
            stock.setIngrediente(ingrediente);

            // Asignamos el restaurante a este nuevo stock
            stock.setRestaurante(restauranteEncontrado.get());

            // Asignamos la cantidad de este ingrediente
            if (cantidad > 0) {
                stock.setCantidad(cantidad);
            }

            // En caso de ser proporcionada, se coloca la medida, por ejemplo KG, Litro, etc
            if (medida != null) {
                stock.setMedida(medida);
            }

            // Finalmente se guarda y se devuelve un mensaje con el ok
            stockRepository.save(stock);
            return new ResponseEntity<>("El stock ha sido añadido correctamente", HttpStatus.CREATED);
        } else {
            // Si existe se actualiza lo necesario

            // Si se proporciona un nuevo costo, entonces se actualiza
            if (costo > 0) stockEncontrado.get().getIngrediente().setCosto(costo);

            // Si se proporciona una nueva cantidad, entonces se actualiza
            if (cantidad > 0) {
                stockEncontrado.get().setCantidad(cantidad);
            }

            // Si se proporciona una medida distinta, entonces se actualiza
            if (medida != null) {
                stockEncontrado.get().setMedida(medida);
            }

            stockRepository.save(stockEncontrado.get());

            return new ResponseEntity<>("El stock ha sido actualizado correctamente", HttpStatus.CREATED);
        }
    }

    @PutMapping("/restaurante/stock/update")
    public ResponseEntity<Stock> actualizarStock(@RequestBody Stock stock) {
        Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(stock.getIngrediente().getNombre());
        if (stockEncontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Stock stockFinal = stockRepository.save(stockEncontrado.get());
        return ResponseEntity.ok(stockFinal);
    }

    @DeleteMapping("/restaurante/stock/delete/{nombre}")
    public ResponseEntity<?> borrarStock(@PathVariable String nombre) {
        Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(nombre);
        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stock ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        stockEncontrado.get().setBorrado("SI");
        stockRepository.save(stockEncontrado.get());
        return new ResponseEntity<>("El stock ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
