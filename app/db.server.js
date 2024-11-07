import mongoose from "mongoose";

const storeSchema = mongoose.Schema({
  shop: { type: String, default: "" },
  storeName: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" }, // GeoJSON type
    coordinates: { type: [Number], default: [0.0, 0.0] }, // [longitude, latitude]
  },
  wheelchairAccess: { type: Boolean, default: false },
  wifi: { type: Boolean, default: false },
  zipCode: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  storeType: { type: String, default: "" },
  membersClub: { type: Boolean, default: false },
});

storeSchema.index({ location: "2dsphere" });

if (!global.storeModel) {
  global.storeModel = new mongoose.model("mystores", storeSchema);
}

export const storeModel =
  global.storeModel || new mongoose.model("mystores", storeSchema);
