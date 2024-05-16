package main.entities.Domicilio;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DomicilioDTO {
    private String calle;
    private int numero;
    private int codigoPostal;
    private Localidad localidad;
}