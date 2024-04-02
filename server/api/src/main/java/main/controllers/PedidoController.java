package main.controllers;

import main.entities.Cliente.PedidoClienteDTO;
import main.entities.Cliente.Cliente;
import main.entities.Factura.MetodoPago;
import main.entities.Factura.TipoFactura;
import main.entities.Factura.Factura;
import main.entities.Pedidos.DetallesPedido;
import main.entities.Pedidos.EnumTipoEnvio;
import main.entities.Pedidos.Pedido;
import main.entities.Restaurante.Menu.Menu;
import main.entities.Restaurante.Restaurante;
import main.repositories.ClienteRepository;
import main.repositories.DetallesPedidoRepository;
import main.repositories.PedidoRepository;
import main.repositories.RestauranteRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class PedidoController {
    private final PedidoRepository pedidoRepository;
    private final DetallesPedidoRepository detallesPedidoRepository;
    private final ClienteRepository clienteRepository;
    private final RestauranteRepository restauranteRepository;

    public PedidoController(PedidoRepository pedidoRepository, DetallesPedidoRepository detallesPedidoRepository,
                            ClienteRepository clienteRepository,
                            RestauranteRepository restauranteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.detallesPedidoRepository = detallesPedidoRepository;
        this.clienteRepository = clienteRepository;
        this.restauranteRepository = restauranteRepository;
    }
    @GetMapping("/user/id/{id}/orders")
    public List<Pedido> getPedidosPorCliente(@PathVariable("id") Long idCliente) {
        List<Pedido> pedidos = pedidoRepository.findOrderByIdCliente(idCliente);
        return pedidos;
    }

    @GetMapping("/orders")
    public List<Pedido> getPedidosPorNegocio() {
        List<Pedido> pedidos = pedidoRepository.findOrders();
        return pedidos;
    }

    @GetMapping("/orders/incoming")
    public List<Pedido> getPedidosEntrantesPorNegocio() {
        List<Pedido> pedidos = pedidoRepository.findPedidosEntrantes();
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

            for (DetallesPedido detalle: detallesPedidoRepository.findByIdPedido(pedido.getId())) {
                document.add(new Paragraph("Menu: " + detalle.getMenu()));
                document.add(new Paragraph("Cantidad: " + detalle.getCantidad()));
                document.add(new Paragraph("Subtotal: " + detalle.getSubTotal()));
                total += detalle.getSubTotal();
            }
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

    @PostMapping("/order/create")
    public ResponseEntity<String> crearPedido(@RequestBody PedidoClienteDTO pedidoRequest) {
        List<Menu> menus = pedidoRequest.getMenus();
        String emailCliente = pedidoRequest.getEmail();
        Date fecha = pedidoRequest.getFecha();
        EnumTipoEnvio tipoEnvio = pedidoRequest.getTipoEnvio();
        MetodoPago metodoPago = pedidoRequest.getMetodoPago();

        // Buscar si el cliente existe
        Optional<Cliente> cliente = clienteRepository.findByEmail(emailCliente);

        if (cliente.isEmpty()) {
            return new ResponseEntity<>("La cliente no está registrado", HttpStatus.BAD_REQUEST);
        }

        Cliente clienteFinal = new Cliente(cliente.get().getId(), cliente.get().getNombre(), cliente.get().getDomicilio());

        Optional<Restaurante> restaurante = restauranteRepository.findById(0l);

        if (restaurante.isEmpty()) {
            return new ResponseEntity<>("La restaurante no está registrado", HttpStatus.BAD_REQUEST);
        }

        Restaurante restauranteFinal = new Restaurante(restaurante.get().getId(), restaurante.get().getDomicilio(), restaurante.get().getTelefono());

        // Vemos los detalles

        List<DetallesPedido> detalles = new ArrayList<>();

        for (Menu menu: menus){
            DetallesPedido detalle = new DetallesPedido();
            detalle.setMenu(menu);
            detalles.add(detalle);
        }

        Factura factura = new Factura();

        factura.setCliente(clienteFinal);
        factura.setMetodoPago(metodoPago);
        // Por default es B, tratar el tema de eleccion de tipo en caso de ser empresa o monotributriste, para todo el resto es B
        factura.setTipoFactura(TipoFactura.B);

        Pedido pedido = new Pedido();
        pedido.setTipoEnvio(tipoEnvio);
        pedido.setFechaPedido(fecha);
        pedido.setRestaurante(restauranteFinal);
        pedido.setCliente(clienteFinal);
        pedido.setDetallesPedido(detalles);
        pedido.setFactura(factura);
        // Esto sirve para que al restaurante le aparezca en entrantes ya que en la db se busca constantemente los datos con este atributo en true
        pedido.setEstadoPedido("procesado");

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
