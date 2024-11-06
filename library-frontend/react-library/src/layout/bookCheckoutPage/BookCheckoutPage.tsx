import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { StarsReview } from "../utils/StarsReview";
import { CheckoutAndReview } from "./CheckoutAndReview";
import ReviewModel from "../../models/ReviewModel";
import { LatestReview } from "./LatestReview";
import { useOktaAuth } from "@okta/okta-react";

export const BookCheckoutPage = () => {

  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  // Loans Count State
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);


  // Is book checked out?
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

        const response = await fetch(baseUrl);

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const responseJson = await response.json();
        const loadedBook: BookModel = {
          id: responseJson.id,
          title: responseJson.title,
          author: responseJson.author,
          description: responseJson.description,
          copies: responseJson.copies,
          copiesAvailable: responseJson.copiesAvailable,
          category: responseJson.category,
          img: responseJson.img,
        };

        setBook(loadedBook);
        setIsLoading(false);
      };

       fetchBook().catch((error: any) => {
        setIsLoading(false);
        setHttpError(error.message);
      })
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

        const responseReviews = await fetch(reviewUrl);

        if (!responseReviews.ok) {
          throw new Error("Something went wrong!");
        }

        const responseJsonReviews = await responseReviews.json();
        const responseData = responseJsonReviews._embedded.reviews;
        const loadedReviews: ReviewModel[] = [];
        let totalRating = 0;

        for (const review of responseData) {
          loadedReviews.push({
            id: review.id,
            userEmail: review.userEmail,
            date: review.date,
            rating: review.rating,
            bookId: review.bookId,
            reviewDescription: review.reviewDescription,
          });

          totalRating += review.rating;
        }

        setReviews(loadedReviews);

        if (loadedReviews.length > 0) {
          const averageRating = totalRating / loadedReviews.length;
          const roundedRating = Math.round(averageRating * 2) / 2; 
          setTotalStars(roundedRating);
        } else {
          setTotalStars(0); 
        }
    };
        setIsLoadingReview(false);
       fetchBookReviews().catch((error: any) =>{
        setIsLoadingReview(false);
        setHttpError(error.message);
      })
    fetchBookReviews();
  }, [bookId]);

  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
        if (authState && authState.isAuthenticated) {
          const url = `http://localhost:8080/api/books/secure/currentloans/count`;
          const requestOptions = {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authState.accessToken?.accessToken}`,
              'Content-Type': 'application/json'
            }
          };
          const currentLoansCountResponse = await fetch(url, requestOptions);
          if(!currentLoansCountResponse.ok) {
            throw new Error('Something went wrong!');
          }
          const currentLoansCountResponseJson = await currentLoansCountResponse.json();
          setCurrentLoansCount(currentLoansCountResponseJson);
        }
        setIsLoadingCurrentLoansCount(false);
      }
    fetchUserCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    })
  }, [authState, isCheckedOut]);


  useEffect(() => {
    const fetchUserChechedOutBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json'
          }
        };
        const bookCheckedOut = await fetch(url, requestOptions);

        if (!bookCheckedOut.ok) {
          throw new Error('Something went wrong');
        }

        const bookCheckedOutResponseJson = await bookCheckedOut.json();
        setIsCheckedOut(bookCheckedOutResponseJson);
      }
      setIsLoadingBookCheckedOut(false);
    }
    fetchUserChechedOutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    })
  }, [authState]);


  if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut) {
    return (
      <div className="container m-5">
        <SpinnerLoading />
      </div>
    );
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }


  async function checkoutBook(){
    const url = `http://localhost:8080/api/books/secure/checkout?bookId=${book?.id}`;
    const requestOptions = {
      method: 'PUT', 
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    const checkoutResponse = await fetch(url, requestOptions);
    if(!checkoutResponse.ok) {
      throw new Error('Something went wrong!');
    }
    setIsCheckedOut(true);
  }

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width="226" height="349" alt="Book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReview book={book} mobile={false} currentLoansCount={currentLoansCount} 
          isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}/>
        </div>
        <hr />
        <LatestReview reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book?.img} width="226" height="349" alt="Book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReview book={book} mobile={true} currentLoansCount={currentLoansCount} 
        isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}/>
        <hr />
        <LatestReview reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
