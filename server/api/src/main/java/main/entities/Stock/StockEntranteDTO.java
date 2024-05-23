package main.entities.Stock;

import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class StockEntranteDTO {
    private Long id;
    private LocalDate fechaLlegada;
    private String borrado;
    private Set<DetalleStockDTO> detallesStock = new HashSet<>();

    public StockEntranteDTO(Long id, LocalDate fechaLlegada, String borrado) {
        this.id = id;
        this.fechaLlegada = fechaLlegada;
        this.borrado = borrado;
    }
}