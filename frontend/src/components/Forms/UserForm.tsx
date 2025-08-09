import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Input from '../UI/Input';

import Button from '../UI/Button';

const CREATE_USER = gql`
  mutation CreateUser($createUserDto: CreateUserDtoInput!) {
    createUser(createUserDto: $createUserDto) {
      id
      email
      firstName
      lastName
      isActive
      createdAt
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: UUID!, $updateUserDto: UpdateUserDtoInput!) {
    updateUser(id: $id, updateUserDto: $updateUserDto) {
      id
      email
      firstName
      lastName
      isActive
      createdAt
    }
  }
`;

const GET_ROLES = gql`
  query GetRoles {
    roles {
      id
      name
    }
  }
`;



interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  confirmPassword?: string;
  roleIds: string[];
  isActive: boolean;
}

interface UserFormProps {
  user?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSuccess }) => {
  const isEditing = !!user;
  
  const { data: rolesData } = useQuery(GET_ROLES);
  
  const [createUser, { loading: createLoading }] = useMutation(CREATE_USER);
  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER);

  const {
    control,
    handleSubmit,
    watch
  } = useForm<UserFormData>({
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      roleIds: user?.roleIds || [],
      isActive: user?.isActive ?? true
    }
  });

  const password = watch('password');

  const onSubmit = async (data: UserFormData) => {
    try {
      const input = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        roleIds: data.roleIds,
        isActive: data.isActive
      };

      if (isEditing) {
        await updateUser({
          variables: {
            id: user.id,
            updateUserDto: {
              firstName: data.firstName,
              lastName: data.lastName,
              isActive: data.isActive,
              roleIds: data.roleIds
            }
          }
        });
      } else {
        await createUser({
          variables: { createUserDto: input }
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const roleOptions = rolesData?.roles?.map((role: any) => ({
    value: role.id,
    label: role.name
  })) || [];



  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit User' : 'Add User'}
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
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="First Name"
                placeholder="Enter first name"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            rules={{ required: 'Last name is required' }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Last Name"
                placeholder="Enter last name"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type="email"
                label="Email"
                placeholder="Enter email address"
                error={fieldState.error?.message}
              />
            )}
          />

          {!isEditing && (
            <>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="password"
                    label="Password"
                    placeholder="Enter password"
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match'
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm password"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </>
          )}

          <Controller
            name="roleIds"
            control={control}
            rules={{ required: 'At least one role is required' }}
            render={({ field, fieldState }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roles
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {roleOptions.map((role: { value: string; label: string }) => (
                    <label key={role.value} className="flex items-center">
                      <input
                        type="checkbox"
                        value={role.value}
                        checked={field.value?.includes(role.value)}
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
                      <span className="ml-2 text-sm text-gray-900">{role.label}</span>
                    </label>
                  ))}
                </div>
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>
                )}
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
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
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

export default UserForm;
