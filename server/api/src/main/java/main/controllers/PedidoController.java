package main.controllers;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.transaction.Transactional;
import main.entities.Factura.Factura;
import main.entities.Pedidos.DetallesPedido;
import main.entities.Pedidos.EnumEstadoPedido;
import main.entities.Pedidos.EnumTipoEnvio;
import main.entities.Pedidos.Pedido;
import main.entities.Restaurante.Sucursal;
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
    public Set<Pedido> getPedidosPorCliente(@PathVariable("id") Long idCliente) {
        List<Pedido> pedidos = pedidoRepository.findOrderByIdCliente(idCliente);

        return new HashSet<>(pedidos);
    }

    @GetMapping("/pedidos/{idSucursal}")
    public Set<Pedido> getPedidosPorNegocio(@PathVariable("idSucursal") Long idSucursal) {
        List<Pedido> pedidos = pedidoRepository.findAllByIdSucursal(idSucursal);

        return new HashSet<>(pedidos);
    }

    @GetMapping("/pedidos/{estado}/{idSucursal}")
    public Set<Pedido> getPedidosPorEstado(@PathVariable("estado") int estadoValue, @PathVariable("idSucursal") Long idSucursal) {
        EnumEstadoPedido estado = EnumEstadoPedido.fromValue(estadoValue);
        List<Pedido> pedidos = pedidoRepository.findPedidosByEstadoAndIdSucursal(estado, idSucursal);

        return new HashSet<>(pedidos);
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
    @PostMapping("/pedido/create/{idSucursal}")
    public ResponseEntity<String> crearPedido(@RequestBody Pedido pedido, @PathVariable("idSucursal") Long idSucursal) {

        for (DetallesPedido detallesPedido : pedido.getDetallesPedido()) {
            detallesPedido.setPedido(pedido);
        }

        Sucursal sucursal = sucursalRepository.findById(idSucursal).get();
        pedido.getSucursales().add(sucursal);


        // Si el domicilio el null es porque es un retiro en tienda, por lo tanto almacenamos la tienda de donde se retira
        if(pedido.getDomicilioEntrega() == null) {
            pedido.setDomicilioEntrega(sucursal.getDomicilio());
        }

        pedidoRepository.save(pedido);

        return new ResponseEntity<>("La pedido ha sido cargado correctamente", HttpStatus.CREATED);
    }

    @PutMapping("/pedido/delete/{id}/{idSucursal}")
    public ResponseEntity<?> borrarPedido(@PathVariable Long id, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (pedido.isEmpty()) {
            return new ResponseEntity<>("La pedido ya ha sido borrado previamente", HttpStatus.BAD_REQUEST);
        }
        pedido.get().setBorrado("SI");
        pedidoRepository.save(pedido.get());
        return new ResponseEntity<>("El pedido ha sido eliminado correctamente", HttpStatus.ACCEPTED);
    }

    @Transactional
    @PutMapping("/pedido/update/{idSucursal}")
    public ResponseEntity<?> updatePedido(@RequestBody Pedido pedido, @PathVariable("idSucursal") Long idSucursal) {
        pedidoRepository.save(pedido);
        return new ResponseEntity<>("El pedido ha sido actualizado correctamente", HttpStatus.ACCEPTED);
    }

    @PutMapping("/pedido/update/estado/{idSucursal}")
    @Transactional
    public ResponseEntity<String> updateEstadoPedido(@RequestBody Pedido pedido, @PathVariable("idSucursal") Long idSucursal) throws GeneralSecurityException, IOException, MessagingException {
        Optional<Pedido> pedidoDb = pedidoRepository.findByIdAndIdSucursal(pedido.getId(), idSucursal);

        if (pedidoDb.isEmpty()) {
            return new ResponseEntity<>("La pedido ya ha sido borrada previamente", HttpStatus.BAD_REQUEST);
        }

        pedidoDb.get().setEstado(pedido.getEstado());

        if (pedido.getEstado().equals(EnumEstadoPedido.ENTREGADOS)) {
            pedidoDb.get().setFactura(pedido.getFactura());

            ResponseEntity<byte[]> archivo = generarFacturaPDF(pedidoDb.get().getId());
            Gmail gmail = new Gmail();

            if (pedido.getTipoEnvio().equals(EnumTipoEnvio.DELIVERY)) {
                gmail.enviarCorreoConArchivo("Su pedido está en camino", "Gracias por su compra", pedido.getCliente().getEmail(), archivo.getBody());
            } else {
                gmail.enviarCorreoConArchivo("Su pedido ya fue entregado", "Gracias por su compra", pedido.getCliente().getEmail(), archivo.getBody());
            }

        }

        pedidoDb.get().setHoraFinalizacion(pedido.getHoraFinalizacion());

        pedidoRepository.save(pedidoDb.get());

        return new ResponseEntity<>("El pedido ha sido actualizado correctamente", HttpStatus.ACCEPTED);
    }

    public ResponseEntity<byte[]> generarFacturaPDF(Long idPedido) {
        Optional<Pedido> pedidoDB = pedidoRepository.findById(idPedido);

        if (pedidoDB.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Crear un nuevo documento PDF
        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        Pedido pedido = pedidoDB.get();

        Optional<Factura> factura = facturaRepository.findByIdPedido(pedido.getId());

        try {
            PdfWriter.getInstance(document, baos);
            document.open();
            double total = 0;

            document.add(new Paragraph("Factura del Pedido"));
            document.add(new Paragraph("Tipo: " + factura.get().getTipoFactura().toString()));
            document.add(new Paragraph("Cliente: " + pedido.getCliente().getNombre()));
            document.add(new Paragraph(""));
            document.add(new Paragraph("Detalles de la factura"));

            // Crear la tabla para los detalles de la factura
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);

            table.addCell("Nombre del Menú");
            table.addCell("Cantidad");
            table.addCell("Subtotal");

            for (DetallesPedido detalle : pedido.getDetallesPedido()) {
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
