import logo_panel from "./logo_panel.png";
import add_icon from "./add_icon.png";
import order_icon from "./order_icon.png";
import parcel_icon from "./parcel_icon.png"; 
import profile_image from "./profile_image.png";
import upload_area from "./upload_area.png"

const productionApiUrl =
  import.meta.env.VITE_API_URL;

const localApiUrl = import.meta.env.DEV
  ? "http://localhost:4000"
  : "";

export const url = (
  productionApiUrl || localApiUrl
).replace(/\/$/, "");

if (!url) {
  throw new Error(
    "VITE_API_URL is missing in the Admin Vercel project"
  );
}
export const currency = "$"

export const assets = {
    logo_panel,
    add_icon,
    order_icon,
    parcel_icon,
    profile_image,
    upload_area,
}