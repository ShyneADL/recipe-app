// AuthComponent.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.modules.css";
import Loading from "../loading";

export default function AuthComponent() {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
    setError("");
  };

  if (isLoading) {
    return <Loading />;
  }

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
            {error && <div className="error-message">{error}</div>}
            <form className="forms_form">
              <fieldset className="forms_fieldset">
                <div className="forms_field">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="forms_field-input"
                    required
                    autoFocus
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="forms_field">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="forms_field-input"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
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
              <div className="forms_social">
                <button type="button" className="forms_buttons-google">
                  <img src="/google.svg" alt="Google" className="google-icon" />
                  Sign in with Google
                </button>
              </div>
            </form>
          </div>

          <div className="user_forms-signup">
            <h2 className="forms_title">Sign Up</h2>
            {error && <div className="error-message">{error}</div>}
            <form className="forms_form">
              <fieldset className="forms_fieldset">
                <div className="forms_field">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="forms_field-input"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="forms_field">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="forms_field-input"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="forms_field">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="forms_field-input"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
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
              <div className="forms_social">
                <button type="button" className="forms_buttons-google">
                  <img src="/google.svg" alt="Google" className="google-icon" />
                  Sign up with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
