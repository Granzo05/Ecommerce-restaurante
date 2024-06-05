package main.controllers;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.core.MPRequestOptions;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import jakarta.transaction.Transactional;
import main.EncryptMD5.Encrypt;
import main.entities.Domicilio.Domicilio;
import main.entities.Factura.Factura;
import main.entities.Ingredientes.IngredienteMenu;
import main.entities.Pedidos.DetallesPedido;
import main.entities.Pedidos.EnumEstadoPedido;
import main.entities.Pedidos.EnumTipoEnvio;
import main.entities.Pedidos.Pedido;
import main.entities.Restaurante.Sucursal;
import main.entities.Stock.StockArticuloVenta;
import main.entities.Stock.StockIngredientes;
import main.repositories.*;
import main.utility.Gmail;
import main.utility.PreferenceMP;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.security.GeneralSecurityException;
import java.util.*;

@RestController
public class PedidoController {
    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final SucursalRepository sucursalRepository;
    private final FacturaRepository facturaRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final StockArticuloVentaRepository stockArticuloVentaRepository;
    private final StockIngredientesRepository stockIngredientesRepository;
    private final DomicilioRepository domicilioRepository;

    public PedidoController(PedidoRepository pedidoRepository,
                            ClienteRepository clienteRepository,
                            SucursalRepository sucursalRepository, FacturaRepository facturaRepository, DetallePedidoRepository detallePedidoRepository, StockArticuloVentaRepository stockArticuloVentaRepository, StockIngredientesRepository stockIngredientesRepository, DomicilioRepository domicilioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.sucursalRepository = sucursalRepository;
        this.facturaRepository = facturaRepository;
        this.detallePedidoRepository = detallePedidoRepository;
        this.stockArticuloVentaRepository = stockArticuloVentaRepository;
        this.stockIngredientesRepository = stockIngredientesRepository;
        this.domicilioRepository = domicilioRepository;
    }

    @CrossOrigin
    @GetMapping("/cliente/{id}/pedidos")
    public Set<Pedido> getPedidosPorCliente(@PathVariable("id") Long idCliente) {
        List<Pedido> pedidos = pedidoRepository.findOrderByIdCliente(idCliente);

        return new HashSet<>(pedidos);
    }

    @CrossOrigin
    @GetMapping("/pedidos/{idSucursal}")
    public Set<Pedido> getPedidosPorNegocio(@PathVariable("idSucursal") Long idSucursal) {
        List<Pedido> pedidos = pedidoRepository.findAllByIdSucursal(idSucursal);

        return new HashSet<>(pedidos);
    }

    @CrossOrigin
    @GetMapping("/pedidos/{estado}/{idSucursal}")
    public Set<Pedido> getPedidosPorEstado(@PathVariable("estado") int estadoValue, @PathVariable("idSucursal") Long idSucursal) throws Exception {
        EnumEstadoPedido estado = EnumEstadoPedido.fromValue(estadoValue);
        List<Pedido> pedidos = pedidoRepository.findPedidosByEstadoAndIdSucursal(estado, idSucursal);

        for (Pedido pedido : pedidos) {
            try {
                pedido.getDomicilioEntrega().setCalle(Encrypt.desencriptarString(pedido.getDomicilioEntrega().getCalle()));
            } catch (IllegalArgumentException ignored) {
            }
        }

        return new HashSet<>(pedidos);
    }

    //Funcion para cargar pdfs
    @CrossOrigin
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

    @CrossOrigin
    @Transactional
    @PostMapping("/pedido/create/{idSucursal}")
    public ResponseEntity<String> crearPedido(@RequestBody Pedido pedido, @PathVariable("idSucursal") Long idSucursal) {

        Optional<Pedido> pedidoDB = pedidoRepository.findByIdAndIdSucursal(pedido.getId(), idSucursal);

        if (pedidoDB.isEmpty()) {
            for (DetallesPedido detallesPedido : pedido.getDetallesPedido()) {
                detallesPedido.setPedido(pedido);
                descontarStock(detallesPedido, idSucursal);
            }

            Sucursal sucursal = sucursalRepository.findById(idSucursal).get();
            pedido.getSucursales().add(sucursal);

            // Si el domicilio el null es porque es un retiro en tienda, por lo tanto almacenamos la tienda de donde se retira
            if (pedido.getDomicilioEntrega() == null) {
                pedido.setDomicilioEntrega(sucursal.getDomicilio());
            }

            pedidoRepository.save(pedido);

            return ResponseEntity.ok("Pedido creado con éxito");
        }

        return ResponseEntity.badRequest().body("Ocurrió un error al generar el pedido");

    }

