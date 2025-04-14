const checkRole = (requiredRoles=[]) => {
    return (req, res, next) => {
      const { role } = req.user; // Role from the JWT token

      const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles].includes(role);
      if (!allowedRoles && role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
      }
      next();
    };
  };
  
  export default checkRole;
  