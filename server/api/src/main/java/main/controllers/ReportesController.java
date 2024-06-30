package main.controllers;

import main.entities.Pedidos.DetallesPedido;
import main.entities.Pedidos.Pedido;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;
import main.entities.Productos.DetallePromocion;
import main.repositories.PedidoRepository;
import main.service.ReportesServices;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class ReportesController {
    private final PedidoRepository pedidoRepository;

    public ReportesController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @CrossOrigin
    @GetMapping("/downloadExcelPedidos/{fechaDesde}/{fechaHasta}")
    public ResponseEntity<byte[]> downloadExcelPedidosPorFecha(@PathVariable("fechaDesde") String fechaDesde, @PathVariable("fechaHasta") String fechaHasta) {
        try {
            DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dateFechaDesde = LocalDate.parse(fechaDesde.replace("N", "-"), dateFormat);
            LocalDate dateFechaHasta = LocalDate.parse(fechaHasta.replace("N", "-"), dateFormat);

            // Crear el libro de Excel y la hoja de cálculo
            SXSSFWorkbook libroExcel = new SXSSFWorkbook();
            SXSSFSheet hoja = libroExcel.createSheet("Pedidos");

            // Crear encabezados una sola vez
            ReportesServices reportesServices = new ReportesServices();
            reportesServices.crearEncabezados(hoja);

            // Obtener los pedidos y escribirlos en la hoja
            int pageNumber = 0;
            int pageSize = 100;
            Pageable pageable = PageRequest.of(pageNumber, pageSize);
            Page<Pedido> page;

            do {
                page = pedidoRepository.findAllByFechasLimit(dateFechaDesde, dateFechaHasta, pageable);
                List<Pedido> pedidos = page.getContent();

                reportesServices.imprimirExcelPedidos(pedidos, hoja);

                pageNumber++;
                pageable = PageRequest.of(pageNumber, pageSize);
            } while (page.hasNext());

            // Convertir el libro de Excel a un arreglo de bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            libroExcel.write(outputStream);
            libroExcel.close();

            // Configurar las cabeceras de la respuesta
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "pedidos.xlsx");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @CrossOrigin
    @GetMapping("/pedidos/{fechaDesde}/{fechaHasta}/datachartbar/ganancias/{idSucursal}")
    public ResponseEntity<List<List<Object>>> getGananciasTotales(@PathVariable("fechaDesde") String fechaDesde,
                                                                  @PathVariable("fechaHasta") String fechaHasta,
                                                                  @PathVariable("idSucursal") Long id) {
        try {
            DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dateFechaDesde = LocalDate.parse(fechaDesde.replace("N", "-"), dateFormat);
            LocalDate dateFechaHasta = LocalDate.parse(fechaHasta.replace("N", "-"), dateFormat);

            // Convertir LocalDate a LocalDateTime
            LocalDateTime dateFechaDesdeInicio = dateFechaDesde.atStartOfDay();
            LocalDateTime dateFechaHastaFin = dateFechaHasta.atTime(LocalTime.MAX);

            int pageNumber = 0;
            int pageSize = 200;
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());

            Map<String, Double> agrupadosPorMesAnio = new TreeMap<>();

            Page<Pedido> page;

            do {
                page = pedidoRepository.findPedidosBetweenFechas(pageable, id, dateFechaDesdeInicio, dateFechaHastaFin);
                List<Pedido> resultados = page.getContent();

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

                for (Pedido pedido : resultados) {
                    double ganancias = calcularGanancias(pedido);

                    LocalDateTime fechaPedido = pedido.getFechaPedido();
                    String mesAnio = fechaPedido.format(formatter);

                    agrupadosPorMesAnio.put(mesAnio, agrupadosPorMesAnio.getOrDefault(mesAnio, 0.0) + ganancias);
                }

                pageNumber++;
                pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());
            } while (page.hasNext());

            List<List<Object>> data = new ArrayList<>();
            data.add(Arrays.asList("Mes y Año", "Ganancias"));

            for (Map.Entry<String, Double> entry : agrupadosPorMesAnio.entrySet()) {
                data.add(Arrays.asList(entry.getKey(), entry.getValue()));
            }

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private double calcularGanancias(Pedido pedido) {
        double ganancias = 0.0;

        for (DetallesPedido detalle : pedido.getDetallesPedido()) {
            if (detalle.getArticuloVenta() != null) {
                ArticuloVenta articulo = detalle.getArticuloVenta();
                double precioCompra = articulo.getStockArticuloVenta().getPrecioCompra();
                ganancias += (articulo.getPrecioVenta() - precioCompra) * detalle.getCantidad();
            } else if (detalle.getArticuloMenu() != null) {
                ArticuloMenu articuloMenu = detalle.getArticuloMenu();
                ganancias += articuloMenu.getGanancia() * detalle.getCantidad();
            } else if (detalle.getPromocion() != null) {
                for (DetallePromocion detallePromocion : detalle.getPromocion().getDetallesPromocion()) {
                    if (detallePromocion.getArticuloVenta() != null) {
                        ArticuloVenta articulo = detallePromocion.getArticuloVenta();
                        double precioCompra = articulo.getStockArticuloVenta().getPrecioCompra();
                        ganancias += (articulo.getPrecioVenta() - precioCompra) * detallePromocion.getCantidad();
                    } else if (detallePromocion.getArticuloMenu() != null) {
                        ArticuloMenu articuloMenu = detallePromocion.getArticuloMenu();
                        ganancias += articuloMenu.getGanancia() * detalle.getCantidad() * detallePromocion.getCantidad();
                    }
                }
            }
        }

        return ganancias;
    }


    @CrossOrigin
    @GetMapping("/pedidos/{fechaDesde}/{fechaHasta}/datachartbar/ingresos/{idSucursal}")
    public ResponseEntity<List<List<Object>>> getIngresosTotales(@PathVariable("fechaDesde") String fechaDesde,
                                                                  @PathVariable("fechaHasta") String fechaHasta,
                                                                  @PathVariable("idSucursal") Long id) {
        try {
            DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dateFechaDesde = LocalDate.parse(fechaDesde.replace("N", "-"), dateFormat);
            LocalDate dateFechaHasta = LocalDate.parse(fechaHasta.replace("N", "-"), dateFormat);

            // Convertir LocalDate a LocalDateTime
            LocalDateTime dateFechaDesdeInicio = dateFechaDesde.atStartOfDay();
            LocalDateTime dateFechaHastaFin = dateFechaHasta.atTime(LocalTime.MAX);

            int pageNumber = 0;
            int pageSize = 200;
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());

            Map<String, Double> agrupadosPorMesAnio = new TreeMap<>();

            Page<Pedido> page;

            do {
                page = pedidoRepository.findPedidosBetweenFechas(pageable, id, dateFechaDesdeInicio, dateFechaHastaFin);
                List<Pedido> resultados = page.getContent();

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

                for (Pedido pedido : resultados) {
                    double ingresos = calcularIngresos(pedido);

                    LocalDateTime fechaPedido = pedido.getFechaPedido();
                    String mesAnio = fechaPedido.format(formatter);

                    agrupadosPorMesAnio.put(mesAnio, agrupadosPorMesAnio.getOrDefault(mesAnio, 0.0) + ingresos);
                }

                pageNumber++;
                pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());
            } while (page.hasNext());

            List<List<Object>> data = new ArrayList<>();
            data.add(Arrays.asList("Fecha", "Ingresos"));

            for (Map.Entry<String, Double> entry : agrupadosPorMesAnio.entrySet()) {
                data.add(Arrays.asList(entry.getKey(), entry.getValue()));
            }

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private double calcularIngresos(Pedido pedido) {
        double ingresos = 0.0;

        for (DetallesPedido detalle : pedido.getDetallesPedido()) {
            if (detalle.getArticuloVenta() != null) {
                ArticuloVenta articulo = detalle.getArticuloVenta();

                ingresos += articulo.getPrecioVenta()  * detalle.getCantidad();

            } else if (detalle.getArticuloMenu() != null) {
                ArticuloMenu articuloMenu = detalle.getArticuloMenu();

                ingresos += articuloMenu.getPrecioVenta() * detalle.getCantidad();

            } else if (detalle.getPromocion() != null) {
                for (DetallePromocion detallePromocion : detalle.getPromocion().getDetallesPromocion()) {
                    if (detallePromocion.getArticuloVenta() != null) {
                        ArticuloVenta articulo = detallePromocion.getArticuloVenta();

                        ingresos += articulo.getPrecioVenta()* detallePromocion.getCantidad();
                    } else if (detallePromocion.getArticuloMenu() != null) {
                        ArticuloMenu articuloMenu = detallePromocion.getArticuloMenu();
                        ingresos += articuloMenu.getPrecioVenta() * detalle.getCantidad() * detallePromocion.getCantidad();
                    }
                }
            }
        }

        return ingresos;
    }

    @CrossOrigin
    @GetMapping("/pedidos/cliente/{idCliente}/{fechaDesde}/{fechaHasta}/datachartbar/ingresos/{idSucursal}")
    public ResponseEntity<List<List<Object>>> getPedidosTotales(@PathVariable("idCliente") Long idCliente,
                                                                @PathVariable("fechaDesde") String fechaDesde,
                                                                @PathVariable("fechaHasta") String fechaHasta,
                                                                @PathVariable("idSucursal") Long id) {
        try {
            DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dateFechaDesde = LocalDate.parse(fechaDesde.replace("N", "-"), dateFormat);
            LocalDate dateFechaHasta = LocalDate.parse(fechaHasta.replace("N", "-"), dateFormat);

            // Convertir LocalDate a LocalDateTime
            LocalDateTime dateFechaDesdeInicio = dateFechaDesde.atStartOfDay();
            LocalDateTime dateFechaHastaFin = dateFechaHasta.atTime(LocalTime.MAX);
            int pageNumber = 0;
            int pageSize = 200;
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());

            Map<String, Integer> agrupadosPorMesAnio = new TreeMap<>();

            Page<Object[]> page;

            do {
                page = pedidoRepository.findCantidadPedidosClientePorFechaYSucursal(pageable, id, idCliente, dateFechaDesdeInicio, dateFechaHastaFin);
                List<Object[]> resultados = page.getContent();

                for (Object[] resultado : resultados) {
                    String mesAnio = (String) resultado[0];
                    Integer pedidos = ((Number) resultado[1]).intValue();

                    agrupadosPorMesAnio.put(mesAnio, agrupadosPorMesAnio.getOrDefault(mesAnio, 0) + pedidos);
                }

                pageNumber++;
                pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());
            } while (page.hasNext());

            List<List<Object>> data = new ArrayList<>();
            data.add(Arrays.asList("Mes y Año", "Pedidos"));

            for (Map.Entry<String, Integer> entry : agrupadosPorMesAnio.entrySet()) {
                data.add(Arrays.asList(entry.getKey(), entry.getValue()));
            }

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin
    @GetMapping("/pedidos/{fechaDesde}/{fechaHasta}/datachartbar/comidas/{idSucursal}")
    public ResponseEntity<List<List<Object>>> getComidasFamosas(@PathVariable("fechaDesde") String fechaDesde, @PathVariable("fechaHasta") String fechaHasta, @PathVariable("idSucursal") Long id) {
        try {
            DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dateFechaDesde = LocalDate.parse(fechaDesde.replace("N", "-"), dateFormat);
            LocalDate dateFechaHasta = LocalDate.parse(fechaHasta.replace("N", "-"), dateFormat);

            // Convertir LocalDate a LocalDateTime
            LocalDateTime dateFechaDesdeInicio = dateFechaDesde.atStartOfDay();
            LocalDateTime dateFechaHastaFin = dateFechaHasta.atTime(LocalTime.MAX);

            int pageNumber = 0;
            int pageSize = 200;
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());

            // Mapa para almacenar la cantidad de veces que se ha pedido cada artículo de menú por mes y año
            Map<String, Map<String, Integer>> agrupadosPorMesAnio = new LinkedHashMap<>();

            Page<Object[]> page;

            do {
                page = pedidoRepository.findCantidadPedidosPorFechaYSucursal(pageable, id, dateFechaDesdeInicio, dateFechaHastaFin);
                List<Object[]> resultados = page.getContent();

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

                for (Object[] resultado : resultados) {
                    LocalDateTime fechaPedido = (LocalDateTime) resultado[0];
                    String mesAnio = fechaPedido.format(formatter);
                    String nombreMenu = (String) resultado[1];
                    int cantidadPedidos = ((Number) resultado[2]).intValue();

                    // Obtener o inicializar el mapa para este mes y año
                    Map<String, Integer> comidasFamosas = agrupadosPorMesAnio.computeIfAbsent(mesAnio, k -> new HashMap<>());

                    // Incrementar la cantidad de veces que se ha pedido este menú
                    comidasFamosas.put(nombreMenu, comidasFamosas.getOrDefault(nombreMenu, 0) + cantidadPedidos);
                }

                pageNumber++;
                pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());
            } while (page.hasNext());

            // Preparar los datos para el gráfico
            List<List<Object>> data = new ArrayList<>();
            data.add(Arrays.asList("Fecha", "Cantidad de Pedidos", "{ role: 'annotation' }"));

            for (Map.Entry<String, Map<String, Integer>> entry : agrupadosPorMesAnio.entrySet()) {
                String mesAnio = entry.getKey();
                Map<String, Integer> comidasFamosas = entry.getValue();

                // Ordenar las comidas por cantidad de pedidos en orden descendente y tomar las 3 primeras
                List<Map.Entry<String, Integer>> topComidas = comidasFamosas.entrySet().stream()
                        .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                        .limit(3)
                        .collect(Collectors.toList());

                // Agregar las 3 comidas más pedidas al data
                for (Map.Entry<String, Integer> comida : topComidas) {
                    data.add(Arrays.asList(mesAnio, comida.getValue(), comida.getKey()));
                }
            }

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @CrossOrigin
    @GetMapping("/pedidos/{fechaDesde}/{fechaHasta}/datachartpie/{idSucursal}")
    public ResponseEntity<List<List<Object>>> getDataChartPie() {
        try {
            int pageNumber = 0;
            int pageSize = 200;

            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());

            Map<String, Integer> agrupadosPorArticulo = new HashMap<>();

            Page<ArticuloVenta> pageArticulos;

            do {
                pageArticulos = pedidoRepository.findAllArticulosVentaLimit(pageable);
                List<ArticuloVenta> articulosVenta = pageArticulos.getContent();


                for (ArticuloVenta articulo : articulosVenta) {
                    Integer cantidadVentasArticulo = pedidoRepository.findTotalVentasArticulo(articulo.getNombre());

                    // Si cantidadVentasArticulo es nulo, significa que no se encontraron ventas para ese artículo
                    if (cantidadVentasArticulo == null) {
                        cantidadVentasArticulo = 0;
                    }

                    agrupadosPorArticulo.put(articulo.getNombre(),
                            agrupadosPorArticulo.getOrDefault(articulo.getNombre(), 0) + cantidadVentasArticulo);
                }

                pageNumber++;

                pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());

            } while (pageArticulos.hasNext());

            Page<ArticuloMenu> pageMenus;

            do {
                pageMenus = pedidoRepository.findAllArticulosMenuLimit(pageable);
                List<ArticuloMenu> menus = pageMenus.getContent();


                for (ArticuloMenu menu : menus) {
                    Integer cantidadVentasArticulo = pedidoRepository.findTotalVentasArticuloMenu(menu.getNombre());

                    // Si cantidadVentasArticulo es nulo, significa que no se encontraron ventas para ese artículo
                    if (cantidadVentasArticulo == null) {
                        cantidadVentasArticulo = 0;
                    }

                    agrupadosPorArticulo.put(menu.getNombre(),
                            agrupadosPorArticulo.getOrDefault(menu.getNombre(), 0) + cantidadVentasArticulo);
                }

                pageNumber++;

                pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());

            } while (pageArticulos.hasNext());

            List<List<Object>> data = new ArrayList<>();
            data.add(Arrays.asList("Articulo", "CantidadPedidos"));

            for (Map.Entry<String, Integer> entry : agrupadosPorArticulo.entrySet()) {
                data.add(Arrays.asList(entry.getKey(), entry.getValue()));
            }

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin
    @PostMapping("/downloadExcelGrafico/{informacion}")
    public ResponseEntity<byte[]> downloadExcel(@RequestBody List<List<Object>> datosGrafico, @PathVariable("informacion") String informacion) {
        try {
            // Crear el libro de Excel y la hoja de cálculo
            SXSSFWorkbook libroExcel = new SXSSFWorkbook();
            SXSSFSheet hoja = libroExcel.createSheet(informacion);

            XSSFFont font = (XSSFFont) hoja.getWorkbook().createFont();
            font.setBold(true);
            XSSFCellStyle style = (XSSFCellStyle) hoja.getWorkbook().createCellStyle();
            style.setFont(font);

            // Crear encabezados una sola vez
            SXSSFRow row = hoja.createRow(0);
            List<Object> encabezados = datosGrafico.get(0);
            for (int i = 0; i < encabezados.size(); i++) {
                SXSSFCell cell = row.createCell(i);
                if (encabezados.get(i).toString().equals("{role=annotation}")) {
                    cell.setCellValue("Nombre");
                } else {
                    cell.setCellValue(encabezados.get(i).toString());
                }
                cell.setCellStyle(style);
            }

            // Rellenar las filas con datos
            for (int i = 1; i < datosGrafico.size(); i++) {
                row = hoja.createRow(i);
                List<Object> grafico = datosGrafico.get(i);
                for (int j = 0; j < grafico.size(); j++) {
                    SXSSFCell cell = row.createCell(j);
                    if (grafico.get(j) instanceof Number) {
                        cell.setCellValue(((Number) grafico.get(j)).doubleValue());
                    } else {
                        cell.setCellValue(grafico.get(j).toString());
                    }
                }
            }

            // Convertir el libro de Excel a un arreglo de bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            libroExcel.write(outputStream);
            libroExcel.close();

            // Configurar las cabeceras de la respuesta
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", informacion + ".xlsx");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
