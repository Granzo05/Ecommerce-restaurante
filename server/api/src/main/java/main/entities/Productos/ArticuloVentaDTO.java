package main.entities.Productos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Ingredientes.EnumMedida;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArticuloVentaDTO extends Articulo {
    private Long id;
    private EnumTipoArticuloVenta tipo;
    private EnumMedida medida;
    private String borrado;
    private String nombre;
    private int cantidadMedida;
    private Set<Imagenes> imagenes = new HashSet<>();

    public ArticuloVentaDTO(Long id, String nombre, double precioVenta, EnumTipoArticuloVenta tipo, String borrado, int cantidad, EnumMedida medida) {
        super(precioVenta);
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.borrado = borrado;
        this.cantidadMedida = cantidad;
        this.medida = medida;
    }
}
