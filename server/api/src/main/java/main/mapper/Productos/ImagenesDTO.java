package main.mapper.Productos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.mapper.Ingredientes.Categoria;
import main.mapper.Restaurante.Empleado;
import main.mapper.Restaurante.Empresa;
import main.mapper.Restaurante.Sucursal;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImagenesDTO implements Serializable {
    private Long id;

    private String nombre;

    private String ruta;

    private String formato;

    private String borrado = "NO";
}
