package main.mapper.Restaurante;

import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.Localidad;

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

    private Localidad localidad;

    public static DomicilioDTO toDTO(Domicilio domicilio) {
        DomicilioDTO dto = new DomicilioDTO();
        dto.setId(domicilio.getId());
        dto.setCalle(domicilio.getCalle());
        dto.setNumero(domicilio.getNumero());
        dto.setCodigoPostal(domicilio.getCodigoPostal());
        dto.setBorrado(domicilio.getBorrado());
        dto.setLocalidad(domicilio.getLocalidad());

        return dto;
    }
}