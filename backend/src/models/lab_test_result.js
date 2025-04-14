import mongoose from 'mongoose';

const LabTestResultSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    // technician: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'LabTechnician',
    //   required: true,
    // },
    test_type: {
      type: String,
      required: true,
      enum: [
        'blood test',
        'urine test',
        'x-ray',
        'mri',
        'ct scan',
        'biopsy',
        'covid test',
      ],
    },
    test_date: {
      type: Date,
      default: Date.now,
    },
    result_summary: {
      type: String,
      required: true,
    },
    report_file_url: {
      type: String, // e.g., uploaded PDF or image
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'reviewed'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('LabTestResult', LabTestResultSchema);
