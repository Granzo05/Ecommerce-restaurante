package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Productos.ArticuloMenu;
import main.entities.Stock.Stock;
import main.entities.Stock.StockArticuloVenta;
import main.repositories.IngredienteRepository;
import main.repositories.MenuRepository;
import main.repositories.StockArticuloVentaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class StockController {
    private final StockArticuloVentaRepository stockArticuloRepository;
    private final IngredienteRepository ingredienteRepository;
    private final MenuRepository menuRepository;

    public StockController(StockArticuloVentaRepository stockArticuloRepository, IngredienteRepository ingredienteRepository, MenuRepository menuRepository) {
        this.stockArticuloRepository = stockArticuloRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.menuRepository = menuRepository;
    }

    @GetMapping("/stockArticuloVenta")
    public List<StockArticuloVenta> getStock() {
        List<StockArticuloVenta> stockArticuloVenta = stockArticuloRepository.findAll();
        if (stockArticuloVenta.isEmpty()) {
            return null;
        }

        return stockArticuloVenta;
    }


    @GetMapping("/stockArticuloVenta/{nombre}/{cantidad}")
    public ResponseEntity<String> getStockPorNombre(@PathVariable("nombre") String nombre, @PathVariable("cantidad") int cantidad) {
        // Recibimos el nombre del menu y la cantidad pedida del mismo
        Optional<ArticuloMenu> menu = menuRepository.findByName(nombre);

        if (!menu.isEmpty()) {
            // Buscamos ingrediente por ingrediente a ver si el stockArticuloVenta es suficiente
            for (IngredienteMenu ingrediente : menu.get().getIngredientesMenu()) {
                // Mediante el ingrediente accedemos al stockArticuloVenta del mismo
                Optional<StockArticuloVenta> stockEncontrado = stockArticuloRepository.findStockByProductName(ingrediente.getIngrediente().getNombre());

                if (stockEncontrado.isPresent()) {
                    System.out.println("StockArticuloVenta db medida: " + stockEncontrado.get().getMedida() + " y cantidad: " + stockEncontrado.get().getCantidadActual());
                    System.out.println("StockArticuloVenta db cliente medida: " + ingrediente.getMedida() + " y cantidad: " + ingrediente.getCantidad());
                    // Si el ingrediente tiene la misma medida que el stockArticuloVenta almacenado entonces se calcula a la misma medida.

                    // Si hay stockArticuloVenta, entonces se multiplica por la cantidad del menu requerida, si para un menu necesito 300 gramos de X ingrediente, si estoy pidiendo
                    // 4 menus, entonces necesitaría en total 1200 gramos de eso

                    if (stockEncontrado.get().getMedida().equals(ingrediente.getMedida()) && stockEncontrado.get().getCantidadActual() < ingrediente.getCantidad() * cantidad) {
                        return new ResponseEntity<>("El stockArticuloVenta no es suficiente", HttpStatus.BAD_REQUEST);

                    } else if (!stockEncontrado.get().getMedida().equals("Kg") && ingrediente.getMedida().equals("Gramos")) {

                        // Si almacené el ingrediente por KG, y necesito 300 gramos en el menu, entonces convierto de KG a gramos para calcularlo en la misma medida
                        if (stockEncontrado.get().getCantidadActual() * 1000 < ingrediente.getCantidad() * cantidad) {
                            return new ResponseEntity<>("El stockArticuloVenta no es suficiente", HttpStatus.BAD_REQUEST);
                        }

                    }
                }
            }
        } else {
            return new ResponseEntity<>("El menú no existe", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("El stockArticuloVenta es suficiente", HttpStatus.CREATED);
    }

    @GetMapping("/restaurant/stockArticuloVenta/check")
    public ResponseEntity<String> checkStock(@RequestParam(value = "articuloMenus") List<ArticuloMenu> articuloMenus) {
        System.out.println(articuloMenus);
        for (ArticuloMenu articuloMenu : articuloMenus) {
            for (IngredienteMenu ingrediente : articuloMenu.getIngredientesMenu()) {
                Optional<StockArticuloVenta> stockEncontrado = stockArticuloRepository.findStockByProductName(ingrediente.getIngrediente().getNombre());

                if (stockEncontrado.isPresent()) {
                    System.out.println("StockArticuloVenta db medida: " + stockEncontrado.get().getMedida() + " y cantidad: " + stockEncontrado.get().getCantidadActual());
                    System.out.println("StockArticuloVenta db cliente medida: " + ingrediente.getMedida() + " y cantidad: " + ingrediente.getCantidad());
                    // Si el ingrediente tiene la misma medida que el stockArticuloVenta almacenado entonces se calcula a la misma medida.
                    if (stockEncontrado.get().getMedida().equals(ingrediente.getMedida()) && stockEncontrado.get().getCantidadActual() < ingrediente.getCantidad()) {
                        return new ResponseEntity<>("El stockArticuloVenta no es suficiente", HttpStatus.BAD_REQUEST);
                    } else if (!stockEncontrado.get().getMedida().equals("Kg") && ingrediente.getMedida().equals("Gramos")) {
                        // Si almacené el ingrediente por KG, y necesito 300 gramos en el menu, entonces convierto de KG a gramos para calcularlo en la misma medida
                        if (stockEncontrado.get().getCantidadActual() * 1000 < ingrediente.getCantidad()) {
                            return new ResponseEntity<>("El stockArticuloVenta no es suficiente", HttpStatus.BAD_REQUEST);
                        }
                    }
                }
            }
        }
        return new ResponseEntity<>("El stockArticuloVenta es suficiente", HttpStatus.CREATED);
    }


    @Transactional
    @PostMapping("/stockArticuloVenta/create")
    public ResponseEntity<String> crearStock(@RequestBody StockArticuloVenta stockDetail) {
        System.out.println(stockDetail);
        // Busco el ingrediente en la base de datos
        Ingrediente ingredienteDB = ingredienteRepository.findByName(stockDetail.getArticuloVenta().getNombre());

        // Si no hay stockArticuloVenta del producto cargado, entonces creamos uno nuevo. Caso contrario utilizamos y editamos el que ya está cargado en la base de datos
        if (ingredienteDB == null) {
            // Si no existe stockArticuloVenta de ese producto se crea un nuevo objeto
            StockArticuloVenta stockArticuloVenta = StockArticuloVenta.builder()
                    .fechaIngreso(stockDetail.getFechaIngreso())
                    .articuloVenta(stockDetail.getArticuloVenta())
                    .build();


            Ingrediente ingrediente = Ingrediente.builder()
                    .nombre(stockDetail.getIngrediente().getNombre())
                    .costo(stockDetail.getIngrediente().getCosto())
                    .medida(stockDetail.getIngrediente().getMedida())
                    .borrado("NO")
                    .build();

            // Asignamos el ingrediente a este nuevo stockArticuloVenta
            stockArticuloVenta.setIngrediente(ingrediente);

            // Guardamos nuevamente el ingredienteDB con los posibles datos nuevos
            ingredienteRepository.save(ingrediente);

            // Finalmente se guarda y se devuelve un mensaje con el ok
            stockArticuloRepository.save(stockArticuloVenta);

            return new ResponseEntity<>("El stockArticuloVenta ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return new ResponseEntity<>("El stockArticuloVenta ya existe", HttpStatus.FOUND);
    }

    @PutMapping("/stockArticuloVenta/update")
    public ResponseEntity<String> actualizarStock(@RequestBody StockArticuloVenta stockArticuloVenta) {
        Ingrediente ingredienteDB = ingredienteRepository.findByName(stockArticuloVenta.getIngrediente().getNombre());

        // Busco el stockArticuloVenta de ese ingrediente
        Optional<StockArticuloVenta> stockEncontrado = stockArticuloRepository.findByIdIngrediente(ingredienteDB.getId());

        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stockArticuloVenta no existe", HttpStatus.FOUND);
        }

        stockArticuloRepository.save(stockEncontrado.get());
        return new ResponseEntity<>("El stockArticuloVenta ha sido añadido correctamente", HttpStatus.CREATED);
    }

    @DeleteMapping("stockArticuloVenta/delete")
    public ResponseEntity<String> borrarStock(@RequestBody StockArticuloVenta stockArticuloVenta) {
        Optional<StockArticuloVenta> stockEncontrado = stockArticuloRepository.findStockByProductName(stockArticuloVenta.getArticuloVenta().getNombre());
        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stockArticuloVenta ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        stockEncontrado.get().setBorrado("SI");
        stockArticuloRepository.save(stockEncontrado.get());
        return new ResponseEntity<>("El stockArticuloVenta ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
