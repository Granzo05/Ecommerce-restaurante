package main.entities.Productos;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImagenesProductoDTO {
    private Long id;
    private String nombre;
    private String ruta;
    private String formato;
}
