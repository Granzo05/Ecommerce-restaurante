package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import main.entities.Domicilio.DomicilioDTO;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SucursalDTO {
    private long id;
    private DomicilioDTO domicilio;
    private long telefono;
    private String email;
    private String privilegios;
    private LocalTime horarioApertura;
    private LocalTime horarioCierre;
    @JsonIgnoreProperties(value = {"sucursal"})
    private List<LocalidadDelivery> localidadesDisponiblesDelivery;
    private String borrado;

    public SucursalDTO(long id, long telefono, String email, LocalTime horarioApertura, LocalTime horarioCierre, String borrado) {
        this.id = id;
        this.telefono = telefono;
        this.email = email;
        this.horarioApertura = horarioApertura;
        this.horarioCierre = horarioCierre;
        this.borrado = borrado;
    }

    public SucursalDTO(long id) {
        this.id = id;
    }
}