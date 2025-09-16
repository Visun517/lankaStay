package lk.ijse.gdse71.lankastay.service.impl;
import lk.ijse.gdse71.lankastay.dto.ReviewDto;
import lk.ijse.gdse71.lankastay.entity.Business;
import lk.ijse.gdse71.lankastay.entity.Review;
import lk.ijse.gdse71.lankastay.entity.Tourist;
import lk.ijse.gdse71.lankastay.entity.User;
import lk.ijse.gdse71.lankastay.exception.ResourceNotFoundException;
import lk.ijse.gdse71.lankastay.repository.BusinessRepository;
import lk.ijse.gdse71.lankastay.repository.ReviewRepository;
import lk.ijse.gdse71.lankastay.repository.TouristRepository;
import lk.ijse.gdse71.lankastay.repository.UserRepository;
import lk.ijse.gdse71.lankastay.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final TouristRepository touristRepository;


    @Override
    public String addReview(ReviewDto reviewDto, Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + id));

        Tourist tourist = touristRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist not found with id: " + id));

        Business business = businessRepository.findById(reviewDto.getBusinessId())
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + reviewDto.getBusinessId()));

        Review review = Review.builder()
                .comment(reviewDto.getComment())
                .rating(reviewDto.getRating())
                .createdAt(LocalDate.now())
                .updatedAt(LocalDate.now())
                .tourist(tourist)
                .business(business)
                .build();

        reviewRepository.save(review);
        return "Review added successfully";
    }

    @Override
    public List<ReviewDto> getAllReviews(Long businessId, int page, int size, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist not found with id: " + userId));
        System.out.println(user);

        Pageable pageable = PageRequest.of(page, size, Sort.by("reviewId").descending());
        Page<Review> reviewList = reviewRepository.findByBusinessId(businessId ,pageable );

        return reviewList.stream()
                .map(reviewDto -> ReviewDto.builder()
                        .review_id(reviewDto.getReviewId())
                        .comment(reviewDto.getComment())
                        .rating(reviewDto.getRating())
                        .touristId(reviewDto.getTourist().getId())
                        .userName(reviewDto.getTourist().getUser().getName())
                        .build()
                )
                .collect(Collectors.toList());
    }

    @Override
    public String removeReview(Long reviewId , Long userId) {
        User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Tourist not found with id: " + userId));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        reviewRepository.delete(review);
        return "Successfully delete review..!";
    }

}
