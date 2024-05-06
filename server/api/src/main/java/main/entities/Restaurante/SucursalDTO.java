package main.entities.Restaurante;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Domicilio.Localidad;
import main.entities.Productos.Promocion;
import main.entities.Stock.Stock;
import main.entities.Stock.StockEntrante;
import net.minidev.json.annotate.JsonIgnore;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString
@Table(name = "sucursales", schema = "buen_sabor")
public class Sucursal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @JsonIgnore
    @OneToOne(mappedBy = "sucursal", cascade = CascadeType.ALL, orphanRemoval = true)
    private Domicilio domicilio;
    @Column(name = "contraseña")
    private String contraseña;
    @Column(name = "telefono")
    private long telefono;
    @Column(name = "email")
    private String email;
    @Column(name = "privilegios")
    private String privilegios;
    @Column(name = "horario_apertura")
    private LocalTime horarioApertura;
    @Column(name = "horario_cierre")
    private LocalTime horarioCierre;
    @JsonIgnore
    @OneToMany(mappedBy = "sucursal")
    private Set<Empleado> empleados = new HashSet<>();
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa")
    private Empresa empresa;
    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";
    @JsonIgnore
    @OneToMany(mappedBy = "sucursal")
    private Set<Stock> stocksSucursal = new HashSet<>();
    @JsonIgnore
    @OneToMany(mappedBy = "sucursal")
    private Set<StockEntrante> stocksEntranteSucursal = new HashSet<>();
    @JsonIgnore
    @ManyToMany(mappedBy = "sucursales")
    private Set<Promocion> promociones = new HashSet<>();
    @JsonIgnore
    @OneToMany(mappedBy = "sucursal", cascade = CascadeType.ALL)
    private Set<LocalidadDelivery> localidadesDisponiblesDelivery = new HashSet<>();
}