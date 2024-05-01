package main.entities.Restaurante;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Productos.Promocion;
import main.entities.Stock.Stock;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "sucursales", schema = "buen_sabor")
public class Sucursal {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @OneToOne(mappedBy = "sucursal", cascade = CascadeType.ALL)
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
    @OneToMany(mappedBy = "sucursal")
    private Set<Empleado> empleados = new HashSet<>();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa")
    private Empresa empresa;
    @Column(name = "borrado")
    private String borrado = "NO";
    @OneToMany(mappedBy = "sucursal")
    private Set<Stock> stocksSucursal = new HashSet<>();
    @ManyToMany(mappedBy = "sucursales")
    private Set<Promocion> promociones = new HashSet<>();
}