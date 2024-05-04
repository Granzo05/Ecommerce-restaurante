package main.entities.Domicilio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Cliente.Cliente;
import main.entities.Restaurante.Empleado;
import main.entities.Restaurante.Sucursal;
import net.minidev.json.annotate.JsonIgnore;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "domicilios", schema = "buen_sabor")
public class Domicilio {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "calle")
    private String calle;
    @Column(name = "numero")
    private int numero;
    @Column(name = "codigo_postal")
    private int codigoPostal;
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_localidad")
    private Localidad localidad;
    @JsonIgnore
    @ManyToOne
    @JoinTable(
            name = "clientes_domicilio",
            joinColumns = @JoinColumn(name = "id_domicilio"),
            inverseJoinColumns = @JoinColumn(name = "id_cliente")
    )
    private Cliente cliente;
    @JsonIgnore
    @OneToOne
    @JoinTable(
            name = "sucursales_domicilio",
            joinColumns = @JoinColumn(name = "id_domicilio"),
            inverseJoinColumns = @JoinColumn(name = "id_sucursal")
    )
    private Sucursal sucursal;
    @JsonIgnore
    @ManyToOne
    @JoinTable(
            name = "empleados_domicilio",
            joinColumns = @JoinColumn(name = "id_domicilio"),
            inverseJoinColumns = @JoinColumn(name = "id_empleado")
    )
    private Empleado empleado;
}