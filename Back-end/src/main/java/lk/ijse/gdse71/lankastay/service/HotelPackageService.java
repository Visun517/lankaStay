package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.PackageDto;

import java.io.IOException;
import java.util.List;

public interface HotelPackageService {
    String addPackage(PackageDto packageDto, Long userId);
    List<PackageDto> getAllPackages(Long id);
    String deletePackage(Long packageId, Long id);
    List<PackageDto> getRecommendedPackages(Long id);
}