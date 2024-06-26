package main.controllers;

import main.entities.Pedidos.Pedido;
import main.entities.Productos.ArticuloMenu;
import main.entities.Productos.ArticuloVenta;
import main.repositories.PedidoRepository;
import main.service.ReportesServices;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
public class ReportesController {
    private final PedidoRepository pedidoRepository;

    public ReportesController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

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


    @GetMapping("/pedidos/{fechaDesde}/{fechaHasta}/datachartbar/ganancias/{idSucursal}")
    public ResponseEntity<List<List<Object>>> getGananciasTotales(@PathVariable("fechaDesde") String fechaDesde, @PathVariable("fechaHasta") String fechaHasta, @PathVariable("idSucursal") Long id) {
        try {
            DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dateFechaDesde = LocalDate.parse(fechaDesde.replace("N", "-"), dateFormat);
            LocalDate dateFechaHasta = LocalDate.parse(fechaHasta.replace("N", "-"), dateFormat);
            int pageNumber = 0;
            int pageSize = 200;
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());

            Map<String, Integer> agrupadosPorMesAnio = new TreeMap<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

            Page<Object[]> page;

            do {
                page = pedidoRepository.findCantidadGananciaPorFechaYSucursal(pageable, id, dateFechaDesde, dateFechaHasta);
                List<Object[]> resultados = page.getContent();

                for (Object[] resultado : resultados) {
                    String mesAnio = (String) resultado[0];
                    Integer totalIngresos = ((Number) resultado[1]).intValue();

                    agrupadosPorMesAnio.put(mesAnio, agrupadosPorMesAnio.getOrDefault(mesAnio, 0) + totalIngresos);
                }

                pageNumber++;
                pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());
            } while (page.hasNext());

            List<List<Object>> data = new ArrayList<>();
            data.add(Arrays.asList("Mes y Año", "Ingresos"));

            for (Map.Entry<String, Integer> entry : agrupadosPorMesAnio.entrySet()) {
                data.add(Arrays.asList(entry.getKey(), entry.getValue()));
            }

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/pedidos/{fechaDesde}/{fechaHasta}/datachartbar/ingresos/{idSucursal}")
    public ResponseEntity<List<List<Object>>> getIngresosTotales(@PathVariable("fechaDesde") String fechaDesde, @PathVariable("fechaHasta") String fechaHasta, @PathVariable("idSucursal") Long id) {
        try {
            DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dateFechaDesde = LocalDate.parse(fechaDesde.replace("N", "-"), dateFormat);
            LocalDate dateFechaHasta = LocalDate.parse(fechaHasta.replace("N", "-"), dateFormat);
            int pageNumber = 0;
            int pageSize = 200;
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());

            Map<String, Integer> agrupadosPorMesAnio = new TreeMap<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

            Page<Object[]> page;

            do {
                page = pedidoRepository.findCantidadIngresosPorFechaYSucursal(pageable, id, dateFechaDesde, dateFechaHasta);
                List<Object[]> resultados = page.getContent();

                for (Object[] resultado : resultados) {
                    String mesAnio = (String) resultado[0];
                    Integer ingresos = ((Number) resultado[1]).intValue();

                    agrupadosPorMesAnio.put(mesAnio, agrupadosPorMesAnio.getOrDefault(mesAnio, 0) + ingresos);
                }

                pageNumber++;
                pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());
            } while (page.hasNext());

            List<List<Object>> data = new ArrayList<>();
            data.add(Arrays.asList("Mes y Año", "Ingresos"));

            for (Map.Entry<String, Integer> entry : agrupadosPorMesAnio.entrySet()) {
                data.add(Arrays.asList(entry.getKey(), entry.getValue()));
            }

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/pedidos/cliente/{idCliente}/{fechaDesde}/{fechaHasta}/datachartbar/ingresos/{idSucursal}")
    public ResponseEntity<List<List<Object>>> getPedidosTotales(@PathVariable("idCliente") Long idCliente,
                                                                @PathVariable("fechaDesde") String fechaDesde,
                                                                @PathVariable("fechaHasta") String fechaHasta,
                                                                @PathVariable("idSucursal") Long id) {
        try {
            DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dateFechaDesde = LocalDate.parse(fechaDesde.replace("N", "-"), dateFormat);  // Reemplaza 'N' con '-' para formatear la fecha correctamente
            LocalDate dateFechaHasta = LocalDate.parse(fechaHasta.replace("N", "-"), dateFormat);  // Reemplaza 'N' con '-' para formatear la fecha correctamente

            int pageNumber = 0;
            int pageSize = 200;
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());

            Map<String, Integer> agrupadosPorMesAnio = new TreeMap<>();

            Page<Object[]> page;

            do {
                page = pedidoRepository.findCantidadPedidosClientePorFechaYSucursal(pageable, id, idCliente, dateFechaDesde, dateFechaHasta);
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

    @GetMapping("/pedidos/{fechaDesde}/{fechaHasta}/datachartbar/comidas/{idSucursal}")
    public ResponseEntity<List<List<Object>>> getComidasFamosas(@PathVariable("fechaDesde") String fechaDesde, @PathVariable("fechaHasta") String fechaHasta, @PathVariable("idSucursal") Long id) {
        try {
            DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dateFechaDesde = LocalDate.parse(fechaDesde.replace("N", "-"), dateFormat);
            LocalDate dateFechaHasta = LocalDate.parse(fechaHasta.replace("N", "-"), dateFormat);
            int pageNumber = 0;
            int pageSize = 200;
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("fechaPedido").ascending());

            // Mapa para almacenar la cantidad de veces que se ha pedido cada artículo de menú por mes y año
            Map<String, Map<String, Integer>> agrupadosPorMesAnio = new TreeMap<>();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

            Page<Object[]> page;

            do {
                page = pedidoRepository.findCantidadPedidosPorFechaYSucursal(pageable, id, dateFechaDesde, dateFechaHasta);
                List<Object[]> resultados = page.getContent();

                for (Object[] resultado : resultados) {
                    String mesAnio = (String) resultado[0];
                    Integer cantidadPedidos = ((Number) resultado[1]).intValue();
                    String nombreMenu = (String) resultado[2];

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
            data.add(Arrays.asList("Mes y Año", "Cantidad de Pedidos"));

            for (Map.Entry<String, Map<String, Integer>> entry : agrupadosPorMesAnio.entrySet()) {
                String mesAnio = entry.getKey();
                Map<String, Integer> comidasFamosas = entry.getValue();

                // Encontrar el menú más pedido para este mes y año
                String menuMasPedido = "";
                int maxPedidos = 0;

                for (Map.Entry<String, Integer> comida : comidasFamosas.entrySet()) {
                    if (comida.getValue() > maxPedidos) {
                        menuMasPedido = comida.getKey();
                        maxPedidos = comida.getValue();
                    }
                }

                data.add(Arrays.asList(mesAnio, maxPedidos));
            }

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @GetMapping("/pedidos/{fechaDesde}/{fechaHasta}/datachartbar/comidas/{idSucursal}")
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

}
