package main.entities.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Sucursal;
import net.minidev.json.annotate.JsonIgnore;

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
    private Set<DetalleStock> detallesStock = new HashSet<>();


}