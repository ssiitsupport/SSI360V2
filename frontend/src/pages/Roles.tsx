import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable, { Column } from '../components/UI/DataTable';
import SearchPanel, { SearchControl } from '../components/UI/SearchPanel';
import Button from '../components/UI/Button';
import RoleForm from '../components/Forms/RoleForm';

const GET_ROLES = gql`
  query GetRoles($page: Int!, $pageSize: Int!, $searchTerm: String, $sortBy: String, $sortOrder: String) {
    roles(page: $page, pageSize: $pageSize, searchTerm: $searchTerm, sortBy: $sortBy, sortOrder: $sortOrder) {
      items {
        id
        name
        description
        isActive
        createdAt
        permissions
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;

const DELETE_ROLE = gql`
  mutation DeleteRole($id: UUID!) {
    deleteRole(id: $id)
  }
`;

const Roles: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const { data, loading, refetch } = useQuery(GET_ROLES, {
    variables: {
      page: currentPage,
      pageSize: 10,
      searchTerm: searchTerm || searchFilters.searchTerm,
      sortBy,
      sortOrder
    }
  });

  const [deleteRole] = useMutation(DELETE_ROLE);

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

  const handleDelete = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole({ variables: { id: roleId } });
        refetch();
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setShowRoleForm(true);
  };

  const handleFormClose = () => {
    setShowRoleForm(false);
    setEditingRole(null);
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
      placeholder: 'Search by role name'
    }
  ];

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Role Name',
      sortable: true
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value?.map((permission: string, index: number) => (
            <span
              key={index}
              className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
            >
              {permission}
            </span>
          ))}
        </div>
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

  const roles = data?.roles?.items || [];
  const totalPages = data?.roles?.totalPages || 1;
  const totalItems = data?.roles?.totalCount || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <Button onClick={() => setShowRoleForm(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Role
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
        data={roles}
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

      {showRoleForm && (
        <RoleForm
          role={editingRole}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default Roles;
