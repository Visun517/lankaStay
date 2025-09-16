package lk.ijse.gdse71.lankastay.service.impl;

import lk.ijse.gdse71.lankastay.dto.CloseDateDto;
import lk.ijse.gdse71.lankastay.dto.PackageDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.ClosedDate;
import lk.ijse.gdse71.lankastay.entity.HotelPackages;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.exception.ResourceNotFoundException;
import lk.ijse.gdse71.lankastay.repository.BusinessRepository;
import lk.ijse.gdse71.lankastay.repository.ClosedDatesRepository;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lk.ijse.gdse71.lankastay.service.ClosedDatesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClosedDatesServiceImpl implements ClosedDatesService {

    private final ClosedDatesRepository closedDatesRepository;
    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;

    @Override
    public String addClosedDate(Long id, CloseDateDto closeDateDto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + id));

        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with email: " + id));

        ClosedDate closedDate = ClosedDate.builder()
                .date(closeDateDto.getDate())
                .business(business)
                .build();

        closedDatesRepository.save(closedDate);

        return "Closed date added successfully";

    }

    @Override
    public String removeClosedDate(Long id, Long dateId) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + id));

        ClosedDate closedDate = closedDatesRepository.findById(dateId)
                .orElseThrow(() -> new ResourceNotFoundException("Closed date not found with id: " + dateId + " for business id: " + business.getId()));

        closedDatesRepository.delete(closedDate);

        return "Closed date deleted successfully";
    }

    @Override
    public List<CloseDateDto> getAllDates(Long id) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + id));

        List<ClosedDate> allDates = closedDatesRepository.findAllByBusinessId(business.getId());

        List<CloseDateDto> closeDateDtoList = allDates.stream()
                .map(closedDateDto -> CloseDateDto.builder()
                        .id(closedDateDto.getId())
                        .date(closedDateDto.getDate())
                        .build()
                )
                .collect(Collectors.toList());
        return closeDateDtoList;

    }
}
