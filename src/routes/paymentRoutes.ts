import express from "express";
import { vnpay } from "../lib/vnpay.js";
import { dateFormat, ProductCode, VnpLocale } from "vnpay";
import { v4 as uuidv4 } from "uuid";
import { verifyStudent, verifyToken } from "@/middlewares/authMiddleware.js";
import TutorScheduleModel from "@/models/TutorSchedule.js";
import LessonModel from "@/models/Lesson.js";
import PaymentTransaction from "@/models/payment/PaymentTransaction.js";

const router = express.Router();

router.post("/create-payment", verifyToken, verifyStudent, async (req, res) => {
  console.log(req.user);
  console.log(req.body);
  //needs userid, tutorid, slotid, skill
  const tomorrow = new Date();
  console.log("body", req.body.scheduleId);
  const tutorSchedule = await TutorScheduleModel.findById(req.body.scheduleId);
  console.log(tutorSchedule);

  const amount = 10000; //todo:hardcoded

  const newPayment = await PaymentTransaction.create({
    // your lesson data here...
    userId: req.user.userId,
    scheduleId: tutorSchedule?._id,
    amount: amount,
  });

  tomorrow.setDate(tomorrow.getDate() + 1);
  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: amount, //todo: hardcoded, change later
    vnp_IpAddr: "13.160.92.202",
    vnp_TxnRef: newPayment.id,
    vnp_OrderInfo: `Thanh toan don hang ${uuidv4()}`,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: "http://localhost:3000/api/payment/vnpay/return", //todo:hardcoded, change if deployed
    vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
    vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
    vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
  });

  // res.redirect(paymentUrl)
  res.status(201).json(paymentUrl);
});

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
