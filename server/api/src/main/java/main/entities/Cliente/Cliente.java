package main.entities.Cliente;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@ToString
@Table(name = "clientes", schema = "buen_sabor")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "email")
    private String email;
    @JsonIgnore
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Domicilio> domicilios = new HashSet<>();
    @Column(name = "telefono")
    private long telefono;
    @JsonIgnore
    @Column(name = "contraseña")
    private String contraseña;
    @JsonIgnore
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    @Column(name = "fecha_registro", updatable = false, nullable = false)
    public LocalDateTime fechaRegistro;
    @JsonIgnore
    @Column(name = "fecha_nacimiento", nullable = false)
    public LocalDate fechaNacimiento;
    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";
}

