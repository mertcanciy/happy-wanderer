'use client';

import React, {useState, useEffect} from 'react';

import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Button,
} from '@tremor/react';

interface TokenRequest {
  id: number;
  customer: {
    userName: string;
  };
  pointAmount: number;
  tokenAmount: number;
  walletAddress:string;
}

export default function TokenRequestsTable({tokenReqs}: {tokenReqs : TokenRequest[]}) {
  const [ saved, setSaved ] = useState(false);

//   const [tokenReqs, setTokenReqs] = useState([]);

//   useEffect(() => {
//     const getTokenReqs = async () => {
//         const data = await fetch(`http://localhost:8080/api/tokenRequests`, {
//           method: 'GET',
//           headers: {
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//           },
//         }).then(r => {
//           return r.json();
//         })
//         setTokenReqs(data)
//     }

//     getTokenReqs();
//   }, [])

  


const approveReq = async (id) => {
  await fetch(`http://localhost:8080/api/tokenRequests/${id}`, {
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "approveStatus": "1"
      }),
  }).then(res => {
      if (res.status === 200) {
          setSaved(true);
      } else {
          setSaved(false);
      }
  });
}

  const declineReq = async (id) => {
    await fetch(`http://localhost:8080/api/tokenRequests/${id}`, {
    method: 'PUT',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "approveStatus":"2"
    }),
  }).then(res => {
      if(res.status === 200){
          setSaved(true);
      }else{
        setSaved(false);
      }
  });
  }


  
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Username</TableHeaderCell>
          <TableHeaderCell>Point Amount</TableHeaderCell>
          <TableHeaderCell>Token Amount</TableHeaderCell>
          <TableHeaderCell>Wallet Address</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tokenReqs.map((tokenReq) => (
          <TableRow key={tokenReq.id}>
            <TableCell>{tokenReq.customer.userName}</TableCell>
            <TableCell>
              <Text>{tokenReq.pointAmount}</Text>
            </TableCell>
            <TableCell>
              <Text>{tokenReq.tokenAmount}</Text>
            </TableCell>
            <TableCell>
              <Text>{tokenReq.walletAddress}</Text>
            </TableCell>
            <TableCell>
            <button
              className="text-white text-[13px] font-mono bg-green-700 hover:bg-gray-700 transition-all rounded-md w-[220px] h-10 flex items-center justify-center whitespace-nowrap"
              onClick={() => approveReq(tokenReq.id)}
            >
              Approve
            </button>            
            </TableCell>
            <TableCell>
            <button
              className="text-white text-[13px] font-mono bg-red-700 hover:bg-gray-700 transition-all rounded-md w-[220px] h-10 flex items-center justify-center whitespace-nowrap"
              onClick={() => declineReq(tokenReq.id)}
            >
              Decline
            </button>
            </TableCell>
          </TableRow>
        ))
        }
      </TableBody>
    </Table>
  );
}
