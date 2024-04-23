package main.controllers;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import main.entities.Factura.EnumMetodoPago;
import main.entities.Factura.Factura;
import main.entities.Factura.TipoFactura;
import main.entities.Pedidos.DetallesPedido;
import main.entities.Pedidos.EnumTipoEnvio;
import main.entities.Pedidos.Pedido;
import main.repositories.FacturaRepository;
import main.repositories.PedidoRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

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

        factura.setTipoFactura(TipoFactura.B);

        if (pedido.getTipoEnvio().equals(EnumTipoEnvio.TIENDA)) {
            factura.setMetodoPago("EFECTIVO");
        } else {
            factura.setMetodoPago("MERCADOPAGO");
        }

        factura.setCliente(pedido.getCliente());

        Factura facturaSave = facturaRepository.save(factura);

        pedido.setFactura(facturaSave);

        return pedido;
    }

    @GetMapping("/bills/client/{id}")
    public List<Factura> getBillsClientId(@PathVariable("id") Long id) {
        return facturaRepository.findByIdCliente(id);
    }


}
