import express from "express";
import { vnpay } from "../lib/vnpay.js";
import { dateFormat, ProductCode, VnpLocale } from "vnpay";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/create-payment", async (req, res) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  console.log(req.body);
  console.log(uuidv4());
  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Amount: 10000, //todo: hardcoded, change later
    vnp_IpAddr: "13.160.92.202",
    vnp_TxnRef: uuidv4(),
    vnp_OrderInfo: `Thanh toan don hang ${uuidv4()}`,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: "http://localhost:5173/", //todo:hardcoded, change if deployed
    vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
    vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
    vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
  
  });

  // res.redirect(paymentUrl)
  res.status(201).json(paymentUrl);
});

export default router;
