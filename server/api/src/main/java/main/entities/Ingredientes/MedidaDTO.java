package main.entities.Ingredientes;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Sucursal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MedidaDTO {
    private Long id;
    private String denominacion;
    private String borrado = "NO";
}