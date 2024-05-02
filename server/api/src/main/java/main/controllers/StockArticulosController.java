package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Productos.ArticuloVenta;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.StockArticuloVenta;
import main.repositories.IngredienteRepository;
import main.repositories.MenuRepository;
import main.repositories.StockArticuloVentaRepository;
import main.repositories.SucursalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class StockArticulosController {
    private final StockArticuloVentaRepository stockArticuloRepository;
    private final IngredienteRepository ingredienteRepository;
    private final MenuRepository menuRepository;
    private final SucursalRepository sucursalRepository;

    public StockArticulosController(StockArticuloVentaRepository stockArticuloRepository, IngredienteRepository ingredienteRepository, MenuRepository menuRepository, SucursalRepository sucursalRepository) {
        this.stockArticuloRepository = stockArticuloRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.menuRepository = menuRepository;
        this.sucursalRepository = sucursalRepository;
    }

    @GetMapping("/sucursal/{idSucursal}/stockArticuloVenta")
    public Set<StockArticuloVenta> getStock(@PathVariable("idSucursal") long id) {
        List<StockArticuloVenta> stockArticuloVenta = stockArticuloRepository.findAllByIdSucursal(id);
        if (stockArticuloVenta.isEmpty()) {
            return null;
        }

        return (Set<StockArticuloVenta>) stockArticuloVenta;
    }

    @GetMapping("/sucursal/{idSucursal}/stockArticuloVenta/check")
    public ResponseEntity<String> checkStock(@RequestParam(value = "articuloMenus") List<ArticuloVenta> articuloVentas, @PathVariable("idSucursal") long id) {
        for (ArticuloVenta articulo : articuloVentas) {
            Optional<StockArticuloVenta> stockEncontrado = stockArticuloRepository.findStockByProductNameAndIdSucursal(articulo.getNombre(), id);

            if (stockEncontrado.isPresent()) {
                if (stockEncontrado.get().getCantidadActual() < articulo.getCantidadMedida()) {
                    return new ResponseEntity<>("El stockArticuloVenta no es suficiente", HttpStatus.BAD_REQUEST);
                }
            }
        }
        return new ResponseEntity<>("El stockArticuloVenta es suficiente", HttpStatus.OK);
    }


    @Transactional
    @PostMapping("/sucursal/{idSucursal}/stockArticuloVenta/create")
    public ResponseEntity<String> crearStock(@RequestBody StockArticuloVenta stockDetail, @PathVariable("idSucursal") long id) {
        // Busco el ingrediente en la base de datos
        Optional<StockArticuloVenta> stockArticuloDB = stockArticuloRepository.findStockByProductNameAndIdSucursal(stockDetail.getArticuloVenta().getNombre(), id);

        // Si no hay stockArticuloVenta del producto cargado, entonces creamos uno nuevo. Caso contrario utilizamos y editamos el que ya está cargado en la base de datos
        if (stockArticuloDB.isEmpty()) {
            // Si no existe stockArticuloVenta de ese producto se crea un nuevo objeto

            StockArticuloVenta stock = new StockArticuloVenta();

            stock.setCantidadMaxima(stockDetail.getCantidadMaxima());
            stock.setCantidadMinima(stockDetail.getCantidadMinima());
            stock.setCantidadActual(stockDetail.getCantidadActual());
            stock.setPrecioCompra(stockDetail.getPrecioCompra());
            stock.setMedida(stockDetail.getMedida());
            stock.setArticuloVenta(stockDetail.getArticuloVenta());

            Sucursal sucursal = sucursalRepository.findById(id).get();
            stock.setSucursal(sucursal);

            stockArticuloRepository.save(stock);

            return new ResponseEntity<>("El stockArticuloVenta ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return new ResponseEntity<>("El stockArticuloVenta ya existe", HttpStatus.FOUND);
    }

    @PutMapping("/sucursal/{idSucursal}/stockArticuloVenta/update/")
    public ResponseEntity<String> actualizarStock(@RequestBody StockArticuloVenta stockArticuloVenta, @PathVariable("idSucursal") long id) {
        Optional<StockArticuloVenta> stockEncontrado = stockArticuloRepository.findByIdArticuloAndIdSucursal(stockArticuloVenta.getId(), id);

        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stockArticuloVenta no existe", HttpStatus.FOUND);
        }

        stockArticuloRepository.save(stockEncontrado.get());
        return new ResponseEntity<>("El stockArticuloVenta ha sido añadido correctamente", HttpStatus.CREATED);
    }

    @DeleteMapping("/sucursal/{idSucursal}/stockArticuloVenta/delete")
    public ResponseEntity<String> borrarStock(@RequestBody StockArticuloVenta stockArticuloVenta, @PathVariable("idSucursal") long id) {
        Optional<StockArticuloVenta> stockEncontrado = stockArticuloRepository.findStockByProductNameAndIdSucursal(stockArticuloVenta.getArticuloVenta().getNombre(), id);
        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stockArticuloVenta ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        stockEncontrado.get().setBorrado("SI");
        stockArticuloRepository.save(stockEncontrado.get());
        return new ResponseEntity<>("El stockArticuloVenta ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