    @Transactional
    @CrossOrigin
    @PostMapping("/pedido/create/mercadopago/{idSucursal}")
    public PreferenceMP crearPedidoMercadopago(@RequestBody Pedido pedido, @PathVariable("idSucursal") Long idSucursal) {

        Optional<Pedido> pedidoDB = pedidoRepository.findByIdAndIdSucursal(pedido.getId(), idSucursal);

        if (pedidoDB.isEmpty() && pedido.getPreferencia() == null) {
            for (DetallesPedido detallesPedido : pedido.getDetallesPedido()) {
                detallesPedido.setPedido(pedido);
                descontarStock(detallesPedido, idSucursal);
            }

            pedido.setEstado(EnumEstadoPedido.PROCESO_DE_PAGO);

            Sucursal sucursal = sucursalRepository.findById(idSucursal).get();
            pedido.getSucursales().add(sucursal);

            // Si el domicilio el null es porque es un retiro en tienda, por lo tanto almacenamos la tienda de donde se retira
            if (pedido.getDomicilioEntrega() == null) {
                pedido.setDomicilioEntrega(sucursal.getDomicilio());
            } else {
                Domicilio domicilio = domicilioRepository.findById(pedido.getDomicilioEntrega().getId())
                        .orElseThrow(() -> new IllegalArgumentException("Domicilio no encontrado"));
                pedido.setDomicilioEntrega(domicilio);
            }

            pedidoRepository.save(pedido);

            try {
                MercadoPagoConfig.setAccessToken("TEST-4348060094658217-052007-d8458fa36a2d40dd8023bfcb9f27fd4e-1819307913");

                List<PreferenceItemRequest> items = new ArrayList<>();

                for (DetallesPedido detallesPedido : pedido.getDetallesPedido()) {

                    if (detallesPedido.getArticuloMenu() != null) {
                        PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                                .id(String.valueOf(detallesPedido.getArticuloMenu().getId()))
                                .title(detallesPedido.getArticuloMenu().getNombre())
                                .categoryId(String.valueOf(detallesPedido.getArticuloMenu().getCategoria().getId()))
                                .quantity(detallesPedido.getCantidad())
                                .currencyId("ARS")
                                .unitPrice(new BigDecimal(detallesPedido.getArticuloMenu().getPrecioVenta()))
                                .build();
                        items.add(itemRequest);
                    } else if (detallesPedido.getArticuloVenta() != null) {
                        PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                                .id(String.valueOf(detallesPedido.getArticuloVenta().getId()))
                                .title(detallesPedido.getArticuloVenta().getNombre())
                                .categoryId(String.valueOf(detallesPedido.getArticuloVenta().getCategoria().getId()))
                                .quantity(detallesPedido.getCantidad())
                                .currencyId("ARS")
                                .unitPrice(new BigDecimal(detallesPedido.getArticuloVenta().getPrecioVenta()))
                                .build();
                        items.add(itemRequest);
                    }
                }

                PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                        .success("http://localhost:5173/cliente/pedidos")
                        .failure("http://localhost:5173/pago")
                        .pending("http://localhost:5173/pago")
                        .build();

                PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                        .autoReturn("approved")
                        .externalReference(String.valueOf(pedido.getId()))
                        .items(items)
                        .backUrls(backUrls)
                        .build();
                PreferenceClient client = new PreferenceClient();

                MPRequestOptions options = MPRequestOptions.builder()
                        .connectionTimeout(120000)
                        .build();

                Preference preference = client.create(preferenceRequest, options);

                PreferenceMP mpPreference = new PreferenceMP();
                mpPreference.setStatusCode(preference.getResponse().getStatusCode());
                mpPreference.setId(preference.getId());

                pedido.setPreferencia(mpPreference.getId());

                pedidoRepository.save(pedido);

                return mpPreference;

            } catch (MPException | MPApiException e) {
                throw new RuntimeException(e);
            }
        } else {
            PreferenceMP mpPreference = new PreferenceMP();
            mpPreference.setStatusCode(200);
            mpPreference.setId(pedido.getPreferencia());

            return mpPreference;
        }
    }

