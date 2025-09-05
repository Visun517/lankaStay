package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.PackageDto;

import java.io.IOException;
import java.util.List;

public interface HotelPackageService {
    Object addPackage(PackageDto packageDto, Long userId) throws IOException;
    List<PackageDto> getAllPackages(Long id);
    Object deleteBusiness(Long packageId, Long id);
}