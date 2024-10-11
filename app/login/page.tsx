// AuthComponent.tsx
"use client";
import { useState } from "react";
import "./login.modules.css";

export default function AuthComponent() {
  const [isLoginActive, setIsLoginActive] = useState(true);

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
  };

  return (
    <section className="user">
      <div className="user_options-container">
        <div className="user_options-text">
          <div className="user_options-unregistered">
            <h2 className="user_unregistered-title">Don't have an account?</h2>
            <p className="user_unregistered-text">
              Join us at KetoHub to and have access to 400+ recipes to kickstart
              your ketogenic diet.
            </p>
            <button className="user_unregistered-signup" onClick={toggleForm}>
              Sign up
            </button>
          </div>

          <div className="user_options-registered">
            <h2 className="user_registered-title">Have an account?</h2>
            <p className="user_registered-text">
              Welcome back friend, let's get you back into your account :).
            </p>
            <button className="user_registered-login" onClick={toggleForm}>
              Login
            </button>
          </div>
        </div>

        <div
          className={`user_options-forms ${
            isLoginActive ? "bounceRight" : "bounceLeft"
          }`}
        >
          <div className="user_forms-login">
            <h2 className="forms_title">Login</h2>
            <form className="forms_form" onSubmit={(e) => e.preventDefault()}>
              <fieldset className="forms_fieldset">
                <div className="forms_field">
                  <input
                    type="email"
                    placeholder="Email"
                    className="forms_field-input"
                    required
                    autoFocus
                  />
                </div>
                <div className="forms_field">
                  <input
                    type="password"
                    placeholder="Password"
                    className="forms_field-input"
                    required
                  />
                </div>
              </fieldset>
              <div className="forms_buttons">
                <button type="button" className="forms_buttons-forgot">
                  Forgot password?
                </button>
                <input
                  type="submit"
                  value="Log In"
                  className="forms_buttons-action"
                />
              </div>
            </form>
          </div>

          <div className="user_forms-signup">
            <h2 className="forms_title">Sign Up</h2>
            <form className="forms_form" onSubmit={(e) => e.preventDefault()}>
              <fieldset className="forms_fieldset">
                <div className="forms_field">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="forms_field-input"
                    required
                  />
                </div>
                <div className="forms_field">
                  <input
                    type="email"
                    placeholder="Email"
                    className="forms_field-input"
                    required
                  />
                </div>
                <div className="forms_field">
                  <input
                    type="password"
                    placeholder="Password"
                    className="forms_field-input"
                    required
                  />
                </div>
              </fieldset>
              <div className="forms_buttons">
                <input
                  type="submit"
                  value="Sign up"
                  className="forms_buttons-action"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
