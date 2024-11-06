package com.bookstacker.spring_boot_library.requestModels;

import lombok.Data;

import java.util.Optional;
@Data
public class ReviewRequest {

    private Double rating;

    private Long bookId;

    private Optional<String> reviewDescription;

}
