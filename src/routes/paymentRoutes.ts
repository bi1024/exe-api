import express from "express";
import { vnpay } from "../lib/vnpay.js";
import { dateFormat, ProductCode, VnpLocale } from "vnpay";
import { v4 as uuidv4 } from "uuid";
import { verifyStudent, verifyToken } from "@/middlewares/authMiddleware.js";
import TutorScheduleModel from "@/models/TutorSchedule.js";
import PaymentTransaction from "@/models/payment/PaymentTransaction.js";
import User from "@/models/User.js";
import { createPayment } from "@/controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment", verifyToken, verifyStudent, createPayment);

router.get("/vnpay/return", async (req, res) => {
  const vnpResponse = req.query;

  console.log(vnpResponse);
  const payment = await PaymentTransaction.findById(vnpResponse.vnp_TxnRef);
  const tutorSchedule = await TutorScheduleModel.findById(payment?.scheduleId);

  if (payment && tutorSchedule) {
    if (vnpResponse.vnp_ResponseCode === "00") {
      payment.status = "success";
      tutorSchedule.isBooked = true;
      tutorSchedule.student = payment.userId;
      await payment.save();
      await tutorSchedule.save();
      res.redirect(
        `http://localhost:5173/payment-confirmation?vnp_TxnRef=${vnpResponse.vnp_TxnRef}&vnp_TransactionNo=${vnpResponse.vnp_TransactionNo}&vnp_Amount=${vnpResponse.vnp_Amount}&vnp_BankCode=${vnpResponse.vnp_BankCode}`,
      );
    } else {
      payment.status = "failed";

      await payment.save();
      res.redirect(`http://localhost:5173/payment-failed`); //todo:hardcoded
    }
  } else {
    res.redirect(`http://localhost:5173/payment-failed`); //todo:hardcoded
  }
});

export default router;
