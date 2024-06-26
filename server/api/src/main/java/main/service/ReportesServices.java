package main.service;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import main.entities.Pedidos.DetallesPedido;
import main.entities.Pedidos.Pedido;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;

import java.awt.*;
import java.io.IOException;
import java.util.List;

public class ReportesServices {
    protected static Font titulo = new Font(Font.COURIER, 14, Font.BOLD);
    protected static Font redFont = new Font(Font.COURIER, 12, Font.NORMAL, Color.RED);
    protected static Font textoHeader = new Font(Font.COURIER, 17, Font.BOLD);
    protected static Font texto = new Font(Font.COURIER, 11, Font.NORMAL);
    protected static Font textoBold = new Font(Font.COURIER, 11, Font.BOLD);
    protected static Font textoMini = new Font(Font.COURIER, 8, Font.NORMAL);
    protected static Font textoMiniBold = new Font(Font.COURIER, 8, Font.BOLD);
    protected static Font textoBig = new Font(Font.COURIER, 50, Font.BOLD);

    public void crearEncabezados(SXSSFSheet hoja) {
        XSSFFont font = (XSSFFont) hoja.getWorkbook().createFont();
        font.setBold(true);
        XSSFCellStyle style = (XSSFCellStyle) hoja.getWorkbook().createCellStyle();
        style.setFont(font);

        String[] encabezados = {"Fecha pedido", "ID_pedido", "Articulo", "Cantidad", "Precio", "Subtotal", "Total"};

        SXSSFRow row = hoja.createRow(0);
        for (int i = 0; i < encabezados.length; i++) {
            SXSSFCell cell = row.createCell(i);
            cell.setCellValue(encabezados[i]);
            cell.setCellStyle(style);
        }
    }

    public void imprimirExcelPedidos(List<Pedido> pedidos, SXSSFSheet hoja) throws IOException {
        int nroFila = hoja.getLastRowNum() + 1;
        for (Pedido pedido : pedidos) {
            int index = 0;
            double total = 0;
            for (DetallesPedido detalle : pedido.getDetallesPedido()) {
                SXSSFRow row = hoja.createRow(nroFila++);
                int nroColumna = 0;

                row.createCell(nroColumna++).setCellValue(pedido.getFechaPedido().toString());
                row.createCell(nroColumna++).setCellValue(pedido.getId());
                if (detalle.getArticuloMenu() != null) {
                    row.createCell(nroColumna++).setCellValue(detalle.getArticuloMenu().getNombre());
                } else {
                    row.createCell(nroColumna++).setCellValue(detalle.getArticuloVenta().getNombre());
                }
                row.createCell(nroColumna++).setCellValue(detalle.getCantidad());
                if (detalle.getArticuloMenu() != null) {
                    row.createCell(nroColumna++).setCellValue(detalle.getArticuloMenu().getPrecioVenta());
                    row.createCell(nroColumna++).setCellValue(detalle.getArticuloMenu().getPrecioVenta() * detalle.getCantidad());
                    total += detalle.getArticuloMenu().getPrecioVenta() * detalle.getCantidad();
                } else {
                    row.createCell(nroColumna++).setCellValue(detalle.getArticuloVenta().getPrecioVenta());
                    row.createCell(nroColumna++).setCellValue(detalle.getArticuloVenta().getPrecioVenta() * detalle.getCantidad());
                    total += detalle.getArticuloVenta().getPrecioVenta() * detalle.getCantidad();
                }

                if (index == pedido.getDetallesPedido().size() - 1) {
                    row.createCell(nroColumna++).setCellValue(total);
                }

                index++;
            }

            hoja.createRow(nroFila++);
        }
    }


    public static void addMetaData(Document document) {
        document.addTitle("Reporte PDF");
        document.addSubject("Ejemplo PDF");
        document.addKeywords("PDF");
        document.addAuthor("Facundo Granzotto");
        document.addCreator("Facundo Granzotto");
    }


}