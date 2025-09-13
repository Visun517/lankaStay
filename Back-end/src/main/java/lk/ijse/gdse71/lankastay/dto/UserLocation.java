package lk.ijse.gdse71.lankastay.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserLocation {
    private final double latitude;
    private final double longitude;
}
