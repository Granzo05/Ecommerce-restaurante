package main.entities.Restaurante;

import jakarta.persistence.*;
import lombok.*;
import main.entities.Productos.Imagenes;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "empresa", schema = "buen_sabor")
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(name = "cuit")
    private String cuit;
    @Column(name = "razon_social")
    private String razonSocial;
    @Column(name = "email")
    private String email;
    @Column(name = "contraseña")
    private String contraseña;
    @Column(name = "borrado")
    private String borrado;
    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL)
    private Set<Sucursal> sucursales = new HashSet<>();
    @OneToMany(mappedBy = "empresa", fetch = FetchType.LAZY)
    private Set<Imagenes> imagenes = new HashSet<>();
}