package main.entities.Restaurante;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "restaurante", schema = "buen_sabor")
public class Restaurante {
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
}