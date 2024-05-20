package main.entities.Productos;

import lombok.*;

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
