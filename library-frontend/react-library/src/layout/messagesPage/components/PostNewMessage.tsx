import { useState } from "react";
import { useOktaAuth } from "@okta/okta-react";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = () => {
  const { authState } = useOktaAuth();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitNewQuestion() {
    if (!authState?.isAuthenticated || title === "" || question === "") {
      setDisplayWarning(true);
      setDisplaySuccess(false);
      return;
    }

    setDisplayWarning(false);
    setIsSubmitting(true);

    try {
      const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
      const messageRequestModel: MessageModel = new MessageModel(title, question);

      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageRequestModel),
      };

      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to post the question. Please try again later.");
      }

      setTitle("");
      setQuestion("");
      setDisplaySuccess(true);
    } catch (error: any) {
      console.error("Error posting question:", error);
      setDisplayWarning(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card mt-3">
      <div className="card-header">Ask Question to BookStacker Admin</div>
      <div className="card-body">
        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            submitNewQuestion();
          }}
        >
          {displayWarning && (
            <div className="alert alert-danger" role="alert">
              Please fill out all fields or try again later.
            </div>
          )}
          {displaySuccess && (
            <div className="alert alert-success" role="alert">
              Question posted successfully!
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="titleInput" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="titleInput"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="questionTextarea" className="form-label">
              Question
            </label>
            <textarea
              className="form-control"
              id="questionTextarea"
              rows={3}
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Question"}
          </button>
        </form>
      </div>
    </div>
  );
};
