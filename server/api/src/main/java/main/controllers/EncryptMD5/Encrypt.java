package main.controllers.EncryptMD5;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class Encrypt {
    private static final String clave = "claveSecreta12345";

    public static String cifrarPassword(String texto) {
        try {
            // Obtener instancia de MessageDigest para SHA-512
            MessageDigest md = MessageDigest.getInstance("SHA-512");

            // Calcular el hash del texto
            byte[] hash = md.digest(texto.getBytes());

            // Convertir el hash a una representación hexadecimal
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }

            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String encriptarString(String texto) throws Exception {
        // Asegúrate de que la clave tenga al menos 8 caracteres
        if (clave.length() < 8) {
            throw new IllegalArgumentException("La clave debe tener al menos 8 caracteres.");
        }

        // Toma los primeros 8 bytes de la clave como la clave AES
        byte[] claveAES = clave.substring(0, 8).getBytes();

        SecretKeySpec key = new SecretKeySpec(claveAES, "DES");
        Cipher cifrador = Cipher.getInstance("DES");
        cifrador.init(Cipher.ENCRYPT_MODE, key);
        byte[] textoCifrado = cifrador.doFinal(texto.getBytes());
        return Base64.getEncoder().encodeToString(textoCifrado);
    }

    public static String desencriptarString(String textoCifrado) throws Exception {
        if (clave.length() < 8) {
            throw new IllegalArgumentException("La clave debe tener al menos 8 caracteres.");
        }

        // Toma los primeros 8 bytes de la clave como la clave AES
        byte[] claveAES = clave.substring(0, 8).getBytes();

        SecretKeySpec key = new SecretKeySpec(claveAES, "DES");
        Cipher descifrador = Cipher.getInstance("DES");
        descifrador.init(Cipher.DECRYPT_MODE, key);
        byte[] textoBytes = Base64.getDecoder().decode(textoCifrado);
        byte[] textoDescifrado = descifrador.doFinal(textoBytes);
        return new String(textoDescifrado);
    }
}
