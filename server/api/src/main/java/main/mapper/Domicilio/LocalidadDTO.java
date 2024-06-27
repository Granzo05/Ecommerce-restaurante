package main.mapper.Domicilio;

import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.Localidad;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LocalidadDTO {

    private Long id;

    private String nombre;

    private DepartamentoDTO departamento;

    public static LocalidadDTO toDTO(Localidad localidad) {
        LocalidadDTO dto = new LocalidadDTO();
        dto.setId(localidad.getId());
        dto.setNombre(localidad.getNombre());
        dto.setDepartamento(DepartamentoDTO.toDTO(localidad.getDepartamento()));

        return dto;
    }
}