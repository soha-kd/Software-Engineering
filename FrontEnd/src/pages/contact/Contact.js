import React, { useState } from "react";
import Card from "../../components/card/Card";
import "./Contact.scss";
import { FaPhoneAlt, FaEnvelope, FaTwitter } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "../../services/authService";

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const data = {
    subject,
    message,
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/contactus`, data);
      setSubject("");
      setMessage("");
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="contact">
      <h3 className="--mt">ارتباط با ما</h3>
      <div className="section">
        <form onSubmit={sendEmail}>
          <Card cardClass="card">
            <label>عنوان</label>
            <input
              type="text"
              name="subject"
              placeholder="عنوان"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <label>پیام</label>
            <textarea
              cols="30"
              rows="10"
              name="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button className="--btn --btn-primary">ارسال پیام</button>
          </Card>
        </form>

        <div className="details">
          <Card cardClass={"card2"}>
            <h3>اطلاعات ارتباطی ما</h3>
            <p>با ما از طریق فرم یا راه های ارتباطی زیر در ارتباط باشید</p>

            <div className="icons">
              <span>
                <FaPhoneAlt />
                <p>0911111111</p>
              </span>
              <span>
                <FaEnvelope />
                <p>Support@se.com</p>
              </span>
              <span>
                <GoLocation />
                <p>مازندران بابل</p>
              </span>
              <span>
                <FaTwitter />
                <p>@se_proj</p>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
