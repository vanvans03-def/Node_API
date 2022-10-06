const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegisterSchema = new Schema({
    first_name: { type: String, default: '', required: true },
    last_name: { type: String, default: '', required: true },
    email: { type: String, unique: true, required: true, index: true },
    email_verified: { type: Boolean, default: false },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    password: { type: String, required: true },
    password_reset_token: { type: String, default: null },
    active: { type: Boolean, default: true },
    account_type: { type: String, enum: ['single', 'organization'], default: 'single' },
    organization: { type: Schema.Types.Mixed, default: {} },
    billing_address: { type: String, default: '' },
    shipping_address: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    permission: [
        {
            type: { type: Schema.Types.ObjectId, ref: 'permissionType', required: true },
            read: { type: Boolean, default: false, required: true },
            write: { type: Boolean, default: false, required: true },
            delete: { type: Boolean, default: false, required: true },
        }
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }

});

const Register = mongoose.model('register', RegisterSchema);

module.exports = Register;