import express from "express";

import { verifyStudent, verifyToken } from "@/middlewares/authMiddleware.js";
import TutorScheduleModel from "@/models/TutorSchedule.js";
import PaymentTransaction from "@/models/payment/PaymentTransaction.js";

import { createPayment } from "@/controllers/paymentController.js";
import { getTutorProfile } from "@/controllers/profileController";
import User from "@/models/User";

const router = express.Router();

router.post("/create-payment", verifyToken, verifyStudent, createPayment);

router.get("/vnpay/return", async (req, res) => {
  const vnpResponse = req.query;

  const frontendUrl = process.env.FRONT_END_URL;
  const payment = await PaymentTransaction.findById(vnpResponse.vnp_TxnRef);
  const tutorSchedule = await TutorScheduleModel.findById(payment?.scheduleId);

  if (payment && tutorSchedule) {
    if (vnpResponse.vnp_ResponseCode === "00") {
      payment.status = "success";
      tutorSchedule.isBooked = true;
      tutorSchedule.student = payment.userId;
      await payment.save();
      await tutorSchedule.save();
      const tutor = await await User.findById(tutorSchedule.tutor);

      tutor!.accountBalance += payment.amount * 0.9;
      await tutor?.save();

      res.redirect(
        `${frontendUrl}/payment-confirmation?vnp_TxnRef=${vnpResponse.vnp_TxnRef}&vnp_TransactionNo=${vnpResponse.vnp_TransactionNo}&vnp_Amount=${vnpResponse.vnp_Amount}&vnp_BankCode=${vnpResponse.vnp_BankCode}`,
      );
    } else {
      payment.status = "failed";
      await payment.save();
      res.redirect(`${frontendUrl}/payment-failed`); //todo:hardcoded
    }
  } else {
    res.redirect(`${frontendUrl}/payment-failed`); //todo:hardcoded
  }
});

export default router;
