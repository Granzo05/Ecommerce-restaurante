package main.controllers;

import jakarta.transaction.Transactional;
import main.entities.Ingredientes.Ingrediente;
import main.entities.Ingredientes.Medida;
import main.entities.Productos.ArticuloVenta;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.DetalleStock;
import main.entities.Stock.StockArticuloVenta;
import main.entities.Stock.StockEntrante;
import main.entities.Stock.StockIngredientes;
import main.repositories.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class StockEntranteController {
    private final StockArticuloVentaRepository stockArticuloRepository;
    private final StockIngredientesRepository stockIngredientesRepository;
    private final IngredienteRepository ingredienteRepository;
    private final ArticuloVentaRepository articuloVentaRepository;
    private final SucursalRepository sucursalRepository;
    private final StockEntranteRepository stockEntranteRepository;
    private final DetalleStockRepository detalleStockRepository;
    private final MedidaRepository medidaRepository;

    public StockEntranteController(StockArticuloVentaRepository stockArticuloRepository, StockIngredientesRepository stockIngredientesRepository, IngredienteRepository ingredienteRepository, ArticuloVentaRepository articuloVentaRepository, SucursalRepository sucursalRepository, StockEntranteRepository stockEntranteRepository, DetalleStockRepository detalleStockRepository, MedidaRepository medidaRepository) {
        this.stockArticuloRepository = stockArticuloRepository;
        this.stockIngredientesRepository = stockIngredientesRepository;
        this.ingredienteRepository = ingredienteRepository;
        this.articuloVentaRepository = articuloVentaRepository;
        this.sucursalRepository = sucursalRepository;
        this.stockEntranteRepository = stockEntranteRepository;
        this.detalleStockRepository = detalleStockRepository;
        this.medidaRepository = medidaRepository;
    }

    @CrossOrigin
    @GetMapping("/stockEntrante/pendientes/{idSucursal}")
    public Set<StockEntrante> getStockPendiente(@PathVariable("idSucursal") long id) {
        List<StockEntrante> stocksEntrantes = stockEntranteRepository.findAllPendientesByIdSucursal(id);

        for (StockEntrante stock : stocksEntrantes) {
            for (DetalleStock detalleStockDTO : detalleStockRepository.findIngredienteByIdStock(stock.getId())) {
                stock.getDetallesStock().add(detalleStockDTO);
            }
            for (DetalleStock detalleStockDTO : detalleStockRepository.findArticuloByIdStock(stock.getId())) {
                stock.getDetallesStock().add(detalleStockDTO);
            }
        }

        return new HashSet<>(stocksEntrantes);
    }

    @CrossOrigin
    @GetMapping("/stockEntrante/entregados/{idSucursal}")
    public Set<StockEntrante> getStockEntregado(@PathVariable("idSucursal") long id) {
        List<StockEntrante> stocksEntrantes = stockEntranteRepository.findAllEntregadosByIdSucursal(id);

        for (StockEntrante stock : stocksEntrantes) {
            for (DetalleStock detalleStockDTO : detalleStockRepository.findIngredienteByIdStock(stock.getId())) {
                stock.getDetallesStock().add(detalleStockDTO);
            }
            for (DetalleStock detalleStockDTO : detalleStockRepository.findArticuloByIdStock(stock.getId())) {
                stock.getDetallesStock().add(detalleStockDTO);
            }
        }

        return new HashSet<>(stocksEntrantes);
    }

    @CrossOrigin
    @Transactional
    @PostMapping("/sucursal/{idSucursal}/StockEntrante/create")
    public ResponseEntity<String> crearStock(@RequestBody StockEntrante stockDetail, @PathVariable("idSucursal") long id) {
        Optional<StockEntrante> stockEntranteDB = stockEntranteRepository.findByIdSucursalAndFecha(id, stockDetail.getFechaLlegada());
        // Verificar si existe un pedido para la misma fecha y comparar los detalles
        if (stockEntranteDB.isPresent()) {
            StockEntrante stock = stockEntranteDB.get();
            if (compararStocks(stock, stockDetail)) {
                return ResponseEntity.badRequest().body("Ya hay un pedido cargado para esa fecha con los mismos detalles");
            }
        }

        stockDetail.setEstado("PENDIENTES");

        // Obtener la sucursal y asignarla al stockDetail
        Sucursal sucursal = sucursalRepository.findById(id).get();
        stockDetail.getSucursales().add(sucursal);

        // Crear nuevos DetalleStock y asociarlos al stockDetail
        List<DetalleStock> nuevosDetalles = new ArrayList<>();
        for (DetalleStock detalle : stockDetail.getDetallesStock()) {
            DetalleStock nuevoDetalle = new DetalleStock();
            nuevoDetalle.setCantidad(detalle.getCantidad());
            nuevoDetalle.setCostoUnitario(detalle.getCostoUnitario());
            nuevoDetalle.setSubTotal(detalle.getSubTotal());
            Medida medida = medidaRepository.findById(detalle.getMedida().getId()).get();

            nuevoDetalle.setMedida(medida);

            // Asignar la entidad correcta de ArticuloVenta o Ingrediente
            if (detalle.getArticuloVenta() != null && detalle.getArticuloVenta().getNombre().length() > 2) {
                ArticuloVenta articulo = articuloVentaRepository.findByName(detalle.getArticuloVenta().getNombre()).get();
                nuevoDetalle.setArticuloVenta(articulo);

                // Buscamos el stock almacenado del articulo
                Optional<StockArticuloVenta> stockArticulo = stockArticuloRepository.findByIdArticuloAndIdSucursal(articulo.getId(), id);

                // Comparamos el precio almacenado de compra con la nueva compra
                if(stockArticulo.isPresent()) {
                    // Si los precios son distintos, asignamos el precio de compra nuevo para poder calcular mejor el costo de los menus y no perder plata
                    if(stockArticulo.get().getPrecioCompra() != detalle.getCostoUnitario()) {
                        stockArticulo.get().setPrecioCompra(detalle.getCostoUnitario());

                        stockArticuloRepository.save(stockArticulo.get());
                    }
                }
            } else if (detalle.getIngrediente() != null && detalle.getIngrediente().getNombre().length() > 2) {
                Ingrediente ingrediente = ingredienteRepository.findByNameAndIdSucursal(detalle.getIngrediente().getNombre(), id).get();
                nuevoDetalle.setIngrediente(ingrediente);

                // Buscamos el stock almacenado del articulo
                Optional<StockIngredientes> stockIngrediente = stockIngredientesRepository.findStockByIngredienteNameAndIdSucursal(ingrediente.getNombre(), id);

                // Comparamos el precio almacenado de compra con la nueva compra
                if(stockIngrediente.isPresent()) {
                    // Si los precios son distintos, asignamos el precio de compra nuevo para poder calcular mejor el costo de los menus y no perder plata
                    if(stockIngrediente.get().getPrecioCompra() != detalle.getCostoUnitario()) {
                        stockIngrediente.get().setPrecioCompra(detalle.getCostoUnitario());

                        stockIngredientesRepository.save(stockIngrediente.get());
                    }
                }
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

    @CrossOrigin
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

            stock.setEstado(stockEntrante.getEstado());

            stockEntranteRepository.save(stock);
            return ResponseEntity.ok("El stock ha sido actualizado correctamente");
        } else {
            return ResponseEntity.ofNullable("El stock no existe");
        }
    }
}
