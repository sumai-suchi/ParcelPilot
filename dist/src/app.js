import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import httpStatus from "http-status";
import { AuthRoutes } from "./app/module/auth/auth.router";
import { OperationsManagerRoutes } from "./app/module/operationsManager/operationsManager.router";
import { UserRoutes } from "./app/module/user/user.router";
// Enable BigInt serialization in JSON (res.json, JSON.stringify)
BigInt.prototype.toJSON = function () {
    return this.toString();
};
const app = express();
app.use(cors({
    // origin: config.frontend_url,
    credentials: true,
}));
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/operations", OperationsManagerRoutes);
app.use("/api/v1/operations-manager", OperationsManagerRoutes);
app.get("/", async (_req, res) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: "Welcome to ParcelPilot",
    });
});
// app.use(globalErrorHandler);
// app.use(notFound);
export default app;
