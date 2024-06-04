package main.entities.Restaurante;

import lombok.*;
import main.entities.Domicilio.Domicilio;
import main.entities.Ingredientes.Categoria;
import main.entities.Productos.Imagenes;
import main.entities.Productos.Promocion;

import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Setter
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class SucursalDTO {
    private Long id;
    private Domicilio domicilio;
    private Long telefono;
    private String email;
    private String nombre;
    private LocalTime horarioApertura;
    private LocalTime horarioCierre;
    private String borrado = "NO";
    private Set<Promocion> promociones = new HashSet<>();
    private Set<LocalidadDelivery> localidadesDisponiblesDelivery = new HashSet<>();
    private Set<Imagenes> imagenes = new HashSet<>();
    private Set<Categoria> categorias = new HashSet<>();

    public SucursalDTO(Long id, Domicilio domicilio, Long telefono, String email, String nombre, LocalTime horarioApertura, LocalTime horarioCierre, String borrado) {
        this.id = id;
        this.domicilio = domicilio;
        this.telefono = telefono;
        this.email = email;
        this.nombre = nombre;
        this.horarioApertura = horarioApertura;
        this.horarioCierre = horarioCierre;
        this.borrado = borrado;
    }
}
