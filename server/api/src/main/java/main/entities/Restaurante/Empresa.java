package main.entities.Restaurante;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
    @Column(name = "domicilio")
    private String domicilio;
    @Column(name = "contraseña")
    private String contraseña;
    @Column(name = "telefono")
    private long telefono;
    @Column(name = "email")
    private String email;
    @Column(name = "privilegios")
    private String privilegios;
    @Column(name = "horario_apertura")
    private LocalDate horarioApertura;
    @Column(name = "horario_cierre")
    private LocalDate horarioCierre;
    @OneToMany(mappedBy = "sucursal")
    private List<Empleado> empleados = new ArrayList<>();
}