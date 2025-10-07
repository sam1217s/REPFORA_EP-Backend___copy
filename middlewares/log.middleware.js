/**
 * @fileoverview Main logging middleware for Productive Stages System
 * 
 * This middleware handles all logging operations with automatic user detection,
 * IP extraction, and robust error handling. Designed to work seamlessly with
 * the Log schema and provide comprehensive audit trails.
 * 
 * Features:
 * - Automatic JWT token processing
 * - IP address extraction from Express requests
 * - Schema validation before saving
 * - Non-blocking asynchronous operations
 * - Detailed error logging without breaking app flow
 */

/**
 * Complete log data structure matching the Log schema
 * @typedef {Object} LogData
 * @property {string} action - Action performed (required) - Must match ACTIONS enum
 * @property {string} affected_table - Table/model affected (required)
 * @property {string} module - System module (required) - Must match MODULES enum
 * @property {string} [affected_record_id] - Specific record ID (optional)
 * @property {Object} [previous_data] - Data before change (for UPDATE/DELETE)
 * @property {Object} [new_data] - Data after change (for CREATE/UPDATE)
 * @property {string} [level] - Log level (optional) - Must match LEVELS enum, defaults to 'INFO'
 * @property {string} [description] - Additional description (optional)
 */

/**
 * Express request object structure
 * @typedef {Object} ExpressRequest
 * @property {Object} headers - Request headers
 * @property {string} [headers.token] - JWT authentication token
 * @property {string} [ip] - Client IP address (Express automatically sets this)
 * @property {Object} [connection] - Connection information
 * @property {string} [connection.remoteAddress] - Remote IP address
 * @property {Function} get - Method to get header values
 */

import logModels from "../models/log.model.js";
import userModels from "../models/user.model.js";
import jwt from "jsonwebtoken";


/**
 * Extracts and validates user ID from JWT token
 * @param {string} token - JWT token string
 * @returns {string|null} Valid user ID or null if token is invalid/missing
 */
function extractUserIdFromToken(token) {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithm: "HS256"
    });
    
    if (!decoded || !decoded.id) {
      console.warn('JWT token decoded but missing user ID');
      return null;
    }
    
    return decoded.id;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.warn('JWT token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      console.warn('Invalid JWT token format');
    } else {
      console.error('Unexpected error decoding JWT token:', error.message);
    }
    return null;
  }
}

/**
 * Extracts client IP address from Express request with fallback options
 * @param {ExpressRequest} req - Express request object
 * @returns {string} Client IP address or "UNKNOWN" if not found
 */
function extractClientIP(req) {
  if (!req) {
    return "UNKNOWN";
  }
  
  // Try multiple sources for IP address in order of preference
  const ip = req.ip || 
             req.connection?.remoteAddress || 
             req.socket?.remoteAddress ||
             req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
             req.headers['x-real-ip'] ||
             "UNKNOWN";
             
  return ip === '::1' ? '127.0.0.1' : ip;
}

/**
 * Validates log data against schema requirements
 * @param {LogData} logData - Log data to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
function validateLogData(logData) {
  const errors = [];
  
  if (!logData) {
    errors.push('Log data is required');
    return { isValid: false, errors };
  }
  
  if (!logData.action || typeof logData.action !== 'string') {
    errors.push('action is required and must be a string');
  }
  
  if (!logData.affected_table || typeof logData.affected_table !== 'string') {
    errors.push('affected_table is required and must be a string');
  }
  
  if (!logData.module || typeof logData.module !== 'string') {
    errors.push('module is required and must be a string');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Main logging function - Records system actions with complete audit trail
 * @param {LogData} logData - Complete log information
 * @param {string} [token] - JWT token for user identification
 * @param {ExpressRequest} [req] - Express request object for IP and additional context
 * @returns {Promise<boolean>} True if log was saved successfully, false otherwise
 * 
 * @example
 * // Create operation logging
 * const success = await logAction({
 *   action: 'CREATE',
 *   affected_table: 'APPRENTICES',
 *   module: 'APPRENTICES',
 *   affected_record_id: '507f1f77bcf86cd799439011',
 *   new_data: {
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     company_id: '507f1f77bcf86cd799439012'
 *   },
 *   description: 'New apprentice registered through admin panel'
 * }, req.headers.token, req);
 * 
 * @example
 * // Update operation with previous data
 * await logAction({
 *   action: 'UPDATE',
 *   affected_table: 'PROJECTS',
 *   module: 'PROJECTS',
 *   affected_record_id: projectId,
 *   previous_data: { status: 'DRAFT', title: 'Old Title' },
 *   new_data: { status: 'APPROVED', title: 'New Title' },
 *   level: 'INFO',
 *   description: 'Project approved by instructor'
 * }, req.headers.token, req);
 * 
 * @example
 * // Error logging
 * await logAction({
 *   action: 'ERROR',
 *   affected_table: 'SYSTEM',
 *   module: 'APPRENTICES',
 *   level: 'ERROR',
 *   description: 'Failed to send notification email',
 *   new_data: {
 *     error_message: error.message,
 *     error_stack: error.stack,
 *     context: { apprentice_id: '123', email: 'failed@email.com' }
 *   }
 * }, req.headers.token, req);
 */
async function logAction(logData, token = null, req = null) {
  try {
    const validation = validateLogData(logData);
    if (!validation.isValid) {
      console.error('Log validation failed:', validation.errors.join(', '));
      return false;
    }

    let userName = "SYSTEM";
    let userId = null;

    if (token) {
      const userIdFromToken = extractUserIdFromToken(token);
      
      if (userIdFromToken) {
        try {
          const userFromDB = await userModels.findById(userIdFromToken)
            .select('name email')
            .lean(); 
            
          if (userFromDB) {
            userName = userFromDB.name;
            userId = userFromDB._id;
          }
        } catch (userError) {
          console.error('Error fetching user from database:', userError.message);
        }
      }
    }

    const clientIP = extractClientIP(req);

    const logEntry = new logModels({
      action: logData.action,
      affected_table: logData.affected_table,
      affected_record_id: logData.affected_record_id || null,
      previous_data: logData.previous_data || null,
      new_data: logData.new_data || null,
      user: userName,
      user_id: userId,
      module: logData.module,
      level: logData.level || 'INFO',
      description: logData.description || null,
      ip_address: clientIP
    });

    await logEntry.save();
    
    console.log(`Log saved: ${logData.action} on ${logData.affected_table} by ${userName}`);
    
    return true;

  } catch (error) {
    console.error('CRITICAL: Error in logAction middleware:', {
      error: error.message,
      stack: error.stack,
      logData: logData,
      timestamp: new Date().toISOString()
    });
    
    // Try to log this error as a system log (recursive but with protection)
    if (logData.action !== 'ERROR') {
      try {
        await logAction({
          action: 'ERROR',
          affected_table: 'SYSTEM',
          module: 'LOGS',
          level: 'CRITICAL',
          description: `Failed to save log: ${error.message}`,
          new_data: {
            original_log_data: logData,
            error_message: error.message
          }
        }, null, null);
      } catch (recursiveError) {
        console.error('Failed to log the logging error:', recursiveError.message);
      }
    }
    
    return false;
  }
}

export default logAction;