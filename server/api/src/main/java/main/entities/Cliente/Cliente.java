package main.entities.Cliente;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Pedidos.Pedido;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
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
    public Date fechaRegistro;
    @JsonIgnore
    @Column(name = "fecha_nacimiento", updatable = false, nullable = false)
    public Date fechaNacimiento;
    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    private Set<Pedido> pedido = new HashSet<>();
}

