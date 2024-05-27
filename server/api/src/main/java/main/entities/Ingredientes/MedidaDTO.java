package main.entities.Ingredientes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MedidaDTO {
    private Long id;
    private String nombre;
    private String borrado = "NO";

    public MedidaDTO(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}