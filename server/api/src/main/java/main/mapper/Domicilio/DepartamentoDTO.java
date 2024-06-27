package main.mapper.Domicilio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Domicilio.Departamento;
import main.entities.Domicilio.Provincia;
import main.entities.Restaurante.Sucursal;
import main.mapper.Restaurante.SucursalDTO;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DepartamentoDTO {

    private Long id;

    private String nombre;

    private ProvinciaDTO provincia;

    public static DepartamentoDTO toDTO(Departamento departamento) {
        DepartamentoDTO dto = new DepartamentoDTO();
        dto.setId(departamento.getId());
        dto.setNombre(departamento.getNombre());
        dto.setProvincia(ProvinciaDTO.toDTO(departamento.getProvincia()));

        return dto;
    }
}