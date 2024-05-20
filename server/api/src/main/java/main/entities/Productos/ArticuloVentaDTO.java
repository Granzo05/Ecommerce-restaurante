package main.entities.Productos;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Ingredientes.EnumMedida;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ArticuloVentaDTO extends Articulo {
    private Long id;
    private EnumTipoArticuloVenta tipo;
    private EnumMedida medida;
    private String borrado;
    private int cantidadMedida;
    private Set<Imagenes> imagenes = new HashSet<>();

    public ArticuloVentaDTO(Long id, String nombre, double precioVenta, EnumTipoArticuloVenta tipo, String borrado) {
        super(nombre, precioVenta);
        this.id = id;
        this.tipo = tipo;
        this.borrado = borrado;
    }
}
