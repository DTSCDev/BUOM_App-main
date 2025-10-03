import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  user_id: string;
  admin_level: string;
  departments: string[];
  permissions: any;
  is_active: boolean;
}

export const useAdminAuth = () => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setAdminUser(null);
        setHasAdminAccess(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching admin user:', error);
          setAdminUser(null);
          setHasAdminAccess(false);
        } else if (data) {
          setAdminUser(data);
          setHasAdminAccess(true);
        } else {
          setAdminUser(null);
          setHasAdminAccess(false);
        }
      } catch (err) {
        console.error('Admin auth check failed:', err);
        setAdminUser(null);
        setHasAdminAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const hasPermission = (permission: string, department?: string): boolean => {
    if (!adminUser) return false;
    
    // Super admins have all permissions
    if (adminUser.admin_level === 'super_admin') return true;
    
    // Check specific permission
    if (adminUser.permissions[permission]) return true;
    
    // Check department access
    if (department && adminUser.departments.includes(department)) return true;
    
    return false;
  };

  const canManageUsers = (): boolean => {
    return adminUser?.admin_level === 'super_admin' || hasPermission('manage_users');
  };

  const canViewAuditTrail = (): boolean => {
    return adminUser?.admin_level !== 'viewer' || hasPermission('view_audit');
  };

  const logAdminAction = async (
    actionType: string,
    entityType: string,
    entityId?: string,
    details?: Record<string, any>
  ) => {
    if (!adminUser) return;

    try {
      await supabase.rpc('log_admin_action', {
        p_admin_user_id: adminUser.id,
        p_action_type: actionType,
        p_entity_type: entityType,
        p_entity_id: entityId,
        p_details: details || {}
      });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  return {
    adminUser,
    loading,
    hasAdminAccess,
    hasPermission,
    canManageUsers,
    canViewAuditTrail,
    logAdminAction
  };
};