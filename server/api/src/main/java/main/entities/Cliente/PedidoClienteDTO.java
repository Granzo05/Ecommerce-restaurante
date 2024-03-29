package main.entities.Users;

import main.entities.Factura.MetodoPago;
import main.entities.Pedidos.EnumTipoEnvio;
import main.entities.Restaurante.Menu.Menu;

import java.util.Date;
import java.util.List;

public class PedidoClienteDTO {
    private List<Menu> menus;
    private String email;
    private Date fecha;
    private EnumTipoEnvio tipoEnvio;
    private MetodoPago metodoPago;

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public EnumTipoEnvio getTipoEnvio() {
        return tipoEnvio;
    }

    public void setTipoEnvio(EnumTipoEnvio tipoEnvio) {
        this.tipoEnvio = tipoEnvio;
    }

    public List<Menu> getMenus() {
        return menus;
    }

    public void setMenus(List<Menu> menus) {
        this.menus = menus;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
