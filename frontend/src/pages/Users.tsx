import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable, { Column } from '../components/UI/DataTable';
import SearchPanel, { SearchControl } from '../components/UI/SearchPanel';
import Button from '../components/UI/Button';
import UserForm from '../components/Forms/UserForm';

const GET_USERS = gql`
  query GetUsers($page: Int!, $pageSize: Int!, $searchTerm: String, $sortBy: String, $sortOrder: String) {
    users(page: $page, pageSize: $pageSize, searchTerm: $searchTerm, sortBy: $sortBy, sortOrder: $sortOrder) {
      items {
        id
        email
        firstName
        lastName
        isActive
        createdAt
        tenantName
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: UUID!) {
    deleteUser(id: $id)
  }
`;

const Users: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchFilters, setSearchFilters] = useState<any>({});

  const { data, loading, refetch } = useQuery(GET_USERS, {
    variables: {
      page: currentPage,
      pageSize: 10,
      searchTerm: searchTerm || searchFilters.searchTerm,
      sortBy,
      sortOrder
    }
  });

  const [deleteUser] = useMutation(DELETE_USER);

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

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser({ variables: { id: userId } });
        refetch();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleFormClose = () => {
    setShowUserForm(false);
    setEditingUser(null);
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
      placeholder: 'Search by name or email'
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
      key: 'firstName',
      label: 'First Name',
      sortable: true,
      render: (value, row) => `${row.firstName} ${row.lastName}`
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'tenantName',
      label: 'Tenant',
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

  const users = data?.users?.items || [];
  const totalPages = data?.users?.totalPages || 1;
  const totalItems = data?.users?.totalCount || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <Button onClick={() => setShowUserForm(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add User
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
        data={users}
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

      {showUserForm && (
        <UserForm
          user={editingUser}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default Users;
