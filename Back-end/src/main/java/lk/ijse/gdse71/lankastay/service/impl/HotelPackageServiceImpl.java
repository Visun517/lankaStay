package lk.ijse.gdse71.lankastay.service.impl;

import lk.ijse.gdse71.lankastay.dto.PackageDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.HotelPackages;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.repository.BusinessRepository;
import lk.ijse.gdse71.lankastay.repository.HotelPackageRepository;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lk.ijse.gdse71.lankastay.service.FileStorageService;
import lk.ijse.gdse71.lankastay.service.HotelPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelPackageServiceImpl implements HotelPackageService {
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final HotelPackageRepository packageRepository;

    @Override
    public String addPackage(PackageDto packageDto, Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Business business = businessRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + user.getId()));

        String imageUrl = fileStorageService.saveFile(packageDto.getImage(), "package-images");


        HotelPackages hotelPackages = HotelPackages.builder()
                .packageName(packageDto.getPackageName())
                .description(packageDto.getDescription())
                .price(packageDto.getPrice())
                .availability_start(packageDto.getAvailability_start())
                .availability_end(packageDto.getAvailability_end())
                .meal_inclusion(packageDto.getMeal_inclusion())
                .createdAt(java.time.LocalDate.now())
                .updatedAt(java.time.LocalDate.now())
                .imageUrl(imageUrl)
                .business(business)
                .build();

        packageRepository.save(hotelPackages);

        return "HotelPackages added successfully";
    }

    @Override
    public List<PackageDto> getAllPackages(Long id) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + id));

        List<HotelPackages> allPackages = packageRepository.findAllByBusinessId(business.getId());

        List<PackageDto> updatedPackages = allPackages.stream()
                .map(packageDto -> PackageDto.builder()
                        .id(packageDto.getPackage_id())
                        .packageName(packageDto.getPackageName())
                        .description(packageDto.getDescription())
                        .price(packageDto.getPrice())
                        .availability_start(packageDto.getAvailability_start())
                        .availability_end(packageDto.getAvailability_end())
                        .meal_inclusion(packageDto.getMeal_inclusion())
                        .imageUrl(packageDto.getImageUrl())
                        .build()
                )
                .collect(Collectors.toList());
        return updatedPackages;
    }

    @Override
    public Object deletePackage(Long packageId, Long id) throws IOException {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + id));

        HotelPackages hotelPackages = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found with id: " + packageId + " for business id: " + business.getId()));

        fileStorageService.deleteFile(hotelPackages.getImageUrl(), "package-images");
        packageRepository.delete(hotelPackages);

        return "Business deleted successfully";
    }
}

