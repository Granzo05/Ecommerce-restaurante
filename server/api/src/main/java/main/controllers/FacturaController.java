package main.controllers;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import main.entities.Factura.Factura;
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

    @PostMapping("/bill/create")
    public void crearFactura(@RequestBody Factura facturaDetails) {
        Optional<Factura> user = facturaRepository.findById(facturaDetails.getId());
        // Todo: Corregir
        facturaRepository.save(facturaDetails);
    }

    @GetMapping("/bills/client/{id}")
    public List<Factura> getBillsClientId(@PathVariable("id") Long id) {
        return facturaRepository.findByIdCliente(id);
    }

    // Enviar Factura asociada al pedido como pdf
    @GetMapping("/bill/order/{idPedido}/pdf")
    public ResponseEntity<byte[]> generarFacturaPDF(@PathVariable Long idPedido) {
        // Lógica para obtener el pedido y su factura desde la base de datos
        Pedido pedido = pedidoRepository.findById(idPedido).orElse(null);

        if (pedido == null) {
            return ResponseEntity.notFound().build();
        }
        // Crear un nuevo documento PDF
        Document document = new Document();

        // Crear un flujo de bytes para almacenar el PDF generado
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();
            double total = 0;
            // Agregar contenido al PDF
            document.add(new Paragraph("Factura del Pedido"));
            document.add(new Paragraph("Tipo: " + pedido.getFactura().getTipoFactura()));
            document.add(new Paragraph("Cliente: " + pedido.getFactura().getCliente().getNombre()));
            document.add(new Paragraph(""));
            document.add(new Paragraph("Detalles de la factura"));

            document.add(new Paragraph("Total: " + total));

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        // Obtener los bytes del PDF generado
        byte[] pdfBytes = baos.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=factura.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
