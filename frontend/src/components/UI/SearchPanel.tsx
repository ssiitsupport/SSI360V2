import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from './Input';
import Select from './Select';
import Button from './Button';

export interface SearchControl {
  name: string;
  type: 'text' | 'select' | 'email' | 'date';
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface SearchPanelProps {
  controls: SearchControl[];
  onSearch: (values: any) => void;
  onReset?: () => void;
  loading?: boolean;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ 
  controls, 
  onSearch, 
  onReset, 
  loading = false 
}) => {
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    onSearch(data);
  };

  const handleReset = () => {
    reset();
    onReset?.();
  };

  const renderControl = (controlConfig: SearchControl) => {
    switch (controlConfig.type) {
      case 'select':
        return (
          <Controller
            name={controlConfig.name}
            control={control}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label={controlConfig.label}
                placeholder={controlConfig.placeholder}
                options={controlConfig.options || []}
                error={fieldState.error?.message}
              />
            )}
          />
        );
      
      case 'text':
      case 'email':
      case 'date':
      default:
        return (
          <Controller
            name={controlConfig.name}
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type={controlConfig.type}
                label={controlConfig.label}
                placeholder={controlConfig.placeholder}
                error={fieldState.error?.message}
              />
            )}
          />
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {controls.map((controlConfig) => (
            <div key={controlConfig.name}>
              {renderControl(controlConfig)}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;
