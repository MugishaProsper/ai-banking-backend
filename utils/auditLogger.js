import User from '../models/user.models.js';

export const createAuditLog = async ({ userId, action, ipAddress, userAgent, details = {} }) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.auditLogs.push({
      action,
      timestamp: new Date(),
      ipAddress,
      userAgent,
      details
    });

    await user.save();
  } catch (error) {
    console.error('Audit log creation failed:', error);
    throw error;
  }
}; 