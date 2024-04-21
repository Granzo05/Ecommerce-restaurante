package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Restaurante.Menu.Ingrediente;
import main.entities.Restaurante.Menu.IngredienteMenu;
import main.entities.Restaurante.Menu.Menu;
import main.entities.Restaurante.Menu.Stock;
import main.entities.Restaurante.Restaurante;
import main.repositories.IngredienteRepository;
import main.repositories.MenuRepository;
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
    private final MenuRepository menuRepository;

    public StockController(StockRepository stockRepository, IngredienteRepository ingredienteRepository, MenuRepository menuRepository) {
        this.stockRepository = stockRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.menuRepository = menuRepository;
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
    public ResponseEntity<String> getStockPorNombre(@PathVariable("nombre") String nombre, @PathVariable("cantidad") int cantidad) {
        // Recibimos el nombre del menu y la cantidad pedida del mismo
        Optional<Menu> menu = menuRepository.findByName(nombre);

        if(!menu.isEmpty()){
            // Buscamos ingrediente por ingrediente a ver si el stock es suficiente
            for (IngredienteMenu ingrediente : menu.get().getIngredientesMenu()) {
                // Mediante el ingrediente accedemos al stock del mismo
                Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(ingrediente.getIngrediente().getNombre());

                if (stockEncontrado.isPresent()) {
                    System.out.println("Stock db medida: " + stockEncontrado.get().getIngrediente().getMedida() + " y cantidad: " + stockEncontrado.get().getCantidad());
                    System.out.println("Stock db cliente medida: " + ingrediente.getMedida() + " y cantidad: " + ingrediente.getCantidad());
                    // Si el ingrediente tiene la misma medida que el stock almacenado entonces se calcula a la misma medida.

                    // Si hay stock, entonces se multiplica por la cantidad del menu requerida, si para un menu necesito 300 gramos de X ingrediente, si estoy pidiendo
                    // 4 menus, entonces necesitaría en total 1200 gramos de eso

                    if (stockEncontrado.get().getIngrediente().getMedida().equals(ingrediente.getMedida()) && stockEncontrado.get().getCantidad() < ingrediente.getCantidad() * cantidad) {
                        return new ResponseEntity<>("El stock no es suficiente", HttpStatus.BAD_REQUEST);

                    } else if (!stockEncontrado.get().getIngrediente().getMedida().equals("Kg") && ingrediente.getMedida().equals("Gramos")) {

                        // Si almacené el ingrediente por KG, y necesito 300 gramos en el menu, entonces convierto de KG a gramos para calcularlo en la misma medida
                        if (stockEncontrado.get().getCantidad() * 1000 < ingrediente.getCantidad() * cantidad) {
                            return new ResponseEntity<>("El stock no es suficiente", HttpStatus.BAD_REQUEST);
                        }

                    }
                }
            }
        } else {
            return new ResponseEntity<>("El menú no existe", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("El stock es suficiente", HttpStatus.CREATED);
    }

    @GetMapping("/restaurant/stock/check")
    public ResponseEntity<String> checkStock(@RequestParam(value = "menus") List<Menu> menus) {
        System.out.println(menus);
        for (Menu menu : menus) {
            for (IngredienteMenu ingrediente : menu.getIngredientesMenu()) {
                Optional<Stock> stockEncontrado = stockRepository.findStockByProductName(ingrediente.getIngrediente().getNombre());

                if (stockEncontrado.isPresent()) {
                    System.out.println("Stock db medida: " + stockEncontrado.get().getIngrediente().getMedida() + " y cantidad: " + stockEncontrado.get().getCantidad());
                    System.out.println("Stock db cliente medida: " + ingrediente.getMedida() + " y cantidad: " + ingrediente.getCantidad());
                    // Si el ingrediente tiene la misma medida que el stock almacenado entonces se calcula a la misma medida.
                    if (stockEncontrado.get().getIngrediente().getMedida().equals(ingrediente.getMedida()) && stockEncontrado.get().getCantidad() < ingrediente.getCantidad()) {
                        return new ResponseEntity<>("El stock no es suficiente", HttpStatus.BAD_REQUEST);
                    } else if (!stockEncontrado.get().getIngrediente().getMedida().equals("Kg") && ingrediente.getMedida().equals("Gramos")) {
                        // Si almacené el ingrediente por KG, y necesito 300 gramos en el menu, entonces convierto de KG a gramos para calcularlo en la misma medida
                        if (stockEncontrado.get().getCantidad() * 1000 < ingrediente.getCantidad()) {
                            return new ResponseEntity<>("El stock no es suficiente", HttpStatus.BAD_REQUEST);
                        }
                    }
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
