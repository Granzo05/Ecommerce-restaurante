package main.entities.Restaurante;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.DomicilioDTO;
import main.entities.Productos.Promocion;
import main.entities.Stock.Stock;
import main.entities.Stock.StockEntrante;
import net.minidev.json.annotate.JsonIgnore;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SucursalDTO {
    private long id;
    private DomicilioDTO domicilio;
    private long telefono;
    private String email;
    private LocalTime horarioApertura;
    private LocalTime horarioCierre;
    private List<LocalidadDelivery> localidadesDisponiblesDelivery;

    public SucursalDTO(long id, DomicilioDTO domicilio, long telefono, String email, LocalTime horarioApertura, LocalTime horarioCierre) {
        this.id = id;
        this.domicilio = domicilio;
        this.telefono = telefono;
        this.email = email;
        this.horarioApertura = horarioApertura;
        this.horarioCierre = horarioCierre;
    }

    public SucursalDTO(List<LocalidadDelivery> localidadesDisponiblesDelivery) {
        this.localidadesDisponiblesDelivery = localidadesDisponiblesDelivery;
    }
}