package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.SpecialOffersDto;

import java.io.IOException;
import java.util.List;

public interface SpecialOfferService {
    Object addPackage(SpecialOffersDto specialOffersDto, Long id) throws IOException;
    List<SpecialOffersDto> getAllOffers(Long id);
    Object deleteOffer(Long offerId, Long id);
}
