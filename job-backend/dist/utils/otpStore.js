<<<<<<< HEAD
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOtp = exports.verifyOtp = exports.setOtp = void 0;
const store = {};
const OTP_TTL_MS = 5 * 60 * 1000;
const setOtp = (userId, identifier, code) => {
    store[userId] = {
        code,
        expiresAt: Date.now() + OTP_TTL_MS,
        identifier,
    };
};
exports.setOtp = setOtp;
const verifyOtp = (userId, identifier, code) => {
    const rec = store[userId];
    if (!rec)
        return false;
    if (rec.identifier !== identifier)
        return false;
    if (Date.now() > rec.expiresAt) {
        delete store[userId];
        return false;
    }
    const ok = rec.code === code;
    if (ok)
        delete store[userId];
    return ok;
};
exports.verifyOtp = verifyOtp;
const clearOtp = (userId) => {
    delete store[userId];
};
exports.clearOtp = clearOtp;
=======
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOtp = exports.verifyOtp = exports.setOtp = void 0;
const store = {};
const OTP_TTL_MS = 5 * 60 * 1000;
const setOtp = (userId, identifier, code) => {
    store[userId] = {
        code,
        expiresAt: Date.now() + OTP_TTL_MS,
        identifier,
    };
};
exports.setOtp = setOtp;
const verifyOtp = (userId, identifier, code) => {
    const rec = store[userId];
    if (!rec)
        return false;
    if (rec.identifier !== identifier)
        return false;
    if (Date.now() > rec.expiresAt) {
        delete store[userId];
        return false;
    }
    const ok = rec.code === code;
    if (ok)
        delete store[userId];
    return ok;
};
exports.verifyOtp = verifyOtp;
const clearOtp = (userId) => {
    delete store[userId];
};
exports.clearOtp = clearOtp;
>>>>>>> origin/job
