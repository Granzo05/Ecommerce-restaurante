package main.mapper.Restaurante;

import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.mapper.Domicilio.LocalidadDTO;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DomicilioDTO {

    private Long id;

    private String calle;

    private int numero;

    private int codigoPostal;

    private String borrado = "NO";

    private LocalidadDTO localidad;

    public static DomicilioDTO toDTO(Domicilio domicilio) {
        DomicilioDTO dto = new DomicilioDTO();
        dto.setId(domicilio.getId());
        dto.setCalle(domicilio.getCalle());
        dto.setNumero(domicilio.getNumero());
        dto.setCodigoPostal(domicilio.getCodigoPostal());
        dto.setBorrado(domicilio.getBorrado());
        dto.setLocalidad(LocalidadDTO.toDTO(domicilio.getLocalidad()));

        return dto;
    }
}