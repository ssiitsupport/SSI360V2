import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Input from '../UI/Input';
import Button from '../UI/Button';

const CREATE_TENANT = gql`
  mutation CreateTenant($createTenantDto: CreateTenantDtoInput!) {
    createTenant(createTenantDto: $createTenantDto) {
      id
      name
      domain
      isActive
      createdAt
    }
  }
`;

const UPDATE_TENANT = gql`
  mutation UpdateTenant($id: UUID!, $updateTenantDto: UpdateTenantDtoInput!) {
    updateTenant(id: $id, updateTenantDto: $updateTenantDto) {
      id
      name
      domain
      isActive
      createdAt
    }
  }
`;

interface TenantFormData {
  name: string;
  domain: string;
  isActive: boolean;
}

interface TenantFormProps {
  tenant?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const TenantForm: React.FC<TenantFormProps> = ({ tenant, onClose, onSuccess }) => {
  const isEditing = !!tenant;
  
  const [createTenant, { loading: createLoading }] = useMutation(CREATE_TENANT);
  const [updateTenant, { loading: updateLoading }] = useMutation(UPDATE_TENANT);

  const {
    control,
    handleSubmit
  } = useForm<TenantFormData>({
    defaultValues: {
      name: tenant?.name || '',
      domain: tenant?.domain || '',
      isActive: tenant?.isActive ?? true
    }
  });

  const onSubmit = async (data: TenantFormData) => {
    try {
      const input = {
        name: data.name,
        domain: data.domain,
        isActive: data.isActive
      };

      if (isEditing) {
        await updateTenant({
          variables: {
            id: tenant.id,
            updateTenantDto: input
          }
        });
      } else {
        await createTenant({
          variables: { createTenantDto: input }
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving tenant:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Tenant' : 'Add Tenant'}
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
            rules={{ required: 'Tenant name is required' }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Tenant Name"
                placeholder="Enter tenant name"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="domain"
            control={control}
            rules={{ required: 'Domain is required' }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Domain"
                placeholder="Enter domain (e.g., example.com)"
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
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

export default TenantForm;
