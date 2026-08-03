import logo_panel from "./logo_panel.png";
import add_icon from "./add_icon.png";
import order_icon from "./order_icon.png";
import parcel_icon from "./parcel_icon.png"; 
import profile_image from "./profile_image.png";
import upload_area from "./upload_area.png"

export const url = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");
export const currency = "$"

export const assets = {
    logo_panel,
    add_icon,
    order_icon,
    parcel_icon,
    profile_image,
    upload_area,
}