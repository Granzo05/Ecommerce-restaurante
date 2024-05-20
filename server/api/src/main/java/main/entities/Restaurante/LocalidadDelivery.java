package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Localidad;

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
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;
    @OneToOne
    @JoinColumn(name = "id_localidad")
    private Localidad localidad;

}