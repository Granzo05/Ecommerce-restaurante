package main.entities.Productos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImagenesProductoDTO {
    private Long id;
    private String nombre;
    private String ruta;
    private String borrado;
    private String formato;
}
