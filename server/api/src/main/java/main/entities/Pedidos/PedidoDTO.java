package main.entities.Pedidos;

import lombok.*;
import main.entities.Cliente.ClienteDTO;

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
    private String borrado;
    private ClienteDTO cliente;
    private Long idCliente;
    private Set<DetallesPedidoDTO> detallesPedido = new HashSet<>();

    public PedidoDTO(Long id, EnumTipoEnvio tipoEnvio, EnumEstadoPedido estado, Date fechaPedido, String horaFinalizacion, Long idCliente, String borrado) {
        this.id = id;
        this.tipoEnvio = tipoEnvio;
        this.estado = estado;
        this.fechaPedido = fechaPedido;
        this.horaFinalizacion = horaFinalizacion;
        this.idCliente = idCliente;
        this.borrado = borrado;
    }
}