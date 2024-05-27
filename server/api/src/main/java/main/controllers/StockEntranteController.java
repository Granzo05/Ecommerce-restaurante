package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.Medida;
import main.entities.Productos.ArticuloVenta;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.DetalleStock;
import main.entities.Stock.DetalleStockDTO;
import main.entities.Stock.StockEntrante;
import main.entities.Stock.StockEntranteDTO;
import main.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class StockEntranteController {
    private final StockArticuloVentaRepository stockArticuloRepository;
    private final IngredienteRepository ingredienteRepository;
    private final ArticuloVentaRepository articuloVentaRepository;
    private final SucursalRepository sucursalRepository;
    private final StockEntranteRepository stockEntranteRepository;
    private final DetalleStockRepository detalleStockRepository;
    private final MedidaRepository medidaRepository;

    public StockEntranteController(StockArticuloVentaRepository stockArticuloRepository, IngredienteRepository ingredienteRepository, ArticuloVentaRepository articuloVentaRepository, SucursalRepository sucursalRepository, StockEntranteRepository stockEntranteRepository, DetalleStockRepository detalleStockRepository, MedidaRepository medidaRepository) {
        this.stockArticuloRepository = stockArticuloRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.articuloVentaRepository = articuloVentaRepository;
        this.sucursalRepository = sucursalRepository;
        this.stockEntranteRepository = stockEntranteRepository;
        this.detalleStockRepository = detalleStockRepository;
        this.medidaRepository = medidaRepository;
    }

    @GetMapping("/stockEntrante/{idSucursal}")
    public Set<StockEntranteDTO> getStock(@PathVariable("idSucursal") long id) {
        List<StockEntranteDTO> stocksEntrantes = stockEntranteRepository.findAllByIdSucursal(id);

        for (StockEntranteDTO stock : stocksEntrantes) {
            for (DetalleStockDTO detalleStockDTO : detalleStockRepository.findIngredienteByIdStock(stock.getId())) {
                stock.getDetallesStock().add(detalleStockDTO);
            }
            for (DetalleStockDTO detalleStockDTO : detalleStockRepository.findArticuloByIdStock(stock.getId())) {
                stock.getDetallesStock().add(detalleStockDTO);
            }
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

        // Obtener la sucursal y asignarla al stockDetail
        Sucursal sucursal = sucursalRepository.findById(id).get();
        stockDetail.setSucursal(sucursal);

        // Crear nuevos DetalleStock y asociarlos al stockDetail
        List<DetalleStock> nuevosDetalles = new ArrayList<>();
        for (DetalleStock detalle : stockDetail.getDetallesStock()) {
            DetalleStock nuevoDetalle = new DetalleStock();
            nuevoDetalle.setCantidad(detalle.getCantidad());
            nuevoDetalle.setCostoUnitario(detalle.getCostoUnitario());
            nuevoDetalle.setSubTotal(detalle.getSubTotal());
            Medida medida = medidaRepository.findById(detalle.getMedida().getId()).get();
            ;
            nuevoDetalle.setMedida(medida);
            // Asignar la entidad correcta de ArticuloVenta o Ingrediente
            if (detalle.getArticuloVenta() != null && detalle.getArticuloVenta().getNombre().length() > 2) {
                ArticuloVenta articulo = articuloVentaRepository.findByName(detalle.getArticuloVenta().getNombre()).get();
                nuevoDetalle.setArticuloVenta(articulo);
            } else if (detalle.getIngrediente() != null && detalle.getIngrediente().getNombre().length() > 2) {
                Ingrediente ingrediente = ingredienteRepository.findByNameAndIdSucursal(detalle.getIngrediente().getNombre(), id).get();
                nuevoDetalle.setIngrediente(ingrediente);
            } else {
                return ResponseEntity.badRequest().body("No se han recibido los articulos correctamente");
            }

            // Asociar el nuevo detalle al stockDetail
            nuevoDetalle.setStockEntrante(stockDetail);
            nuevosDetalles.add(nuevoDetalle);
        }

        // Asociar los nuevos detalles al stockDetail
        stockDetail.setDetallesStock(new HashSet<>(nuevosDetalles));

        // Guardar el StockEntrante y sus detalles
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

            stock.setFechaLlegada(stockEntrante.getFechaLlegada());

            List<DetalleStock> detallesStockDB = stock.getDetallesStock().stream().toList();

            List<DetalleStock> detallesStockEntrante = stockEntrante.getDetallesStock().stream().toList();

            // Si los detalles no coinciden a los ya guardados los borramos y volvemos a asignarlos al stock almacenado
            if (detallesStockDB.size() != detallesStockEntrante.size()) {
                detalleStockRepository.deleteAll(detallesStockDB);

                stock.setDetallesStock(stockEntrante.getDetallesStock());
            }

            stock.setBorrado(stockEntrante.getBorrado());

            stockEntranteRepository.save(stock);
            return ResponseEntity.ok("El stock ha sido actualizado correctamente");
        } else {
            return ResponseEntity.ofNullable("El stock no existe");
        }
    }
}
