package main.controllers;

import main.entities.Productos.ArticuloVenta;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.StockArticuloVenta;
import main.repositories.ArticuloVentaRepository;
import main.repositories.IngredienteRepository;
import main.repositories.StockArticuloVentaRepository;
import main.repositories.SucursalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
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

    @CrossOrigin
    @GetMapping("/stockArticulos/{idSucursal}")
    public Set<StockArticuloVenta> getStock(@PathVariable("idSucursal") Long id) {
        return new HashSet<>(stockArticuloRepository.findAllByIdSucursal(id));
    }

    @CrossOrigin
    @GetMapping("/sucursal/{idSucursal}/stockArticulo/check/{idArticulo}/{cantidadNecesaria}")
    public boolean checkStock(@PathVariable("idArticulo") long idArticulo, @PathVariable("idSucursal") long idSucursal, @PathVariable("cantidadNecesaria") int cantidad) {
        // True hay stock, false no
        Optional<StockArticuloVenta> stockArticuloVenta = stockArticuloRepository.findByIdAndIdSucursal(idArticulo, idSucursal);

        if (stockArticuloVenta.isPresent()) {
            // Si el stock actual es menor a la cantidad, o descontando la cantidad el stock es 0
            if (stockArticuloVenta.get().getCantidadActual() < cantidad || stockArticuloVenta.get().getCantidadActual() - cantidad <= 0) {
                return false;
            }
        }

        return true;
    }


    @CrossOrigin
    @PostMapping("/sucursal/{idSucursal}/stockArticuloVenta/create")
    public ResponseEntity<String> crearStock(@RequestBody StockArticuloVenta stockDetail, @PathVariable("idSucursal") long id) {
        System.out.println(stockDetail);
        Optional<ArticuloVenta> articuloDB = articuloVentaRepository.findByName(stockDetail.getArticuloVenta().getNombre());

        if (articuloDB.isPresent()) {
            // Busco el ingrediente en la base de datos
            Optional<StockArticuloVenta> stockArticuloDB = stockArticuloRepository.findStockByProductNameAndIdSucursal(stockDetail.getArticuloVenta().getNombre(), id);

            // Si no hay stockArticuloVenta del producto cargado, entonces creamos uno nuevo. Caso contrario utilizamos y editamos el que ya está cargado en la base de datos
            if (stockArticuloDB.isEmpty()) {
                StockArticuloVenta stock = new StockArticuloVenta();

                stock.setCantidadMinima(stockDetail.getCantidadMinima());
                stock.setCantidadMaxima(stockDetail.getCantidadMaxima());
                stock.setCantidadActual(stockDetail.getCantidadActual());
                stock.setPrecioCompra(stockDetail.getPrecioCompra());
                stock.setMedida(stockDetail.getMedida());

                ArticuloVenta articulo = articuloVentaRepository.findByName(stockDetail.getArticuloVenta().getNombre()).get();
                stock.setArticuloVenta(articulo);
                Sucursal sucursal = sucursalRepository.findById(id).get();
                stock.getSucursales().add(sucursal);

                stockArticuloRepository.save(stock);

                return new ResponseEntity<>("El stockArticuloVenta ha sido añadido correctamente", HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("El stock ya existe", HttpStatus.FOUND);
            }
        } else {
            return ResponseEntity.badRequest().body("No existe ningun articulo con ese nombre, debe crearlo antes de asignarle un stock");
        }
    }

    @CrossOrigin
    @PutMapping("sucursal/{idSucursal}/stockArticulo/update")
    public ResponseEntity<String> actualizarStock(@RequestBody StockArticuloVenta stockIngredientes, @PathVariable("idSucursal") long id) {
        // Busco el stockIngredientes de ese ingrediente
        Optional<StockArticuloVenta> stockEncontrado = stockArticuloRepository.findByIdAndIdSucursal(stockIngredientes.getId(), id);

        if (stockEncontrado.isPresent() && stockEncontrado.get().getBorrado().equals(stockIngredientes.getBorrado())) {
            StockArticuloVenta stock = stockEncontrado.get();

            stock.setCantidadMinima(stockIngredientes.getCantidadMinima());
            stock.setCantidadMaxima(stockIngredientes.getCantidadMaxima());
            stock.setCantidadActual(stockIngredientes.getCantidadActual());
            stock.setPrecioCompra(stockIngredientes.getPrecioCompra());
            stock.setMedida(stockIngredientes.getMedida());

            stockArticuloRepository.save(stock);
            return ResponseEntity.ok("El stock ha sido actualizado correctamente");
        } else if (stockEncontrado.isPresent() && !stockEncontrado.get().getBorrado().equals(stockIngredientes.getBorrado())) {
            StockArticuloVenta stock = stockEncontrado.get();

            stock.setBorrado(stockIngredientes.getBorrado());

            stockArticuloRepository.save(stock);
            return ResponseEntity.ok("El stock ha sido actualizado correctamente");

        }

        return ResponseEntity.ofNullable("El stock no existe");
    }

}
