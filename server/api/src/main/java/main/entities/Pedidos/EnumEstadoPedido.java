package main.entities.Pedidos;

public enum EnumEstadoPedido {
    ENTRANTES,
    ACEPTADOS,
    COCINADOS,
    ENTREGADOS,
    RECHAZADOS,
    EN_CAMINO;

    public static EnumEstadoPedido fromIndex(int index) {
        return EnumEstadoPedido.values()[index];
    }
}

