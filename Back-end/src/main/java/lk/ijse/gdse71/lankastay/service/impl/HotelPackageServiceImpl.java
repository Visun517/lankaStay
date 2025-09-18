package lk.ijse.gdse71.lankastay.service.impl;

import lk.ijse.gdse71.lankastay.dto.BusinessDto;
import lk.ijse.gdse71.lankastay.dto.PackageDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.HotelPackages;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.exception.FileOperationException;
import lk.ijse.gdse71.lankastay.exception.ResourceNotFoundException;
import lk.ijse.gdse71.lankastay.repository.BusinessRepository;
import lk.ijse.gdse71.lankastay.repository.HotelPackageRepository;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lk.ijse.gdse71.lankastay.service.FileStorageService;
import lk.ijse.gdse71.lankastay.service.HotelPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.RejectedExecutionException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelPackageServiceImpl implements HotelPackageService {
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final HotelPackageRepository packageRepository;

    @Override
    public String addPackage(PackageDto packageDto, Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RejectedExecutionException("User not found with id: " + userId));

        Business business = businessRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + user.getId()));

        String imageUrl = null;
        try {
            imageUrl = fileStorageService.saveFile(packageDto.getImage(), "package-images");
        } catch (IOException e) {
            throw new FileOperationException("Error saving file");
        }
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
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + id));

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
    public String deletePackage(Long packageId, Long id){
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + id));

        HotelPackages hotelPackages = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + packageId + " for business id: " + business.getId()));

        try {
            fileStorageService.deleteFile(hotelPackages.getImageUrl(), "package-images");
        } catch (IOException e) {
            throw new FileOperationException("Error deleting file");
        }
        packageRepository.delete(hotelPackages);

        return "Business deleted successfully";
    }

    @Override
    public List<PackageDto> getRecommendedPackages(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        List<HotelPackages> allPackages = packageRepository.findAll();

        List<HotelPackages> recommendedPackages = allPackages.stream()
                .sorted(Comparator.comparingDouble(HotelPackages::getPrice))
                .limit(5)
                .collect(Collectors.toList());

        List<PackageDto> updatedPackages = recommendedPackages.stream()
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
}

