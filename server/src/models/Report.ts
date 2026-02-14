import mongoose, { Schema, model, type InferSchemaType, type Model } from 'mongoose';

const ReportSchema = new Schema(
  {
    fileName: { type: String, required: true },
    rowCount: { type: Number, required: true },
    columnCount: { type: Number, required: true },

    columns: { type: Schema.Types.Mixed, required: true },
    sampleRows: { type: Schema.Types.Mixed, required: true },
    profile: { type: Schema.Types.Mixed, required: true },

    insightsMd: { type: String, required: true },
    followups: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

export type ReportDoc = InferSchemaType<typeof ReportSchema>;

export const Report: Model<ReportDoc> =
  (mongoose.models.Report as Model<ReportDoc>) || model<ReportDoc>('Report', ReportSchema);
