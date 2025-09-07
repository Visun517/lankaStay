package lk.ijse.gdse71.lankastay.service.impl;

import lk.ijse.gdse71.lankastay.dto.PackageDto;
import lk.ijse.gdse71.lankastay.dto.SpecialOffersDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.HotelPackages;
import lk.ijse.gdse71.lankastay.entity.SpecialOffer;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.repository.BusinessRepository;
import lk.ijse.gdse71.lankastay.repository.SpecialOfferRepository;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lk.ijse.gdse71.lankastay.service.FileStorageService;
import lk.ijse.gdse71.lankastay.service.SpecialOfferService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecialOffersServiceImpl implements SpecialOfferService {
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final SpecialOfferRepository specialOfferRepository;
    private final ModelMapper modelMapper;

    @Override
    public Object addPackage(SpecialOffersDto specialOffersDto, Long id) throws IOException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        Business business = businessRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + user.getId()));

        String imageUrl = fileStorageService.saveFile(specialOffersDto.getImage(), "special-offers-images");

        SpecialOffer specialOffer = SpecialOffer.builder()
                .title(specialOffersDto.getTitle())
                .description(specialOffersDto.getDescription())
                .discountPercentage(specialOffersDto.getDiscountPercentage())
                .valid_from(specialOffersDto.getValid_from())
                .valid_until(specialOffersDto.getValid_until())
                .createdAt(java.time.LocalDate.now())
                .updatedAt(java.time.LocalDate.now())
                .imageUrl(imageUrl)
                .business(business)
                .build();

        specialOfferRepository.save(specialOffer);

        return "Special offer added successfully";

    }

    @Override
    public List<SpecialOffersDto> getAllOffers(Long id) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + id));

        List<SpecialOffer> allPackages = specialOfferRepository.findAllByBusinessId(business.getId());

        List<SpecialOffersDto> updatedPackages = allPackages.stream()
                .map(specialOffersDto -> SpecialOffersDto.builder()
                        .offer_id(specialOffersDto.getOffer_id())
                        .title(specialOffersDto.getTitle())
                        .discountPercentage(specialOffersDto.getDiscountPercentage())
                        .valid_from(specialOffersDto.getValid_from())
                        .valid_until(specialOffersDto.getValid_until())
                        .description(specialOffersDto.getDescription())
                        .imageUrl("http://localhost:8080/uploads/special-offers-images/" + specialOffersDto.getImageUrl())
                        .build()
                )
                .collect(Collectors.toList());

        return updatedPackages;
    }

    @Override
    public Object deleteOffer(Long offerId, Long id) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found with id: " + id));

        SpecialOffer specialOffer = specialOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Special offer not found with id: " + offerId));

        if (!specialOffer.getBusiness().getId().equals(business.getId())) {
            throw new RuntimeException("Unauthorized to delete this special offer");
        }

        specialOfferRepository.delete(specialOffer);

        return "Special offer deleted successfully";
    }
}
