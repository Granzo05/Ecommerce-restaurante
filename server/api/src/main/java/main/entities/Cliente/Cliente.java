package main.entities.Cliente;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Pedidos.Pedido;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
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
public class Cliente implements Serializable {
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    @Column(name = "fecha_registro", updatable = false, nullable = false)
    public LocalDateTime fechaRegistro;

    @JsonIgnore
    @Column(name = "fecha_nacimiento", nullable = false)
    public LocalDate fechaNacimiento;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "email")
    private String email;

    @JsonIgnoreProperties(value = {"domicilios"}, allowSetters = true)
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cliente", cascade = CascadeType.ALL)
    private Set<Domicilio> domicilios = new HashSet<>();

    @Column(name = "telefono")
    private long telefono;

    @JsonIgnore
    @Column(name = "contraseña")
    private String contraseña;

    @JsonIgnore
    @Column(name = "borrado")
    private String borrado = "NO";

    @JsonIgnoreProperties(value = {
            "factura", "cliente", "sucursales", "detallesPedido",
            "tipoEnvio", "estado", "domicilioEntrega"
    }, allowSetters = true)
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    private Set<Pedido> pedidos = new HashSet<>();

    @Transient
    private Long idSucursalRecomendada;
}

