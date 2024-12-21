import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "user not authenticated",
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    }
    //decode vayapaxi token generate garda halay ko data milxa
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};
export default isAuthenticated;
