import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

export const validateUserInput = async (req: Request, res: Response, next: NextFunction) => {
  // Cuando se utiliza la validación de express-validator de forma separada, fuera del router, se debe utilizar
  // el método run() para ejecutar la validación.
  // Además, la función debe ser asíncrona y utilizar el await.
  await body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .run(req);

  await body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .run(req);

    const emailErrors = validationResult(req);
    if (!emailErrors.isEmpty()) {
      res.status(400).json({ errors: emailErrors.array() });
      return;
    }
    next();
};

