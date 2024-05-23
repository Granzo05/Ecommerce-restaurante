package main.entities.Restaurante;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Productos.Imagenes;
import main.entities.Productos.ImagenesDTO;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmpresaDTO {
    private long id;
    private String cuit;
    private String razonSocial;
    private String contraseña;
    private String email;
    private String borrado;
    private Set<ImagenesDTO> imagenes = new HashSet<>();

    public EmpresaDTO(long id, String cuit, String razonSocial, String email, String borrado) {
        this.id = id;
        this.cuit = cuit;
        this.razonSocial = razonSocial;
        this.email = email;
        this.borrado = borrado;
    }
}