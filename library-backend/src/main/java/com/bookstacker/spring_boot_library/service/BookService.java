package com.bookstacker.spring_boot_library.service;

import com.bookstacker.spring_boot_library.dao.BookRepository;
import com.bookstacker.spring_boot_library.dao.CheckoutRepository;
import com.bookstacker.spring_boot_library.dao.HistoryRepository;
import com.bookstacker.spring_boot_library.dao.PaymentRepository;
import com.bookstacker.spring_boot_library.entity.Book;
import com.bookstacker.spring_boot_library.entity.Checkout;
import com.bookstacker.spring_boot_library.entity.History;
import com.bookstacker.spring_boot_library.entity.Payment;
import com.bookstacker.spring_boot_library.responseModels.ShelfCurrentLoansResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;

    private final CheckoutRepository checkoutRepository;

    private final HistoryRepository historyRepository;

    private final PaymentRepository paymentRepository;

    @Autowired
    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository, HistoryRepository historyRepository, PaymentRepository paymentRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
        this.paymentRepository = paymentRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book doesn't exist or is already checked by the user!");
        }

        List<Checkout> currentBooksCheckout = checkoutRepository.findBooksByUserEmail(userEmail);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        boolean bookNeedsToBeReturned = false;

        for (Checkout checkout : currentBooksCheckout) {
            Date d1 = sdf.parse(checkout.getReturnDate());
            Date d2 = sdf.parse(LocalDate.now().toString());

            TimeUnit time = TimeUnit.DAYS;
            double diff = time.convert(d1.getTime() - d2.getTime(),
                    TimeUnit.MILLISECONDS);
            if (diff < 0) {
                bookNeedsToBeReturned = true;
                break;
            }
        }

        Payment userPayment = paymentRepository.findByUserEmail(userEmail);

        if ((userPayment != null && userPayment.getAmount() > 0) || (userPayment != null && bookNeedsToBeReturned)) {
            throw new Exception("You have an outstanding payment or book needs to be returned!");
        }

        if (userPayment == null) {
            Payment payment = new Payment();
            payment.setAmount(00.00);
            payment.setUserEmail(userEmail);
            paymentRepository.save(payment);
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId());
        checkoutRepository.save(checkout);
        return book.get();
    }

    public boolean checkoutBookByUser(String userEmail, Long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        return (validateCheckout != null);
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();
        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
        List<Long> bookIdList = new ArrayList<>();

        for(Checkout checkout : checkoutList) {
            bookIdList.add(checkout.getBookId());
        }

        List<Book> books = bookRepository.findAllByBookIds(bookIdList);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        for (Book book : books) {
            Optional<Checkout> checkout= checkoutList.stream()
                    .filter(x -> x.getBookId().equals(book.getId())).findFirst();
            if(checkout.isPresent()) {
                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());
                TimeUnit time = TimeUnit.DAYS;
                long diff = time.convert(d1.getTime() - d2.getTime(),
                        TimeUnit.MILLISECONDS);
                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) diff));
            }
        }
        return shelfCurrentLoansResponses;
    }

    public void returnBook (String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(!book.isPresent() || validateCheckout == null) {
            throw new Exception("Book doesn't exist or is not checked by the user!");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());
        TimeUnit time = TimeUnit.DAYS;

        double diff = time.convert(d1.getTime() - d2.getTime(),
                TimeUnit.MILLISECONDS);

        if (diff < 0) {
            Payment payment = paymentRepository.findByUserEmail(userEmail);

            payment.setAmount(payment.getAmount() + (diff * -1));
            paymentRepository.save(payment);
        }

        checkoutRepository.deleteById(validateCheckout.getId());

        History history = new History(
                userEmail,
                validateCheckout.getCheckoutDate(),
                LocalDate.now().toString(),
                book.get().getTitle(),
                book.get().getAuthor(),
                book.get().getDescription(),
                book.get().getImg()
        );
        historyRepository.save(history);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (validateCheckout == null) {
            throw new Exception("Book doesn't exist or is not checked by the user!");
        }

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date d1 = sdFormat.parse(validateCheckout.getReturnDate());
        Date d2 = sdFormat.parse(LocalDate.now().toString());

        if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }
    }
}
