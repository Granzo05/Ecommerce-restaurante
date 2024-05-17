package main.controllers;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.transaction.Transactional;
import main.entities.Factura.FacturaDTO;
import main.entities.Pedidos.DetallesPedido;
import main.entities.Pedidos.EnumEstadoPedido;
import main.entities.Pedidos.Pedido;
import main.entities.Pedidos.PedidoDTO;
import main.repositories.*;
import main.utility.gmail.Gmail;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
public class PedidoController {
    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final SucursalRepository sucursalRepository;
    private final FacturaRepository facturaRepository;
    private final DetallePedidoRepository detallePedidoRepository;

    public PedidoController(PedidoRepository pedidoRepository,
                            ClienteRepository clienteRepository,
                            SucursalRepository sucursalRepository, FacturaRepository facturaRepository, DetallePedidoRepository detallePedidoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.sucursalRepository = sucursalRepository;
        this.facturaRepository = facturaRepository;
        this.detallePedidoRepository = detallePedidoRepository;
    }

    @GetMapping("/cliente/{id}/pedidos")
    public Set<PedidoDTO> getPedidosPorCliente(@PathVariable("id") Long idCliente) {
        List<PedidoDTO> pedidos = pedidoRepository.findOrderByIdCliente(idCliente);

        cargarPedidos(pedidos);

        return new HashSet<>(pedidos);
    }

    @GetMapping("/pedidos")
    public Set<PedidoDTO> getPedidosPorNegocio() {
        List<PedidoDTO> pedidos = pedidoRepository.findOrders();

        cargarPedidos(pedidos);

        return new HashSet<>(pedidos);
    }

    @GetMapping("/pedidos/{estado}")
    public Set<PedidoDTO> getPedidosPorEstado(@PathVariable("estado") EnumEstadoPedido estado) {
        List<PedidoDTO> pedidos = pedidoRepository.findPedidos(estado);
        System.out.println(pedidos);
        for (PedidoDTO pedido : pedidos) {
            pedido.setCliente(clienteRepository.findByIdDTO(pedido.getIdCliente()));


            pedido.setDetallesPedido(new HashSet<>(detallePedidoRepository.findByIdDTO(pedido.getId())));
        }

        return new HashSet<>(pedidos);
    }

    private void cargarPedidos(List<PedidoDTO> pedidos) {
        for (PedidoDTO pedido : pedidos) {
            pedido.setCliente(clienteRepository.findByIdDTO(pedido.getIdCliente()));

            pedido.setDetallesPedido(new HashSet<>(detallePedidoRepository.findByIdDTO(pedido.getId())));
        }
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
        System.out.println(pedido);

        for (DetallesPedido detallesPedido: pedido.getDetallesPedido()) {
            detallesPedido.setPedido(pedido);
        }

        pedidoRepository.save(pedido);

        return new ResponseEntity<>("La pedido ha sido cargado correctamente", HttpStatus.CREATED);
    }

    @PutMapping("/pedido/delete/{id}")
    public ResponseEntity<?> borrarPedido(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (pedido.isEmpty()) {
            return new ResponseEntity<>("La pedido ya ha sido borrada previamente", HttpStatus.BAD_REQUEST);
        }
        pedido.get().setBorrado("SI");
        pedidoRepository.save(pedido.get());
        return new ResponseEntity<>("El pedido ha sido eliminado correctamente", HttpStatus.ACCEPTED);
    }

    @PutMapping("/pedido/update")
    public ResponseEntity<?> updatePedido(@RequestBody Pedido pedido) {
        pedidoRepository.save(pedido);
        return new ResponseEntity<>("El pedido ha sido actualizado correctamente", HttpStatus.ACCEPTED);
    }

    @PutMapping("/pedido/update/estado")
    public ResponseEntity<?> updateEstadoPedido(@RequestBody Pedido pedido) throws GeneralSecurityException, IOException, MessagingException {
        System.out.println(pedido);

        Optional<Pedido> pedidoDb = pedidoRepository.findById(pedido.getId());

        if (pedidoDb.isEmpty()) {
            return new ResponseEntity<>("La pedido ya ha sido borrada previamente", HttpStatus.BAD_REQUEST);
        }

        pedidoDb.get().setEstado(pedido.getEstado());

        if (pedido.getEstado().equals("entregados")) {
            pedidoDb.get().setFactura(pedido.getFactura());

            ResponseEntity<byte[]> archivo = generarFacturaPDF(pedidoDb.get().getId());
            Gmail gmail = new Gmail();

            if (pedido.getTipoEnvio().toString().equals("DELVIERY")) {
                gmail.enviarCorreoConArchivo("Su pedido está en camino", "Gracias por su compra", "facu.granzotto5@gmail.com", archivo.getBody());
            } else {
                gmail.enviarCorreoConArchivo("Su pedido ya fue entregado", "Gracias por su compra", "facu.granzotto5@gmail.com", archivo.getBody());
            }

        }

        pedidoDb.get().setHoraFinalizacion(pedido.getHoraFinalizacion());

        pedidoRepository.save(pedidoDb.get());

        return new ResponseEntity<>("El pedido ha sido actualizado correctamente", HttpStatus.ACCEPTED);
    }

    public ResponseEntity<byte[]> generarFacturaPDF(Long idPedido) {
        Optional<Pedido> pedido = pedidoRepository.findById(idPedido);

        if (pedido.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Crear un nuevo documento PDF
        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, baos);
            document.open();
            double total = 0;

            document.add(new Paragraph("Factura del Pedido"));
            document.add(new Paragraph("Tipo: " + pedido.get().getFactura().getTipoFactura().toString()));
            document.add(new Paragraph("Cliente: " + pedido.get().getCliente().getNombre()));
            document.add(new Paragraph(""));
            document.add(new Paragraph("Detalles de la factura"));

            // Crear la tabla para los detalles de la factura
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);

            table.addCell("Nombre del Menú");
            table.addCell("Cantidad");
            table.addCell("Subtotal");

            for (DetallesPedido detalle : pedido.get().getDetallesPedido()) {
                // Agregar cada detalle como una fila en la tabla
                table.addCell(detalle.getArticuloMenu().getNombre());
                table.addCell(String.valueOf(detalle.getCantidad()));
                table.addCell(String.valueOf(detalle.getSubTotal()));
                total += detalle.getSubTotal();
            }

            document.add(table);

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
