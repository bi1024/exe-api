import express from "express";
import { vnpay } from "../lib/vnpay.js";
import { dateFormat, ProductCode, VnpLocale } from "vnpay";

const router = express.Router();

router.post("/create-payment", async (req, res) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: 10000,
    vnp_IpAddr: "13.160.92.202",
    vnp_TxnRef: "123456",
    vnp_OrderInfo: "Thanh toan don hang 123456",
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: "http://localhost:3000/vnpay-return",
    vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
    vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
    vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
  });
  res.status(201).json(paymentUrl);
});

export default router;
