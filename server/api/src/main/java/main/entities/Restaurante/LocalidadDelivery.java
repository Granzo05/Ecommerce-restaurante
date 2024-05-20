package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Localidad;
import org.hibernate.annotations.Cascade;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString(exclude = {"sucursal"})
@Table(name = "localidades_delivery", schema = "buen_sabor")
public class LocalidadDelivery {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @JsonIgnoreProperties(value = {"localidadesDisponiblesDelivery"})
    @ManyToOne
    @Cascade(org.hibernate.annotations.CascadeType.DETACH)
    @JoinColumn(name = "id_sucursal")
    private Sucursal sucursal;
    @OneToOne
    @Cascade(org.hibernate.annotations.CascadeType.DETACH)
    @JoinColumn(name = "id_localidad")
    private Localidad localidad;

}