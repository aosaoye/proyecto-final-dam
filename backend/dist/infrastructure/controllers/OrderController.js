"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const logPath = path.join(__dirname, '../../../order_debug.log');
const debugLog = (msg) => {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
};
class OrderController {
    orderUseCases;
    constructor(orderUseCases) {
        this.orderUseCases = orderUseCases;
    }
    async createOrder(req, res, next) {
        try {
            debugLog(`CREATE ORDER ATTEMPT for User: ${req.user?.id}`);
            const order = await this.orderUseCases.createOrderFromCart(req.user.id);
            debugLog(`CREATE SUCCESS! Order ID: ${order.id}`);
            res.status(201).json(order);
        }
        catch (error) {
            debugLog(`CREATE FAILED: ${error.message}`);
            next(error);
        }
    }
    async getAllOrders(req, res, next) {
        try {
            debugLog(`GET ALL ORDERS TRIGGERED by user ${req.user?.id}`);
            const orders = await this.orderUseCases.getAllOrders();
            debugLog(`FETCHED ${orders.length} orders from DB.`);
            res.json(orders);
        }
        catch (error) {
            debugLog(`FETCH ALL FAILED: ${error.message}`);
            next(error);
        }
    }
    async getMyOrders(req, res, next) {
        try {
            const orders = await this.orderUseCases.getUserOrders(req.user.id);
            res.json(orders);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
