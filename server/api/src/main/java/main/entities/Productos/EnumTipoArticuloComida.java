package main.entities.Productos;

import main.entities.Pedidos.EnumEstadoPedido;

public enum EnumTipoArticuloComida {
    HAMBURGUESAS,
    PANCHOS,
    EMPANADAS,
    PIZZAS,
    LOMOS,
    HELADO,
    PARRILLA,
    PASTAS,
    SUSHI,
    MILANESAS;

    public static EnumTipoArticuloComida fromIndex(int index) {
        return EnumTipoArticuloComida.values()[index];
    }

}
