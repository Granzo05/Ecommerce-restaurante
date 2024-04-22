package main.controllers;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.transaction.Transactional;
import main.entities.Pedidos.DetallesPedido;
import main.entities.Pedidos.Pedido;
import main.repositories.ClienteRepository;
import main.repositories.PedidoRepository;
import main.repositories.RestauranteRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

@RestController
public class PedidoController {
    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final RestauranteRepository restauranteRepository;

    public PedidoController(PedidoRepository pedidoRepository,
                            ClienteRepository clienteRepository,
                            RestauranteRepository restauranteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.restauranteRepository = restauranteRepository;
    }
    @GetMapping("/user/id/{id}/pedidos")
    public List<Pedido> getPedidosPorCliente(@PathVariable("id") Long idCliente) {
        List<Pedido> pedidos = pedidoRepository.findOrderByIdCliente(idCliente);
        return pedidos;
    }

    @GetMapping("/pedidos")
    public List<Pedido> getPedidosPorNegocio() {
        List<Pedido> pedidos = pedidoRepository.findOrders();
        return pedidos;
    }

    @GetMapping("/pedidos/{estado}")
    public List<Pedido> getPedidosPorEstado(@PathVariable("estado") String estado) {
        List<Pedido> pedidos = pedidoRepository.findPedidos(estado);
        return pedidos;
    }

    //Funcion para cargar pdfs
    @GetMapping("/pedido/{idPedido}/pdf")
    public ResponseEntity<byte[]> generarPedidoPDF(@PathVariable Long idCliente, @PathVariable Long idPedido) {
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
            document.add(new Paragraph("Información del Pedido"));
            document.add(new Paragraph("Fecha: " + pedido.getFechaPedido()));
            document.add(new Paragraph("Tipo de Envío: " + pedido.getTipoEnvio()));
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
        headers.add("Content-Disposition", "attachment; filename=pedido.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @Transactional
    @PostMapping("/pedido/create")
    public ResponseEntity<String> crearPedido(@RequestBody Pedido pedido) {
        pedido.setTipoEnvio(pedido.getTipoEnvio().toString());
        pedido.setFactura(null);
        pedido.setBorrado("NO");

        pedidoRepository.save(pedido);

        return new ResponseEntity<>("La pedido ha sido cargado correctamente", HttpStatus.CREATED);
    }

    @DeleteMapping("/pedido/delete/{id}")
    public ResponseEntity<?> borrarPedido(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (pedido.isEmpty()) {
            return new ResponseEntity<>("La pedido ya ha sido borrada previamente", HttpStatus.BAD_REQUEST);
        }
        pedidoRepository.delete(pedido.get());
        return new ResponseEntity<>("La pedido ha sido correctamente", HttpStatus.ACCEPTED);
    }
}
