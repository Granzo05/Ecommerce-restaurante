package main.controllers;

import main.entities.Factura.EnumMetodoPago;
import main.entities.Factura.EnumTipoFactura;
import main.entities.Factura.Factura;
import main.entities.Pedidos.DetallesPedido;
import main.entities.Pedidos.EnumTipoEnvio;
import main.entities.Pedidos.Pedido;
import main.repositories.FacturaRepository;
import main.repositories.PedidoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class FacturaController {
    private final FacturaRepository facturaRepository;
    private final PedidoRepository pedidoRepository;

    public FacturaController(FacturaRepository facturaRepository,
                             PedidoRepository pedidoRepository) {
        this.facturaRepository = facturaRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @PostMapping("/factura/create")
    public Pedido crearFactura(@RequestBody Pedido pedido) {

        Factura factura = new Factura();

        factura.setTipoFactura(EnumTipoFactura.B);

        if (pedido.getTipoEnvio().equals(EnumTipoEnvio.TIENDA)) {
            factura.setMetodoPago(EnumMetodoPago.EFECTIVO);
        } else {
            factura.setMetodoPago(EnumMetodoPago.MERCADOPAGO);
        }

        double total = 0;

        for (DetallesPedido detalle : pedido.getDetallesPedido()) {
            total += detalle.getSubTotal() * detalle.getCantidad();
        }

        factura.setTotal(total);

        Factura facturaSave = facturaRepository.save(factura);

        pedido.setFactura(facturaSave);

        return pedido;
    }

    @GetMapping("/facturas/cliente/{id}")
    public Set<Factura> getFacturas(@PathVariable("id") Long id) {
        List<Factura> facturas = facturaRepository.findByIdCliente(id);

        return new HashSet<>(facturas);
    }


}
