package main.utility;

import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;
import main.entities.Pedidos.Pedido;

@Getter
@Setter
public class PreferenceMP {
    private String id;
    private int statusCode;
    @OneToOne(mappedBy = "preferencia")
    private Pedido pedido;
}
