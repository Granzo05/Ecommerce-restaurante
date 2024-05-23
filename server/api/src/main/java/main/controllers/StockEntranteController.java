package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Productos.ArticuloVenta;
import main.entities.Stock.DetalleStock;
import main.entities.Stock.DetalleStockDTO;
import main.entities.Stock.StockEntrante;
import main.entities.Stock.StockEntranteDTO;
import main.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class StockEntranteController {
    private final StockArticuloVentaRepository stockArticuloRepository;
    private final IngredienteRepository ingredienteRepository;
    private final ArticuloVentaRepository articuloVentaRepository;
    private final SucursalRepository sucursalRepository;
    private final StockEntranteRepository stockEntranteRepository;
    private final DetalleStockRepository detalleStockRepository;

    public StockEntranteController(StockArticuloVentaRepository stockArticuloRepository, IngredienteRepository ingredienteRepository, ArticuloVentaRepository articuloVentaRepository, SucursalRepository sucursalRepository, StockEntranteRepository stockEntranteRepository, DetalleStockRepository detalleStockRepository) {
        this.stockArticuloRepository = stockArticuloRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.articuloVentaRepository = articuloVentaRepository;
        this.sucursalRepository = sucursalRepository;
        this.stockEntranteRepository = stockEntranteRepository;
        this.detalleStockRepository = detalleStockRepository;
    }

    @GetMapping("/stockEntrante/{idSucursal}")
    public Set<StockEntranteDTO> getStock(@PathVariable("idSucursal") long id) {
        List<StockEntranteDTO> stocksEntrantes = stockEntranteRepository.findAllByIdSucursal(id);

        for (StockEntranteDTO stock : stocksEntrantes) {
            List<DetalleStockDTO> detalles = detalleStockRepository.findByIdStock(stock.getId());
            System.out.println(detalles);
/*
            for(DetalleStockDTO detalleStockDTO: detalles) {
                Optional<ArticuloVenta> articulo = articuloVentaRepository.findByName(detalleStockDTO.getArticuloVentaNombre());

                if (articulo.isPresent()) {
                    detalleStockDTO.setArticuloVenta(articulo.get());
                } else {
                    Optional<Ingrediente> ingrediente = ingredienteRepository.findByName(detalleStockDTO.getIngredienteNombre());
                    detalleStockDTO.setIngrediente(ingrediente.get());
                }
            }
*/
            stock.setDetallesStock(new HashSet<>(detalles));
        }

        return new HashSet<>(stocksEntrantes);
    }

    @Transactional
    @PostMapping("/sucursal/{idSucursal}/StockEntrante/create")
    public ResponseEntity<String> crearStock(@RequestBody StockEntrante stockDetail, @PathVariable("idSucursal") long id) {
        Optional<StockEntrante> stockEntranteDB = stockEntranteRepository.findByIdSucursalAndFecha(id, stockDetail.getFechaLlegada());
        System.out.println(stockDetail);
        // Verificar si existe un pedido para la misma fecha y comparar los detalles
        if (stockEntranteDB.isPresent()) {
            StockEntrante stock = stockEntranteDB.get();
            if (compararStocks(stock, stockDetail)) {
                return ResponseEntity.badRequest().body("Ya hay un pedido cargado para esa fecha con los mismos detalles");
            }
        }

        // Si no existe un pedido igual, crearlo
        stockDetail.setSucursal(sucursalRepository.findById(id).get());

        for (DetalleStock detalle : stockDetail.getDetallesStock()) {
            // Asignamos la sucursal completa
            detalle.setStockEntrante(stockDetail);

            // Asignamos el articulo o el ingrediente completo
            if (detalle.getArticuloVenta() != null) {
                detalle.setArticuloVenta(articuloVentaRepository.findByName(detalle.getArticuloVenta().getNombre()).get());
            } else if (detalle.getIngrediente() != null) {
                detalle.setIngrediente(ingredienteRepository.findByName(detalle.getIngrediente().getNombre()).get());
            }
        }

        stockEntranteRepository.save(stockDetail);
        return ResponseEntity.ok("El pedido fue cargado con éxito");
    }

    // Método auxiliar para comparar los detalles del stock
    private boolean compararStocks(StockEntrante stockDB, StockEntrante stockEntrante) {
        if (stockDB.getDetallesStock().size() != stockEntrante.getDetallesStock().size()) {
            return false;
        }

        for (DetalleStock detalleDB : stockDB.getDetallesStock()) {
            boolean encontrado = false;
            for (DetalleStock detalleEntrante : stockEntrante.getDetallesStock()) {
                if (detalleDB.equals(detalleEntrante)) {
                    encontrado = true;
                    break;
                }
            }
            if (!encontrado) {
                return false;
            }
        }

        return true;
    }

    @PutMapping("sucursal/{idSucursal}/stockEntrante/update")
    public ResponseEntity<String> actualizarStock(@RequestBody StockEntrante stockEntrante, @PathVariable("idSucursal") long id) {
        // Busco el stockIngredientes de ese ingrediente
        Optional<StockEntrante> stockEncontrado = stockEntranteRepository.findByIdAndIdSucursal(stockEntrante.getId(), id);

        if (stockEncontrado.isPresent()) {
            StockEntrante stock = stockEncontrado.get();

            stock.setFechaLlegada(stockEntrante.fechaLlegada);

            List<DetalleStock> detallesStockDB = stock.getDetallesStock().stream().toList();

            List<DetalleStock> detallesStockEntrante = stockEntrante.getDetallesStock().stream().toList();

            // Si los detalles no coinciden a los ya guardados los borramos y volvemos a asignarlos al stock almacenado
            if (detallesStockDB.size() != detallesStockEntrante.size()) {
                detalleStockRepository.deleteAll(detallesStockDB);

                stock.setDetallesStock(stockEntrante.getDetallesStock());
            }

            stockEntranteRepository.save(stock);
            return ResponseEntity.ok("El stock ha sido actualizado correctamente");
        } else {
            return ResponseEntity.ofNullable("El stock no existe");
        }
    }

    @PutMapping("/sucursal/{idSucursal}/stockEntrante/{stockId}/delete")
    public ResponseEntity<String> borrarStock(@PathVariable("stockId") Long idStock, @PathVariable("idSucursal") Long idSucursal) {
        Optional<StockEntrante> stockEncontrado = stockEntranteRepository.findByIdAndIdSucursal(idStock, idSucursal);
        if (stockEncontrado.isEmpty()) {
            return new ResponseEntity<>("El stock entrante ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }

        stockEncontrado.get().setBorrado("SI");
        stockEntranteRepository.save(stockEncontrado.get());
        return new ResponseEntity<>("El stock entrante ha sido borrado correctamente", HttpStatus.ACCEPTED);
    }
}
