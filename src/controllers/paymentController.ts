import TutorScheduleModel from "@/models/TutorSchedule.js";
import User from "@/models/User.js";
import { Request, Response } from "express";
import { vnpay } from "../lib/vnpay.js";
import { dateFormat, ProductCode, VnpLocale } from "vnpay";
import { v4 as uuidv4 } from "uuid";
import PaymentTransaction from "@/models/payment/PaymentTransaction.js";

export const createPayment = async (req: Request, res: Response) => {
  try {
    //needs userid, tutorid, slotid, skill
    const tomorrow = new Date();
    const backendUrl = process.env.BACK_END_URL;
    console.log("body", req.body.scheduleId);
    const tutorSchedule = await TutorScheduleModel.findById(
      req.body.scheduleId,
    );
    const tutor = await User.findById(tutorSchedule?.tutor);
    // if (!tutor || !tutor.startTime || !tutor.endTime) {
    //   res.status(500).json({});
    // }

    if (!tutorSchedule || !tutor || !backendUrl) {
      throw new Error("Internal server error");
    }
    const duration =
      (tutorSchedule?.endTime.getTime() - tutorSchedule?.startTime.getTime()) /
      1000 /
      60 /
      60;
    console.log(duration);
    console.log(tutorSchedule);

    const amount = tutor?.hourlyRate * duration; //todo:hardcoded

    const newPayment = await PaymentTransaction.create({
      // your lesson data here...
      userId: req.user.userId,
      scheduleId: tutorSchedule?._id,
      amount: amount,
    });

    tomorrow.setDate(tomorrow.getDate() + 1);
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: "13.160.92.202",
      vnp_TxnRef: newPayment.id,
      vnp_OrderInfo: `Thanh toan don hang ${uuidv4()}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: `${backendUrl}/api/payment/vnpay/return`, //todo:hardcoded, change if deployed
      vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
      vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
      vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
    });

    // res.redirect(paymentUrl)
    res.status(201).json(paymentUrl);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
