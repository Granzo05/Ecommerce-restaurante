package main.entities.Productos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Ingredientes.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArticuloVentaDTO extends Articulo {
    private Long id;
    @JsonIgnoreProperties("sucursales")
    private Categoria categoria;
    @JsonIgnoreProperties("sucursales")
    private Subcategoria subcategoria;
    @JsonIgnoreProperties("sucursales")
    private Medida medida;
    private String borrado;
    private String nombre;
    private int cantidadMedida;
    private Set<ImagenesDTO> imagenes = new HashSet<>();

    public ArticuloVentaDTO(Long id, String nombre, double precioVenta, String borrado, int cantidad, Categoria categoria, Subcategoria subcategoria, Medida medida) {
        super(precioVenta);
        this.id = id;
        this.nombre = nombre;
        this.borrado = borrado;
        this.cantidadMedida = cantidad;
        this.categoria = categoria;
        this.medida = medida;
        this.subcategoria = subcategoria;
    }
}
