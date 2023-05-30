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

import { BigNumber, ethers, Signer } from 'ethers';
import { useScaffoldContractWrite } from '~~/hooks/scaffold-eth';

interface TokenRequest {
  id: number;
  customer: {
    userName: string;
  };
  pointAmount: number;
  tokenAmount: number;
  walletAddress:string;
}


const TokenRequestsTable: React.FC = ({ tokenReqs }) => {
  const [saved, setSaved] = useState(false);
  const [props, setProps] = useState({walletAddress:"0x4aDc44E492aBfAbBcB306575a0edDCE3ca06Cb47",tokenAmount:10});

  const getArgs = () => {
    return [props.walletAddress,BigNumber.from((parseFloat((props.tokenAmount).toString()) * 10 ** 18).toString())]
  }

  const { writeAsync: sendToCustomer } = useScaffoldContractWrite({
    contractName: 'Happy',
    functionName: 'transfer',
    args: getArgs(),
    //args: [props.walletAddress, BigNumber.from((parseFloat((props.tokenAmount).toString()) * 10 ** 18).toString())],
  });  

  
  const sendToCustomerWrite = async (props) => {    
    console.log(props)
    await sendToCustomer();
  };
  

  const approveReq = async (props2) => {
    console.log(props)
    try {
      setProps( props2 );
      console.log(props)
      sendToCustomerWrite(props);
    } catch (err) {
      console.log(err);
    }

    await fetch(`http://ec2-16-170-157-242.eu-north-1.compute.amazonaws.com:8080/api/tokenRequests/${props2.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        approveStatus: '1',
      }),
    }).then((res) => {
      if (res.status === 200) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    });
  };

  
  const declineReq = async (id) => {
    await fetch(`http://ec2-16-170-157-242.eu-north-1.compute.amazonaws.com:8080/api/tokenRequests/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        approveStatus: '2',
      }),
    }).then((res) => {
      if (res.status === 200) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    });
  };

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
                onClick={() => {approveReq(tokenReq)}}
              >
                Approve
              </button>
            </TableCell>
            <TableCell>
              <button
                className="text-white text-[13px] font-mono bg-red-700 hover:bg-gray-700 transition-all rounded-md w-[220px] h-10 flex items-center justify-center whitespace-nowrap"
                onClick={() => {declineReq(tokenReq.id)}}
              >
                Decline
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TokenRequestsTable;

