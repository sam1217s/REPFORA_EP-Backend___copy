/**
 * @fileoverview Parameter Model for Dynamic System Configuration
 * 
 * This model provides a flexible system for storing and managing
 * application parameters without code changes or server restarts.
 * Supports multiple data types and organized categorization.
 * 
 * Features:
 * - Multi-type value storage (string, numeric, boolean, date)
 * - Category-based organization for better management
 * - Dynamic enable/disable functionality via status
 * - Complete audit trail with timestamps
 * - Flexible parameter management for business rules
 * 
 */

/**
 * Schema for Parameter model of REPFORA EP system
 * 
 * @typedef {Object} Parameter
 * @property {string} name - Unique parameter identifier (automatically uppercased)
 * @property {*} value - Parameter value (can be any type: string, number, boolean, date, object)
 * @property {string} type - Data type of the stored value for validation and UI rendering
 * @property {string} description - Human-readable parameter description
 * @property {string} category - Functional category for parameter organization
 * @property {number} status - Parameter status (0=inactive, 1=active, 2=deprecated)
 * @property {Date} createdAt - Creation timestamp (automatic)
 * @property {Date} updatedAt - Last modification timestamp (automatic)
 */

/**
 * Available parameter types enumeration
 * Defines what type of value is stored in the parameter
 * Used for validation and proper UI component rendering
 * 
 * @readonly
 * @enum {string}
 */
const TYPES = {
    STRING: 'STRING',       // Text values - stored as string in value field
    NUMBER: 'NUMBER',       // Numeric values - stored as number in value field
    BOOLEAN: 'BOOLEAN',     // True/false values - stored as boolean in value field
    DATE: 'DATE'            // Date values - stored as Date object in value field
}

/**
 * Parameter categories enumeration
 * Organizes parameters by functional area for better management
 * Used for grouping related parameters in administrative interfaces
 * 
 * @readonly
 * @enum {string}
 */
const CATEGORIES = {
    SYSTEM: 'SYSTEM',           // General system settings and configuration
    ACADEMIC: 'ACADEMIC',       // Academic year, terms, grading, and educational settings
    EMAIL: 'EMAIL',             // Email server configuration and notification templates
    LOGBOOK: 'LOGBOOK',         // Logbook entries, validation rules, and tracking settings
    SECURITY: 'SECURITY',       // Security policies, session management, and authentication
    FILES: 'FILES'              // File upload, storage limits, and document management
}


import { Schema, model } from "mongoose";

const parameterSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    value: {
        type: Schema.Types.Mixed,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(TYPES),
        required: true,
        uppercase: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: Object.values(CATEGORIES),
        required: true,
        uppercase: true
    },
    status: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
});


export default model("ep_parameter", parameterSchema);

export {TYPES, CATEGORIES};