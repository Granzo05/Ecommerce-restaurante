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
@GetMapping("/restaurant/stock/check")
public ResponseEntity<String> checkStock(@RequestParam(value = "menus") List<Menu> menus) {
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
    public ResponseEntity<String> crearStock(@RequestBody Menu menu) {

        Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(nombre);

        Optional<Restaurante> restauranteEncontrado = Optional.ofNullable(restauranteRepository.findAll().get(0));

        // Si no hay stock del producto cargado, entonces creamos uno nuevo. Caso contrario utilizamos y editamos el que ya está cargado en la base de datos
        if (stockEncontrado.isEmpty()) {
            // Si no existe stock de ese producto se crea un nuevo objeto
            Stock stock = new Stock();

            // Iteramos cada ingrediente del menu
            for(Ingrediente ingrediente: menu.getIngredientes()) {
            // Buscamos si existe este ingrediente
            Ingrediente ingredienteDB = ingredienteRepository.getByName(ingrediente.getName());
            
            if(ingredienteDB != null) {
                //  Si no existe lo creamos
                ingredienteDB = new Ingrediente();
                // Le asignamos el nombre
                ingredienteDB.setNombre(menu.getNombre());
                //Todo: En caso de ser nuevo deberiamos dar aviso de que se le debe
            }

            // Si el ingrediente tiene un costo nuevo y distinto al almacenado, se le asigna este nuevo
            if (costo > 0 && costo != ingredienteDB.getCosto()) {
                ingredienteDB.setCosto(ingrediente.getCosto());
            }
            
            // Asignamos la cantidad de este ingrediente
            if (ingrediente.getCantidad() > 0) {
                stock.setCantidad(ingrediente.getCantidad());
            }

            // Asignamos el ingrediente a este nuevo stock
            stock.setIngrediente(ingredienteDB);            
            
            // Guardamos nuevamente el ingredienteDB con los posibles datos nuevos
            ingredienteRepository.save(ingredienteDB);
            }


            // Asignamos el restaurante a este nuevo stock
            stock.setRestaurante(restauranteEncontrado.get());


            // En caso de ser proporcionada, se coloca la medida, por ejemplo KG, Litro, etc
            if (medida != null) {
                stock.setMedida(medida);
            }

            // Finalmente se guarda y se devuelve un mensaje con el ok
            stockRepository.save(stock);
            return new ResponseEntity<>("El stock ha sido añadido correctamente", HttpStatus.CREATED);
        } else {

            // Iteramos cada ingrediente del menu
            for(Ingrediente ingrediente: menu.getIngredientes()) {
            // Buscamos si existe este ingrediente
            Ingrediente ingredienteDB = ingredienteRepository.getByName(ingrediente.getName());
            
            if(ingredienteDB != null) {
                //  Si no existe lo creamos
                ingredienteDB = new Ingrediente();
                // Le asignamos el nombre
                ingredienteDB.setNombre(menu.getNombre());
                //Todo: En caso de ser nuevo deberiamos dar aviso de que se le debe
            }

            // Si el ingrediente tiene un costo nuevo y distinto al almacenado, se le asigna este nuevo
            if (costo > 0 && costo != ingredienteDB.getCosto()) {
                ingredienteDB.setCosto(ingrediente.getCosto());
            }
            
            // Asignamos la cantidad de este ingrediente
            if (ingrediente.getCantidad() > 0) {
                stock.setCantidad(ingrediente.getCantidad());
            }

            // Asignamos el ingrediente a este nuevo stock
            stock.setIngrediente(ingredienteDB);            
            
            // Guardamos nuevamente el ingredienteDB con los posibles datos nuevos
            ingredienteRepository.save(ingredienteDB);
            }

            stockRepository.save(stockEncontrado.get());

            return new ResponseEntity<>("El stock ha sido actualizado correctamente", HttpStatus.CREATED);
        }
    }

    @PutMapping("/stock/update")
    public ResponseEntity<Stock> actualizarStock(@RequestBody Stock stock) {
        Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(stock.getIngrediente().getNombre());
        if (stockEncontrado.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Stock stockFinal = stockRepository.save(stockEncontrado.get());
        return ResponseEntity.ok(stockFinal);
    }

    @DeleteMapping("stock/delete")
    public ResponseEntity<?> borrarStock(@RequestBody Stock stock) {
        Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(stock.getIngrediente().getNombre());
        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stock ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        stockEncontrado.get().setBorrado("SI");
        stockRepository.save(stockEncontrado.get());
        return new ResponseEntity<>("El stock ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