    private void descontarStock(DetallesPedido detallesPedido, Long idSucursal) {
        if (detallesPedido.getArticuloVenta() != null) {
            Optional<StockArticuloVenta> stockArticuloVenta = stockArticuloVentaRepository.findByIdArticuloAndIdSucursal(detallesPedido.getArticuloVenta().getId(), idSucursal);

            if (stockArticuloVenta.isPresent()) {
                stockArticuloVenta.get().setCantidadActual(stockArticuloVenta.get().getCantidadActual() - detallesPedido.getCantidad());
            }
        }

        if (detallesPedido.getArticuloMenu() != null) {
            for (IngredienteMenu ingrediente : detallesPedido.getArticuloMenu().getIngredientesMenu()) {
                Optional<StockIngredientes> stockIngrediente = stockIngredientesRepository.findByIdIngredienteAndIdSucursal(ingrediente.getId(), idSucursal);

                if (stockIngrediente.isPresent()) {
                    stockIngrediente.get().setCantidadActual(stockIngrediente.get().getCantidadActual() - detallesPedido.getCantidad());
                }
            }

        }
    }

    private void reponerStock(DetallesPedido detallesPedido, Long idSucursal) {
        if (detallesPedido.getArticuloVenta() != null) {
            Optional<StockArticuloVenta> stockArticuloVenta = stockArticuloVentaRepository.findByIdArticuloAndIdSucursal(detallesPedido.getArticuloVenta().getId(), idSucursal);

            if (stockArticuloVenta.isPresent()) {
                stockArticuloVenta.get().setCantidadActual(stockArticuloVenta.get().getCantidadActual() + detallesPedido.getCantidad());
            }
        }

        if (detallesPedido.getArticuloMenu() != null) {
            for (IngredienteMenu ingrediente : detallesPedido.getArticuloMenu().getIngredientesMenu()) {
                Optional<StockIngredientes> stockIngrediente = stockIngredientesRepository.findByIdIngredienteAndIdSucursal(ingrediente.getId(), idSucursal);

                if (stockIngrediente.isPresent()) {
                    stockIngrediente.get().setCantidadActual(stockIngrediente.get().getCantidadActual() + detallesPedido.getCantidad());
                }
            }

        }
    }

    @Transactional
    @CrossOrigin
    @PutMapping("/pedido/update/{idSucursal}")
    public ResponseEntity<?> updatePedido(@RequestBody Pedido pedido, @PathVariable("idSucursal") Long idSucursal) {
        pedidoRepository.save(pedido);
        return new ResponseEntity<>("El pedido ha sido actualizado correctamente", HttpStatus.ACCEPTED);
    }

    @PutMapping("/pedido/update/estado/{idSucursal}")
    @CrossOrigin
    @Transactional
    public ResponseEntity<String> updateEstadoPedido(@RequestBody Pedido pedido, @PathVariable("idSucursal") Long
            idSucursal) throws GeneralSecurityException, IOException, MessagingException {
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

    @PutMapping("/pedido/{idPedido}/update/{preference}/{idSucursal}")
    @CrossOrigin
    @Transactional
    public ResponseEntity<String> updateEstadoPedido(@PathVariable("idPedido") Long idPedido, @PathVariable("preference") String preference, @PathVariable("idSucursal") Long idSucursal) {
        Optional<Pedido> pedidoDb = pedidoRepository.findByIdPedidoAndPreferenceAndIdSucursal(idPedido, preference, idSucursal);

        if (pedidoDb.isEmpty()) {
            return new ResponseEntity<>("La pedido no se encontró", HttpStatus.BAD_REQUEST);
        }

        pedidoDb.get().setEstado(EnumEstadoPedido.ENTRANTES);

        pedidoRepository.save(pedidoDb.get());

        return new ResponseEntity<>("El pedido ha sido recibido por el restaurante", HttpStatus.ACCEPTED);
    }

    @Transactional
    @CrossOrigin
    @DeleteMapping("/pedido/delete/{preference}/{idSucursal}")
    public void deletePedidoFallido(@PathVariable("preference") String preference, @PathVariable("idSucursal") Long idSucursal) {

        Optional<Pedido> pedido = pedidoRepository.findByPreference(preference);

        if (pedido.isPresent()) {

            for (DetallesPedido detallesPedido : pedido.get().getDetallesPedido()) {
                reponerStock(detallesPedido, idSucursal);
            }

            pedidoRepository.delete(pedido.get());
        }
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
