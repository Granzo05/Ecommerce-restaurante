package main.entities.Productos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Ingredientes.Categoria;
import main.entities.Ingredientes.Medida;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArticuloVentaDTO extends Articulo {
    private Long id;
    private Categoria categoria;
    private Medida medida;
    private String borrado;
    private String nombre;
    private int cantidadMedida;
    private Set<Imagenes> imagenes = new HashSet<>();

    public ArticuloVentaDTO(Long id, String nombre, double precioVenta, Categoria categoria, String borrado, int cantidad, Medida medida) {
        super(precioVenta);
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.borrado = borrado;
        this.cantidadMedida = cantidad;
        this.medida = medida;
    }
}
