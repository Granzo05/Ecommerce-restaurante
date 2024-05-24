package main.entities.Ingredientes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaDTO {
    private Long id;
    private String nombre;
    private String borrado;
    private Set<SubcategoriaDTO> subcategorias = new HashSet<>();

    public CategoriaDTO(Long id, String nombre, String borrado) {
        this.id = id;
        this.nombre = nombre;
        this.borrado = borrado;
    }

    public CategoriaDTO(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}