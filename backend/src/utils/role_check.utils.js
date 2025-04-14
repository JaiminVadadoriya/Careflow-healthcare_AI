// export const checkRole = (requiredRole) => {
//     return (req, res, next) => {
//       const token = req.headers['authorization']?.split(' ')[1];  // Bearer token
//       if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//       }
  
//       jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//           return res.status(403).json({ message: 'Invalid token' });
//         }
        
//         if (decoded.role !== requiredRole && decoded.role !== 'admin') {
//           return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
//         }
  
//         req.user = decoded;  // Save user information in the request object
//         next();
//       });
//     };
//   };
  