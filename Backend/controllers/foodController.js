import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";

// Đẩy buffer ảnh (từ multer memoryStorage) lên Cloudinary.
// Trả về { secure_url, public_id } khi thành công.
const uploadImageToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "12h-food-delivery" },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const addFood = async (req, res) => {
  console.log("BODY =", req.body);
  console.log("BODY KEYS =", Object.keys(req.body));
  console.log("FILE =", req.file);

  try {
  const name = req.body.name || req.body["name "];
  const description = req.body.description || req.body["description "];
  const price = req.body.price || req.body["price "];
  const category = req.body.category || req.body["category "];

  if (!name) return res.json({ success: false, message: "Missing name" });
  if (!description) return res.json({ success: false, message: "Missing description" });
  if (!price) return res.json({ success: false, message: "Missing price" });
  if (!category) return res.json({ success: false, message: "Missing category" });
  if (!req.file) return res.json({ success: false, message: "Missing image" });

  const uploadResult = await uploadImageToCloudinary(req.file.buffer);

  const food = new foodModel({
    name,
    description,
    price: Number(price),
    category,
    image: uploadResult.secure_url,
    imageId: uploadResult.public_id
  });

  await food.save();
  res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//all food list
const listFood = async (req,res) => {
  try {
    const foods = await foodModel.find({});
    res.json({success:true,data:foods})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

//remove food item
const removeFood = async (req, res) => {
  try {
    console.log("HEADERS:", req.headers["content-type"]);
    console.log("REMOVE BODY:", req.body);

    let id;

    // Case 1: Postman send correct JSON
    if (req.body && typeof req.body === "object") {
      id = req.body.id;
    }

    // Case 2: Postman send text/plain but the content is JSON string
    if (!id && typeof req.body === "string") {
      try {
        const parsedBody = JSON.parse(req.body);
        id = parsedBody.id;
      } catch (error) {
        return res.json({
          success: false,
          message: "Invalid JSON body"
        });
      }
    }

    if (!id) {
      return res.json({
        success: false,
        message: "Missing food id"
      });
    }

    const food = await foodModel.findById(id);

    if (!food) {
      return res.json({
        success: false,
        message: "Food not found"
      });
    }

    if (food.imageId) {
      try {
        await cloudinary.uploader.destroy(food.imageId);
      } catch (imageError) {
        console.log("Image delete error:", imageError.message);
      }
    }

    await foodModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Food Removed"
    });

  } catch (error) {
    console.log("REMOVE ERROR:", error);
    res.json({
      success: false,
      message: error.message
    });
  }
};


export { addFood,listFood,removeFood };