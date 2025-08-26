package lk.ijse.gdse71.lankastay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LankaStayApplication {

    public static void main(String[] args) {
        SpringApplication.run(LankaStayApplication.class, args);
    }

}
