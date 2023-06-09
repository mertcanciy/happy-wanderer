'use client';

import { Card, Title, Text } from '@tremor/react';
import React, { useEffect, useState } from 'react';
import Search from '../components/admin-panel/search';
import TokenRequestsTable from '../components/admin-panel/table';

export const dynamic = 'force-dynamic';

const AdminPage: React.FC = () => {  
    const [tokenReqs, setTokenReqs] = useState([]);

    useEffect(() => {
        const getTokenReqs = async () => {
            const data = await fetch(`http://ec2-16-170-157-242.eu-north-1.compute.amazonaws.com:8080/api/tokenRequests`, {
              method: 'GET',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
            }).then(r => {
              if(r.status == 200){
                return r.json();
              }
              return [];
            })
            setTokenReqs(data)
        }
        
        getTokenReqs();
      }, [])

  return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Title>Point to HAPPY Token Swap Requests</Title>
        <Text>
          A list of customers.
        </Text>
        <Search />
        <Card className="mt-6">
          <TokenRequestsTable tokenReqs={tokenReqs} />
        </Card>
      
      </main>
  );
}

export default AdminPage;