"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./infrastructure/routes/auth.routes"));
const product_routes_1 = __importDefault(require("./infrastructure/routes/product.routes"));
const cart_routes_1 = __importDefault(require("./infrastructure/routes/cart.routes"));
const order_routes_1 = __importDefault(require("./infrastructure/routes/order.routes"));
const error_middleware_1 = require("./infrastructure/middleware/error.middleware");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: '*', // In production, you'd restrict this to your specific domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Required for browsers to load images across origins
}));
app.use(express_1.default.json());
// Serve uploads statically
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'UP' });
});
// Global Error Handler (Must be registered LAST)
app.use(error_middleware_1.globalErrorHandler);
exports.default = app;
