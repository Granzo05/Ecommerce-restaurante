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