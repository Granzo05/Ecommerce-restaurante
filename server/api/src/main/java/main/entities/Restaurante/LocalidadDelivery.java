package main.entities.Restaurante;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Localidad;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "localidades_delivery", schema = "buen_sabor")
public class LocalidadDelivery {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @ManyToOne
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;

}