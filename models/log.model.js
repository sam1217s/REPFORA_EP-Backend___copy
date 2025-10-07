/**
 * @fileoverview Log Model for Productive Stages System Auditing
 * 
 * This model records all important system actions for:
 * - Complete audit trail of record changes
 * - Detailed user activity tracking  
 * - Early error and issue detection
 * - Traceability compliance requirements
 * - System behavior analysis
 * 
 */

/**
 * Schema for Log model of Productive Stages system
 * 
 * @typedef {Object} Log
 * @property {string} action - Action performed in the system
 * @property {string} affected_table - Name of the table/model that was modified
 * @property {string} [affected_record_id] - Specific ID of the modified record
 * @property {Object} [previous_data] - Data before change (for UPDATE/DELETE)
 * @property {Object} [new_data] - Data after change (for CREATE/UPDATE)
 * @property {string} [user] - Name of user who performed the action
 * @property {ObjectId} [user_id] - User ID (reference to User model)
 * @property {string} module - System module where action occurred
 * @property {string} level - Log importance level (INFO, WARNING, ERROR, CRITICAL)
 * @property {string} [description] - Additional description of the action
 * @property {Date} createdAt - Creation date and time (automatic)
 * @property {Date} updatedAt - Last modification date and time (automatic)
 */

/**
 * Available actions enumeration for the Productive Stages system
 * Includes general CRUD operations and specific actions for educational context
 * 
 * @readonly
 * @enum {string}
 */
const ACTIONS = {
    CREATE: 'CREATE',           // Create new record
    UPDATE: 'UPDATE',           // Update existing record
    DELETE: 'DELETE',           // Delete record
    LOGIN: 'LOGIN',             // User login to system
    LOGOUT: 'LOGOUT',           // User logout from system
    VIEW: 'VIEW',               // View/query data
    EXPORT: 'EXPORT',           // Export information to files
    IMPORT: 'IMPORT',           // Import information from files
    ASSIGN: 'ASSIGN',           // Assign (e.g: apprentice to company)
    APPROVE: 'APPROVE',         // Approve (e.g: project, tracking)
    REJECT: 'REJECT',           // Reject submissions or requests
    SUBMIT: 'SUBMIT',           // Submit/deliver (e.g: activity)
    ACTIVATE: 'ACTIVATE',       // Activate accounts or records
    DEACTIVATE: 'DEACTIVATE',   // Deactivate accounts or records
    RESET_PASSWORD: 'RESET_PASSWORD', // Password reset actions
    EVALUATE: 'EVALUATE',       // Evaluate/grade (e.g: activity)
    COMMENT: 'COMMENT',         // Add comments or observations
    BACKUP: 'BACKUP',           // Create system backup
    RESTORE: 'RESTORE',         // Restore from backup
    ERROR: 'ERROR'              // System errors and exceptions
};

/**
 * System modules enumeration for Productive Stages
 * Based on the database diagram and main functional areas
 * 
 * @readonly  
 * @enum {string}
 */
const MODULES = {
    APPRENTICES: 'APPRENTICES',         // Student/apprentice management
    INSTRUCTORS: 'INSTRUCTORS',         // Teacher/instructor management
    COMPANIES: 'COMPANIES',             // Companies where productive stages are performed
    PROJECTS: 'PROJECTS',               // Apprentice projects and project details
    ACTIVITIES: 'ACTIVITIES',           // Activities within projects
    TRACKINGS: 'TRACKINGS',             // Progress tracking records
    PS_MODALITIES: 'PS_MODALITIES',     // Productive stage modalities
    PARAMETERS: 'PARAMETERS',           // System configurations and parameters
    USERS: 'USERS',                     // User system and authentication
    REPORTS: 'REPORTS',                 // Report generation and management
    LOGS: 'LOGS',                       // Log system management
    SYSTEM: 'SYSTEM',                   // Internal system operations
    GENERAL: 'GENERAL'                  // General actions not specific to a module
};

/**
 * Log importance levels enumeration
 * Helps categorize logs by severity for filtering and monitoring
 * 
 * @readonly
 * @enum {string}
 */
const LEVELS = {
    INFO: 'INFO',           // General information and normal operations
    WARNING: 'WARNING',     // Warnings that don't break functionality
    ERROR: 'ERROR',         // Errors that affect specific operations
    CRITICAL: 'CRITICAL'    // Critical errors that affect system stability
};


import { Schema, model } from "mongoose";

const logSchema = new Schema(
    {
        action: {
            type: String,
            required: true,
            uppercase: true,
            enum: Object.values(ACTIONS)
        },
        affected_table: {
            type: String,
            required: true,
            uppercase: true
        },
        affected_record_id: {
            type: String,
            required: false
        },
        previous_data: {
            type: Object,
            required: false
        },
        new_data: {
            type: Object,
            required: false
        },
        user: {
            type: String,
            required: false,
            default: "SYSTEM"
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        module: {
            type: String,
            required: true,
            uppercase: true,
            default: 'SYSTEM',
            enum: Object.values(MODULES)
        },
        level: {
            type: String,
            required: true,
            uppercase: true,
            default: 'INFO',
            enum: Object.values(LEVELS)
        },
        description: {
            type: String,
            required: false
        },
        ip_address: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("ep_log", logSchema);

export { ACTIONS, MODULES, LEVELS };