import { HashAlgorithm, VNPay, ignoreLogger } from "vnpay";

export const vnpay = new VNPay({
  // Thông tin cấu hình bắt buộc
  tmnCode: "CSPXTHSV",
  secureSecret: "R7RA2LC2WBCY148ZPYKILMETME2LE4FT",
  vnpayHost: "https://sandbox.vnpayment.vn",

  // Cấu hình tùy chọn
  testMode: true, // Chế độ test
  hashAlgorithm: "SHA512" as HashAlgorithm, // Thuật toán mã hóa
  enableLog: true, // Bật/tắt ghi log
  // loggerFn: ignoreLogger, // Hàm xử lý log tùy chỉnh

  // Tùy chỉnh endpoints cho từng phương thức API (mới)
  // Hữu ích khi VNPay thay đổi endpoints trong tương lai
  // endpoints: {
  //   paymentEndpoint: "paymentv2/vpcpay.html", // Endpoint thanh toán
  //   queryDrRefundEndpoint: "merchant_webapi/api/transaction", // Endpoint tra cứu & hoàn tiền
  //   getBankListEndpoint: "qrpayauth/api/merchant/get_bank_list", // Endpoint lấy danh sách ngân hàng
  // },
});
