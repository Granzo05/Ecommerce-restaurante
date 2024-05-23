package main.entities.Ingredientes;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Restaurante.Sucursal;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaDTO {
    private Long id;
    private String denominacion;
    private String borrado;
    private Set<SubcategoriaDTO> subcategorias = new HashSet<>();

    public CategoriaDTO(Long id, String denominacion, String borrado) {
        this.id = id;
        this.denominacion = denominacion;
        this.borrado = borrado;
    }
}