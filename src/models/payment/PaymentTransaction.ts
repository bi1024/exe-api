import mongoose, { Document, Schema } from "mongoose";

// Define a TypeScript interface for the transaction document
export interface IPaymentTransaction extends Document {
  // vnp_TxnRef: string;
  userId: mongoose.Types.ObjectId;
  // tutorId?: mongoose.Types.ObjectId;
  scheduleId?: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "success" | "failed";
  vnp_ResponseCode?: string;
  vnp_TransactionNo?: string;
  // vnp_PayDate?: string;
  // rawReturnQuery?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const paymentTransactionSchema = new Schema<IPaymentTransaction>(
  {
    // vnp_TxnRef: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // tutorId: { type: Schema.Types.ObjectId, ref: "User" },
    scheduleId: { type: Schema.Types.ObjectId, ref: "TutorSchedule" },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    vnp_ResponseCode: { type: String },
    vnp_TransactionNo: { type: String },
    // vnp_PayDate: { type: String },
    // rawReturnQuery: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

// Export the model
const PaymentTransaction = mongoose.model<IPaymentTransaction>(
  "PaymentTransaction",
  paymentTransactionSchema,
);

export default PaymentTransaction;
