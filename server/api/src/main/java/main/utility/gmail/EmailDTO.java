package main.utility.gmail;

import org.springframework.web.multipart.MultipartFile;

public class EmailDTO {
    private String emailCliente;
    private String file;

    public String getEmailCliente() {
        return emailCliente;
    }

    public void setEmailCliente(String emailCliente) {
        this.emailCliente = emailCliente;
    }

    public EmailDTO() {
    }

    public EmailDTO(String emailCliente, MultipartFile file) {
        this.emailCliente = emailCliente;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    @Override
    public String toString() {
        return "EmailDTO{" +
                "emailCliente='" + emailCliente + '\'' +
                '}';
    }
}
