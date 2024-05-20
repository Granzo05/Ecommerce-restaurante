package main.entities.Stock;

import lombok.*;
import main.entities.Ingredientes.EnumMedida;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class StockIngredientesDTO extends Stock {
    private Long id;
    private String nombreIngrediente;
    private String borrado;

    public StockIngredientesDTO(double precioCompra, int cantidadActual, int cantidadMinima, int cantidadMaxima, EnumMedida medida, Long id1, String nombreIngrediente, String borrado) {
        super(precioCompra, cantidadActual, cantidadMinima, cantidadMaxima, medida);
        this.id = id1;
        this.nombreIngrediente = nombreIngrediente;
        this.borrado = borrado;
    }


}
