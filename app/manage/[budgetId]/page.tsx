"use client";
import { Budget } from "@/type";
import { resolve } from "path";
import { useEffect, useState } from "react";
import React from "react";
import { addTransactionToBudget, deleteBudget, deleteTransaction, getTransectionByBudgetId } from "@/app/action";
import Budgetitem from "@/app/components/Budgetitem";
import Wrapper from "@/app/components/wrapper";
import Notification from "@/app/components/Notification";
import { Send, Trash } from "lucide-react";
import { redirect } from "next/navigation";

const Page = ({ params }: { params: Promise<{ budgetId: string }> }) => {
  const [budgetId, setBudgetId] = useState<string>("");
  const [budget, setBudget] = useState<Budget>();
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("");
  };

  async function fetchBudgetData(budgetId: string) {
    try {
      if (budgetId) {
        const budgetData = await getTransectionByBudgetId(budgetId);
        setBudget(budgetData);
      }
    } catch (error) {
      console.log("Erreur lors de la récupération des budgets:", error);
      throw error;
    }
  }

  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      setBudgetId(resolvedParams.budgetId);
      fetchBudgetData(resolvedParams.budgetId);
    };
    getId();
  }, [params]);

  const handleAddTransaction = async () => {
    if (!amount || !description) {
      setNotification("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        throw new Error("Le montant doit etre un nombre positif.");
      }

      const newTransaction = await addTransactionToBudget(
        budgetId,
        amountNumber,
        description
      );

      setNotification(`Transaction ajoutée avec succès.`);
      fetchBudgetData(budgetId);
      setAmount("");
      setDescription("");
    } catch (error) {
      setNotification(`Vous avez depassé le montant du budget`);
    }
  };

  const handleDeleteBudget = async () => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer ce budget ?");
    if (confirmed) {
        try {
            await deleteBudget(budgetId);
            setNotification("Budget supprimé avec succès");
          
            
        } catch (error) {
            console.error("Erreur lors de la suppression du budget:", error);
            setNotification(`Erreur lors de la suppression du budget: ${error}`);
        }
        redirect("/budjets");
    }
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette transaction ?");
    if (confirmed) {
        try {
            await deleteTransaction(transactionId);
            setNotification("Transaction supprimée avec succès");
            fetchBudgetData(budgetId);
        } catch (error) {
            console.error("Erreur lors de la suppression de la transaction:", error);
            setNotification(`Erreur lors de la suppression de la transaction: ${error}`);
        }
    }
  }

  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification}
          onclose={closeNotification}
        ></Notification>
      )}
      <div>
        {budget && (
          <div className="flex md:flex-row flex-col">
            <div className="md:w-1/3">
              <Budgetitem budget={budget} enableHover={0} />
              <button 
              onClick={() => handleDeleteBudget()}
              className="btn mt-4">
                supprimer le budget
                </button>
              <div className="space-y-4 mt-4 flex flex-col">
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  required
                  className="input input-bordered"
                />
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Montant"
                  required
                  className="input input-bordered"
                />
                <button onClick={handleAddTransaction} className="btn mt-4">
                  Ajouter votre transaction
                </button>
              </div>
            </div>
            {budget?.transactions && budget.transactions.length > 0 ? (
              <div className="overflow-x-auto md:mt-0 mt-4 md:w-2/3 ml-4">
                <table className="table table-zebra">
                  {/* head */}
                  <thead>
                    <tr>
                      <th></th>
                      <th>Montant</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Heure</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget?.transactions?.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="text-lg md:text-3xl">
                          {transaction.emoji}
                        </td>
                        <td>
                          <div className="badge badge-accent badge-xs md:badge-sm">
                            -{transaction.amount} FCFA
                          </div>
                        </td>
                        <td>{transaction.description}</td>
                        <td>
                          {transaction.createdAt.toLocaleDateString("fr-FR")}
                        </td>
                        <td>
                          {transaction.createdAt.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                        <td>
                          <button 
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="btn btn-sm">
                            <Trash className="w-4"></Trash>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <span className="md:w-2/3 mt-10 md:ml-4 flex items-center justify-center">
                <Send strokeWidth={1.5} className="w-8 h-8 text-accent" />
                <span className="text-gray-500 ml-2"> Aucune transaction.</span>
              </span>
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Page;
