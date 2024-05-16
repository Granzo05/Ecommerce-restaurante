package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Productos.ArticuloVenta;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.StockArticuloVenta;
import main.entities.Stock.StockArticuloVentaDTO;
import main.entities.Stock.StockDTO;
import main.repositories.ArticuloVentaRepository;
import main.repositories.IngredienteRepository;
import main.repositories.StockArticuloVentaRepository;
import main.repositories.SucursalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class StockArticulosController {
    private final StockArticuloVentaRepository stockArticuloRepository;
    private final IngredienteRepository ingredienteRepository;
    private final ArticuloVentaRepository articuloVentaRepository;
    private final SucursalRepository sucursalRepository;

    public StockArticulosController(StockArticuloVentaRepository stockArticuloRepository, IngredienteRepository ingredienteRepository, ArticuloVentaRepository articuloVentaRepository, SucursalRepository sucursalRepository) {
        this.stockArticuloRepository = stockArticuloRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.articuloVentaRepository = articuloVentaRepository;
        this.sucursalRepository = sucursalRepository;
    }

    @GetMapping("/stockArticulos/{idSucursal}")
    public Set<StockArticuloVentaDTO> getStock(@PathVariable("idSucursal") long id) {
        return new HashSet<>(stockArticuloRepository.findAllByIdSucursal(id));
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
    public ResponseEntity<String> crearStock(@RequestBody StockDTO stockDetail, @PathVariable("idSucursal") long id) {
        // Busco el ingrediente en la base de datos
        Optional<StockArticuloVenta> stockArticuloDB = stockArticuloRepository.findStockByProductNameAndIdSucursal(stockDetail.getNombre(), id);

        Long idArticulo = 0L;
        // Si el cliente no se ha creado en su sección lo creamos para evitar trabajar doble
        if (stockArticuloDB.isEmpty()) {

            ArticuloVenta articulo = new ArticuloVenta();
            articulo.setNombre(stockDetail.getNombre());

            articulo = articuloVentaRepository.save(articulo);
            idArticulo = articulo.getId();
        } else {
            idArticulo = stockArticuloDB.get().getId();
        }

        // Si no hay stockArticuloVenta del producto cargado, entonces creamos uno nuevo. Caso contrario utilizamos y editamos el que ya está cargado en la base de datos
        if (stockArticuloDB.isEmpty()) {
            StockArticuloVenta stock = new StockArticuloVenta();

            stock.setCantidadMinima(stockDetail.getCantidadMinima());
            stock.setCantidadMaxima(stockDetail.getCantidadMaxima());
            stock.setCantidadActual(stockDetail.getCantidadActual());
            stock.setPrecioCompra(stockDetail.getPrecioCompra());
            stock.setMedida(stockDetail.getMedida());

            stock.setArticuloVenta(articuloVentaRepository.findById(idArticulo).get());
            Sucursal sucursal = sucursalRepository.findById(id).get();
            stock.setSucursal(sucursal);

            stockArticuloRepository.save(stock);

            return new ResponseEntity<>("El stockArticuloVenta ha sido añadido correctamente", HttpStatus.CREATED);
        }

        return new ResponseEntity<>("El stockArticuloVenta ya existe", HttpStatus.FOUND);
    }

    @PutMapping("sucursal/{idSucursal}/stockArticulo/update")
    public ResponseEntity<String> actualizarStock(@RequestBody StockDTO stockIngredientes, @PathVariable("idSucursal") long id) {
        // Busco el stockIngredientes de ese ingrediente
        Optional<StockArticuloVenta> stockEncontrado = stockArticuloRepository.findByIdAndIdSucursal(stockIngredientes.getId(), id);

        if (stockEncontrado.isPresent()) {
            StockArticuloVenta stock = stockEncontrado.get();

            stock.setCantidadMinima(stockIngredientes.getCantidadMinima());
            stock.setCantidadMaxima(stockIngredientes.getCantidadMaxima());
            stock.setCantidadActual(stockIngredientes.getCantidadActual());
            stock.setPrecioCompra(stockIngredientes.getPrecioCompra());
            stock.setMedida(stockIngredientes.getMedida());

            stockArticuloRepository.save(stock);
            return ResponseEntity.ok("El stock ha sido actualizado correctamente");
        } else {
            return ResponseEntity.ofNullable("El stock no existe");
        }
    }

    @PutMapping("/sucursal/{idSucursal}/stockArticuloVenta/{stockId}/delete")
    public ResponseEntity<String> borrarStock(@PathVariable("stockId") Long idStock, @PathVariable("idSucursal") Long idSucursal) {
        Optional<StockArticuloVenta> stockEncontrado = stockArticuloRepository.findByIdAndIdSucursal(idStock, idSucursal);
        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stockArticuloVenta ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        stockEncontrado.get().setBorrado("SI");
        stockArticuloRepository.save(stockEncontrado.get());
        return new ResponseEntity<>("El stockArticuloVenta ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
