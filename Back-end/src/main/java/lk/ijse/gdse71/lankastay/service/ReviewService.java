package lk.ijse.gdse71.lankastay.service;

import lk.ijse.gdse71.lankastay.dto.ReviewDto;

import java.util.List;

public interface ReviewService {
    String addReview(ReviewDto reviewDto, Long id);
    List<ReviewDto> getAllReviews(Long businessId ,int page , int size , Long userId);
    String removeReview(Long reviewId , Long userId);
    double getRatings(Long id);
}
