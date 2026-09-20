import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import httpStatus from "http-status";
import { AuthRoutes } from "./app/module/auth/auth.router";

// Enable BigInt serialization in JSON (res.json, JSON.stringify)
(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};

const app: Application = express();

app.use(
	cors({
		// origin: config.frontend_url,
		credentials: true,
	}),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRoutes);

app.get("/", async (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to ParcelPilot",
	});
});

// app.use(globalErrorHandler);
// app.use(notFound);

export default app;
