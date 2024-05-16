package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StockEntranteDTO {
    private Long id;
    public Date fechaLlegada;
    @JsonIgnoreProperties(value = {"stockEntrante"})
    private Set<DetalleStockDTO> detallesStock = new HashSet<>();

    public StockEntranteDTO(Long id, Date fechaLlegada) {
        this.id = id;
        this.fechaLlegada = fechaLlegada;
    }
}