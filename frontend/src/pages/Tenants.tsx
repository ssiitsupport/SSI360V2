import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable, { Column } from '../components/UI/DataTable';
import SearchPanel, { SearchControl } from '../components/UI/SearchPanel';
import Button from '../components/UI/Button';
import TenantForm from '../components/Forms/TenantForm';

const GET_TENANTS = gql`
  query GetTenants($page: Int!, $pageSize: Int!, $searchTerm: String, $sortBy: String, $sortOrder: String) {
    tenants(page: $page, pageSize: $pageSize, searchTerm: $searchTerm, sortBy: $sortBy, sortOrder: $sortOrder) {
      items {
        id
        name
        domain
        isActive
        createdAt
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;

const DELETE_TENANT = gql`
  mutation DeleteTenant($id: UUID!) {
    deleteTenant(id: $id)
  }
`;

const Tenants: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any>(null);

  const { data, loading, refetch } = useQuery(GET_TENANTS, {
    variables: {
      page: currentPage,
      pageSize: 10,
      searchTerm: searchTerm || searchFilters.searchTerm,
      sortBy,
      sortOrder
    }
  });

  const [deleteTenant] = useMutation(DELETE_TENANT);

  const handleSearch = (values: any) => {
    setSearchFilters(values);
    setCurrentPage(1);
    refetch({
      page: 1,
      pageSize: 10,
      searchTerm: values.searchTerm || '',
      sortBy,
      sortOrder
    });
  };

  const handleSort = (key: string) => {
    const newSortOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(key);
    setSortOrder(newSortOrder);
  };

  const handleDelete = async (tenantId: string) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        await deleteTenant({ variables: { id: tenantId } });
        refetch();
      } catch (error) {
        console.error('Error deleting tenant:', error);
      }
    }
  };

  const handleEdit = (tenant: any) => {
    setEditingTenant(tenant);
    setShowTenantForm(true);
  };

  const handleFormClose = () => {
    setShowTenantForm(false);
    setEditingTenant(null);
  };

  const handleFormSuccess = () => {
    refetch();
    handleFormClose();
  };

  const searchControls: SearchControl[] = [
    {
      name: 'searchTerm',
      type: 'text',
      label: 'Search',
      placeholder: 'Search by tenant name'
    },
    {
      name: 'isActive',
      type: 'select',
      label: 'Status',
      placeholder: 'Select status',
      options: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' }
      ]
    }
  ];

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Tenant Name',
      sortable: true
    },
    {
      key: 'domain',
      label: 'Domain',
      sortable: true
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const tenants = data?.tenants?.items || [];
  const totalPages = data?.tenants?.totalPages || 1;
  const totalItems = data?.tenants?.totalCount || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-600">Manage multi-tenant organizations</p>
        </div>
        <Button onClick={() => setShowTenantForm(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      <SearchPanel
        controls={searchControls}
        onSearch={handleSearch}
        onReset={() => {
          setSearchFilters({});
          setSearchTerm('');
          setCurrentPage(1);
          refetch({
            page: 1,
            pageSize: 10,
            searchTerm: '',
            sortBy,
            sortOrder
          });
        }}
        loading={loading}
      />

      <DataTable
        columns={columns}
        data={tenants}
        loading={loading}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage: 10,
          onPageChange: setCurrentPage
        }}
        sorting={{
          sortBy,
          sortOrder,
          onSort: handleSort
        }}
      />

      {showTenantForm && (
        <TenantForm
          tenant={editingTenant}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default Tenants;
