package main.entities.Domicilio;

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
@ToString
public class DomicilioDTO {
    private String calle;
    private int numero;
    private int codigoPostal;
    private Localidad localidad;
}