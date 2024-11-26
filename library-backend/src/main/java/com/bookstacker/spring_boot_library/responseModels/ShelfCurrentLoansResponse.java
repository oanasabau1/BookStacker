package com.bookstacker.spring_boot_library.responseModels;

import com.bookstacker.spring_boot_library.entity.Book;
import lombok.Data;

@Data
public class ShelfCurrentLoansResponse {

    public ShelfCurrentLoansResponse(Book book, int daysLeft) {
        this.book = book;
        this.daysLeft = daysLeft;
    }

    private Book book;
    private int daysLeft;
}
