package main.mapper.Cliente;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.entities.Cliente.Cliente;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDTO implements Serializable {

    private Long id;

    private String nombre;

    private String email;

    private long telefono;

    private Long idSucursalRecomendada;

    public static ClienteDTO toDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getNombre());
        dto.setEmail(cliente.getEmail());
        dto.setTelefono(cliente.getTelefono());
        dto.setIdSucursalRecomendada(cliente.getIdSucursalRecomendada());

        return dto;
    }
}

