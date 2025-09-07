package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.CloseDateDto;

import java.util.List;

public interface ClosedDatesService {
    String addClosedDate(Long id, CloseDateDto closeDateDto);
    String removeClosedDate(Long id, Long closeDateDto);
    List<CloseDateDto> getAllDates(Long id);
}
