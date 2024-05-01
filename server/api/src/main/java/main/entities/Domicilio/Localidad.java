package main.entities.Domicilio;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Factura.EnumMetodoPago;
import main.entities.Factura.EnumTipoFactura;
import main.entities.Pedidos.Pedido;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "domicilios", schema = "buen_sabor")
public class Domicilio {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "calle")
    private String calle;
    @Column(name = "numero")
    private int numero;
    @Column(name = "codigo_postal")
    private int codigoPostal;

}