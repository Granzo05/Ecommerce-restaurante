package main.mapper.Productos;

import lombok.*;
import main.entities.Domicilio.Localidad;
import main.entities.Productos.Imagenes;
import main.mapper.Domicilio.DepartamentoDTO;
import main.mapper.Domicilio.LocalidadDTO;

import java.io.Serializable;

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

    public static ImagenesDTO toDTO(Imagenes imagenes) {
        ImagenesDTO dto = new ImagenesDTO();
        dto.setId(imagenes.getId());
        dto.setNombre(imagenes.getNombre());
        dto.setRuta(imagenes.getRuta());
        dto.setFormato(imagenes.getFormato());
        dto.setBorrado(imagenes.getBorrado());

        return dto;
    }
}
