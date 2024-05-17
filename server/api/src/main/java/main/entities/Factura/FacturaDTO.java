package main.entities.Factura;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Pedidos.Pedido;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FacturaDTO {
    private Long id;
    private EnumTipoFactura tipoFactura;
    private EnumMetodoPago metodoPago;
    public Date fechaFacturacion;
    private double total;
}