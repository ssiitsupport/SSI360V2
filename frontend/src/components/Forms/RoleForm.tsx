import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { useAuth } from '../../contexts/AuthContext';

const CREATE_ROLE = gql`
  mutation CreateRole($createRoleDto: CreateRoleDtoInput!) {
    createRole(createRoleDto: $createRoleDto) {
      id
      name
      description
      isActive
      permissions
      createdAt
    }
  }
`;

const UPDATE_ROLE = gql`
  mutation UpdateRole($id: UUID!, $updateRoleDto: UpdateRoleDtoInput!) {
    updateRole(id: $id, updateRoleDto: $updateRoleDto) {
      id
      name
      description
      isActive
      permissions
      createdAt
    }
  }
`;

const GET_PERMISSIONS = gql`
  query GetPermissions {
    permissions {
      id
      name
    }
  }
`;

interface RoleFormData {
  name: string;
  description: string;
  permissionIds: string[];
  isActive: boolean;
}

interface RoleFormProps {
  role?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onClose, onSuccess }) => {
  const isEditing = !!role;
  const { user } = useAuth();
  
  const { data: permissionsData } = useQuery(GET_PERMISSIONS);
  
  const [createRole, { loading: createLoading }] = useMutation(CREATE_ROLE);
  const [updateRole, { loading: updateLoading }] = useMutation(UPDATE_ROLE);

  const {
    control,
    handleSubmit
  } = useForm<RoleFormData>({
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      permissionIds: role?.permissionIds || [],
      isActive: role?.isActive ?? true
    }
  });

  const onSubmit = async (data: RoleFormData) => {
    try {
      const input = {
        name: data.name,
        description: data.description,
        permissionIds: data.permissionIds,
        isActive: data.isActive,
        tenantId: user?.tenantId || localStorage.getItem('tenantId') || ''
      };

      if (isEditing) {
        await updateRole({
          variables: {
            id: role.id,
            updateRoleDto: input
          }
        });
      } else {
        await createRole({
          variables: { createRoleDto: input }
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const permissionOptions = permissionsData?.permissions?.map((permission: any) => ({
    value: permission.id,
    label: permission.name
  })) || [];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Role' : 'Add Role'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Role name is required' }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Role Name"
                placeholder="Enter role name"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Description"
                placeholder="Enter role description"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="permissionIds"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {permissionOptions.map((permission: { value: string; label: string }) => (
                    <label key={permission.value} className="flex items-center">
                      <input
                        type="checkbox"
                        value={permission.value}
                        checked={field.value?.includes(permission.value)}
                        onChange={(e) => {
                          const value = e.target.value;
                          const checked = e.target.checked;
                          const currentValues = field.value || [];
                          
                          if (checked) {
                            field.onChange([...currentValues, value]);
                          } else {
                            field.onChange(currentValues.filter((v: string) => v !== value));
                          }
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          />

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            )}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createLoading || updateLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createLoading || updateLoading}
            >
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;
