import React from 'react'
import Layout from '../dashboard';
import AdminPageGuard from '@/components/auth/admin-page-guard';


export default function Dashboard() {
  return (
    <div>index</div>
  )
}

Dashboard.getLayout = function getLayout(page) {
    return (
      <Layout>
        <AdminPageGuard>{page}</AdminPageGuard>
      </Layout>
    );
  };
  
