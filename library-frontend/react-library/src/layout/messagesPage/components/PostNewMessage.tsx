import { useState } from "react";

export const PostNewMessage = () => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">Post a New Message</div>
        <form className="card-body">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Question</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows={3}
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            ></textarea>
          </div>
          <div>
            <button type="submit" className="btn btn-primary mt-3">
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};