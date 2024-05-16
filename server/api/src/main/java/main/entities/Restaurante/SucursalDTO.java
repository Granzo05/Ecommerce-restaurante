package main.entities.Restaurante;

import lombok.*;
import main.entities.Domicilio.DomicilioDTO;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SucursalDTO {
    private long id;
    private DomicilioDTO domicilio;
    private long telefono;
    private String email;
    private String privilegios;
    private LocalTime horarioApertura;
    private LocalTime horarioCierre;
    private List<LocalidadDelivery> localidadesDisponiblesDelivery;

    public SucursalDTO(long id, long telefono, String email, String privilegios) {
        this.id = id;
        this.telefono = telefono;
        this.email = email;
        this.privilegios = privilegios;
    }

    public SucursalDTO(long id) {
        this.id = id;
    }
}