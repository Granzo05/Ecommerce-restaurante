package main.mapper.Domicilio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Domicilio.Departamento;
import main.entities.Domicilio.Pais;
import main.entities.Domicilio.Provincia;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProvinciaDTO {
    private Long id;

    private String nombre;

    private PaisDTO pais;

    public static ProvinciaDTO toDTO(Provincia provincia) {
        ProvinciaDTO dto = new ProvinciaDTO();
        dto.setId(provincia.getId());
        dto.setNombre(provincia.getNombre());
        dto.setPais(PaisDTO.toDTO(provincia.getPais()));

        return dto;
    }
}