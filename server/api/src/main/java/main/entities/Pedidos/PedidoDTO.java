package main.entities.Pedidos;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Cliente.Cliente;
import main.entities.Cliente.ClienteDTO;
import main.entities.Factura.Factura;
import main.entities.Factura.FacturaDTO;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PedidoDTO {
    private Long id;
    private EnumTipoEnvio tipoEnvio;
    private EnumEstadoPedido estado;
    public Date fechaPedido;
    private String horaFinalizacion;
    private ClienteDTO cliente;
    private Long idCliente;
    private Set<DetallesPedidoDTO> detallesPedido = new HashSet<>();

    public PedidoDTO(Long id, EnumTipoEnvio tipoEnvio, EnumEstadoPedido estado, Date fechaPedido, String horaFinalizacion, Long idCliente) {
        this.id = id;
        this.tipoEnvio = tipoEnvio;
        this.estado = estado;
        this.fechaPedido = fechaPedido;
        this.horaFinalizacion = horaFinalizacion;
        this.idCliente = idCliente;
    }
}