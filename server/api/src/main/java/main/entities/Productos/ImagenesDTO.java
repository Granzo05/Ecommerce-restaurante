package main.entities.Productos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImagenesDTO {
    private Long id;
    private String nombre;
    private String ruta;
    private String borrado;
    private String formato;
}
