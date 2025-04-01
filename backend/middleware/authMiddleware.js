import jwt from "jsonwebtoken";

// Leer cookies 
const checkAuth = (req, res, next) => {
  const token = req.cookies.access_token; // Acceder a la cookie
  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar el usuario decodificado al objeto req
    next(); // Pasar al siguiente middleware o controlador
  } catch (error) {
    res.status(401).json({ message: "Token inválido", error });
  }
};

export default checkAuth;