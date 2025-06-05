import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
// import axios from 'axios'; // We'll use fetch for now, or introduce axios later if needed

// TODO: Replace with actual API call
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const ClientListPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [editingClient, setEditingClient] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      // const response = await fetch(`${API_URL}/clients`);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // const data = await response.json();
      // setClients(data);

      // Placeholder data until backend is fully integrated and running for testing
      const placeholderData = [
        { client_id: 1, first_name: 'John', last_name: 'Doe', phone_number: '555-1234', email: 'john.doe@example.com', city: 'Boston', state: 'MA', is_active: true },
        { client_id: 2, first_name: 'Jane', last_name: 'Smith', phone_number: '555-5678', email: 'jane.smith@example.com', city: 'Cambridge', state: 'MA', is_active: false },
        { client_id: 3, first_name: 'Alice', last_name: 'Wonderland', phone_number: '555-8765', email: 'alice.w@example.com', city: 'Somerville', state: 'MA', is_active: true },
      ];
      setClients(placeholderData);
      message.success('Placeholder client data loaded!');

    } catch (error) {
      console.error("Failed to fetch clients:", error);
      message.error('Failed to fetch clients. Using placeholder data.');
       const placeholderData = [
        { client_id: 1, first_name: 'John', last_name: 'Doe', phone_number: '555-1234', email: 'john.doe@example.com', city: 'Boston', state: 'MA', is_active: true },
        { client_id: 2, first_name: 'Jane', last_name: 'Smith', phone_number: '555-5678', email: 'jane.smith@example.com', city: 'Cambridge', state: 'MA', is_active: false },
      ];
      setClients(placeholderData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = () => {
    // setEditingClient(null);
    // setIsModalVisible(true);
    message.info('Add Client functionality to be implemented.');
  };

  const handleEditClient = (client) => {
    // setEditingClient(client);
    // setIsModalVisible(true);
    message.info(`Edit Client: ${client.first_name} (ID: ${client.client_id}) - to be implemented.`);
  };

  const handleDeleteClient = (client) => {
    Modal.confirm({
      title: `Confirm Deletion`,
      content: `Are you sure you want to ${client.is_active ? 'deactivate' : 'reactivate'} client '${client.first_name} ${client.last_name}'?`,
      okText: client.is_active ? 'Deactivate' : 'Reactivate',
      okType: client.is_active ? 'danger': 'primary',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          // await fetch(`${API_URL}/clients/${client.client_id}`, { method: 'DELETE' });
          // message.success(`Client ${client.first_name} ${client.is_active ? 'deactivated' : 'reactivated'} successfully.`);
          // fetchClients(); // Refresh the list
          message.info(`Client ${client.first_name} ${client.is_active ? 'deactivation' : 'reactivation'} action - to be implemented.`);
          // Simulate change for placeholder
          setClients(prevClients => prevClients.map(c => 
            c.client_id === client.client_id ? { ...c, is_active: !c.is_active } : c
          ));

        } catch (error) {
          console.error("Failed to delete client:", error);
          message.error('Failed to update client status.');
        }
      },
    });
  };
  
  const handleViewClient = (client) => {
    message.info(`View Client: ${client.first_name} (ID: ${client.client_id}) - to be implemented.`);
    // This could open a modal with more details or navigate to a client detail page
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'last_name',
      key: 'name',
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
      render: (_, record) => `${record.first_name} ${record.last_name}`,
      // TODO: Add search filter for name
    },
    {
      title: 'Phone',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: isActive => (
        <Tag color={isActive ? 'green' : 'volcano'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.is_active === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleViewClient(record)}>View</Button>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditClient(record)}>Edit</Button>
          <Button 
            type={record.is_active ? "primary" : "default"} 
            danger={record.is_active} 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteClient(record)}
          >
            {record.is_active ? 'Deactivate' : 'Reactivate'}
          </Button>
        </Space>
      ),
    },
  ];

  // Filter data based on searchText (simple client-side search for now)
  const filteredClients = clients.filter(client =>
    `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchText.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchText.toLowerCase())) ||
    (client.phone_number && client.phone_number.includes(searchText))
  );


  return (
    <div>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search Clients (Name, Email, Phone)"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClient}>
          Add New Client
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredClients}
        loading={loading}
        rowKey="client_id"
        bordered
        // pagination={{ pageSize: 10 }} // Example pagination
      />
      {/* TODO: Add ClientForm Modal here */}
      {/* <ClientFormModal visible={isModalVisible} client={editingClient} onClose={() => setIsModalVisible(false)} onSave={fetchClients} /> */}
    </div>
  );
};

export default ClientListPage;