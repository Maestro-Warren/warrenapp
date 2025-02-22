"use client"

import { Transaction } from '@/type'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { getTransactionsByEmailAndPeriod } from '../action'
import Wrapper from '../components/wrapper'
import TransactionItem from '../components/TransactionItem'

const page = () => {

  const { user } = useUser()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchTransactions = async (period: string) => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setLoading(true)
      try {
        const transactionsData = await getTransactionsByEmailAndPeriod(user?.primaryEmailAddress?.emailAddress, period)
        setTransactions(transactionsData)
        setLoading(false)
      } catch (err) {
        console.error("Erreur lors de la récupération des transactions: ", err);
      }
    }
  }

  useEffect(() => {
    fetchTransactions("last30")
  }, [user?.primaryEmailAddress?.emailAddress])

  return (
    <Wrapper>

      <div className='flex justify-end mb-5 '>
        <select
          className='input input-bordered input-md'
          defaultValue="last30"
          onChange={(e) => fetchTransactions(e.target.value)}
        >
          <option value="last7">Derniers 7 jours</option>
          <option value="last30">Derniers 30 jours</option>
          <option value="last90">Derniers 90 jours</option>
          <option value="last365">Derniers 365 jours</option>
        </select>
      </div>


      <div className='overflow-x-auto w-full bg-base-200/35 p-5 rounded-xl'>
        {loading ? (
          <div className='flex justify-center items-center'>
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : transactions.length === 0 ? (
          <div className='flex justify-center items-center h-full'>
            <span className='text-gray-500 text-sm'>
              Aucune transaction à afficher.
            </span>
          </div>
        ) : (
          <ul className='divide-y divide-base-300'>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}>
              </TransactionItem>
            ))}
          </ul>
        )}
      </div>
    </Wrapper>
  )
}

export default page