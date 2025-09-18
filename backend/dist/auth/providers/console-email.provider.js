"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleEmailProvider = void 0;
const common_1 = require("@nestjs/common");
let ConsoleEmailProvider = class ConsoleEmailProvider {
    async sendEmail(options) {
        console.log('📧 EMAIL WOULD BE SENT:', {
            to: options.to,
            subject: options.subject,
            hasHtml: !!options.html,
            hasText: !!options.text,
        });
        if (options.text) {
            console.log('📄 TEXT CONTENT:', options.text);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
};
exports.ConsoleEmailProvider = ConsoleEmailProvider;
exports.ConsoleEmailProvider = ConsoleEmailProvider = __decorate([
    (0, common_1.Injectable)()
], ConsoleEmailProvider);
//# sourceMappingURL=console-email.provider.js.map