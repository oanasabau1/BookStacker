import { useEffect, useRef } from "react";
import OktaSignIn from "@okta/okta-signin-widget";
import '@okta/okta-signin-widget/css/okta-sign-in.min.css'; // Corrected path
import { OktaConfig } from "../lib/OktaConfig";

const OktaSignInWidget = ({ onSuccess, onError }) => {
  const widgetRef = useRef();

  useEffect(() => {
    if (!widgetRef.current) {
      return;
    }

    const widget = new OktaSignIn(OktaConfig);

    widget
      .showSignInToGetTokens({
        el: widgetRef.current,
      })
      .then(onSuccess)
      .catch(onError);

    return () => widget.remove();
  }, [onSuccess, onError]);

  return (
    <div className="container mt-5 mb-5">
      <div ref={widgetRef}></div>
    </div>
  );
};

export default OktaSignInWidget;