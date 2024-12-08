import React from "react";
import "./App.css";
import { Navbar } from "./layout/navbar/Navbar";
import { Footer } from "./layout/footer/Footer";
import { Homepage } from "./layout/homepage/Homepage";
import { SearchBooksPage } from "./layout/searchBooksPage/SearchBooksPage";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { BookCheckoutPage } from "./layout/bookCheckoutPage/BookCheckoutPage";
import { OktaConfig } from "./lib/OktaConfig";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { LoginCallback, SecureRoute, Security } from "@okta/okta-react";
import LoginWidget from "./auth/LoginWidget";
import { ReviewListPage } from "./layout/bookCheckoutPage/reviewListPage/ReviewListPage";
import { ShelfPage } from "./layout/shelfPage/ShelfPage";
import { MessagesPage } from "./layout/messagesPage/MessagesPage";
import { ManageLibraryPage } from "./layout/manageLibraryPage/ManageLibraryPage";
import { PaymentPage } from "./layout/paymentPage/PaymentPage";

const oktaAuth = new OktaAuth(OktaConfig);

export const App = () => {
  const customAuthHandler = () => {
    history.push("/login");
  };

  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Security
        oktaAuth={oktaAuth}
        restoreOriginalUri={restoreOriginalUri}
        onAuthRequired={customAuthHandler}
      >
        <Navbar />
        <div className="flex-grow-1">
          <Switch>
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>
            <Route path="/home">
              <Homepage />
            </Route>
            <Route path="/search">
              <SearchBooksPage />
            </Route>
            <Route path='/reviewlist/:bookId'>
                <ReviewListPage />
            </Route>
            <Route path="/checkout/:bookId">
              <BookCheckoutPage />
            </Route>
            <Route
              path="/login"
              render={() => <LoginWidget config={OktaConfig} />} 
            />
            <Route path="/login/callback" component={LoginCallback} />
            <SecureRoute path='/shelf' component={ShelfPage} />
            <SecureRoute path="/messages"> <MessagesPage /> </SecureRoute>
            <SecureRoute path="/admin"> <ManageLibraryPage /> </SecureRoute>
            <SecureRoute path="/fees"> <PaymentPage /> </SecureRoute>
          </Switch>
        </div>
        <Footer />
      </Security>
    </div>
  );
};
