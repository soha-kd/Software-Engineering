import React, { useState } from "react";
import styles from "./auth.module.scss";
import { AiOutlineMail } from "react-icons/ai";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
import { forgotPassword, validateEmail } from "../../services/authService";
import { toast } from "react-toastify";

const Forgot = () => {
  const [email, setEmail] = useState("");

  const forgot = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("لطف ایمیل خود را وارد نمایید");
    }

    if (!validateEmail(email)) {
      return toast.error("لطفا یک ایمیل معتبر وارد نمایید");
    }

    const userData = {
      email,
    };

    await forgotPassword(userData);
    setEmail("");
  };

  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <AiOutlineMail size={35} color="#999" />
          </div>
          <h2>فراموشی رمز عبور</h2>

          <form onSubmit={forgot}>
            <input
              type="email"
              placeholder="ایمیل"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" className="--btn --btn-primary --btn-block">
              دریافت ایمیل
            </button>
            <div className={styles.links}>
              <p>
                <Link to="/"> صفحه اصلی -</Link>
              </p>
              <p>
                <Link to="/login">ورود -</Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Forgot;
