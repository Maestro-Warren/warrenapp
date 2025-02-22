"use client";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/wrapper";
import { useUser } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import { error } from "console";
import { addBudget, getBudgetByUser } from "../action";
import Notification from "../components/Notification";
import { Budget } from "@/type";
import Link from "next/link";
import Budgetitem from "../components/Budgetitem";
import { Landmark } from "lucide-react";


const Page = () => {
  const { user } = useUser();
  const [budgetName, setBudgetName] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [budgets, setBudget] = useState<Budget[]>([]);

  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("");
  };

  const handleEmojiSelect = (emojiObjet: { emoji: string }) => {
    setSelectedEmoji(emojiObjet.emoji);
    setShowEmojiPicker(false);
  };

  const handleAddBudget = async () => {
    try {
      const amout = parseFloat(budgetAmount);
      if (isNaN(amout) || amout <= 0) {
        throw new Error("Le montant doit etre un nombre positif.");
      }

      await addBudget(
        user?.primaryEmailAddress?.emailAddress as string,
        budgetName,
        amout,
        selectedEmoji
      );

      fetchBudgets();

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;

      if (modal) {
        modal.close();
      }

      setNotification("Nouveau budget crée avec succés.");
      setBudgetAmount("");
      setBudgetName("");
      setSelectedEmoji("");
      setShowEmojiPicker(false);
    } catch (error) {
      setNotification(`Erreur : ${error}`);

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;

      if (modal) {
        modal.close();
      }
    }
  };

 

  const fetchBudgets = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      try {
        const userBudgets = await getBudgetByUser(
          user?.primaryEmailAddress?.emailAddress
        );

        setBudget(userBudgets);

      } catch (error) {
        setNotification(`Erreur lors de ka recuperation des budgets: ${error}`);
      }
    }
  };

    useEffect(() => {
        fetchBudgets();
    }, [user?.primaryEmailAddress?.emailAddress]);

  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification}
          onclose={closeNotification}
        ></Notification>
      )}
      <button
        className="btn mb-4"
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          ).showModal()
        }
      >
        Nouveau budget
        <Landmark className="w-4" />
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Création d'un budget</h3>
          <p className="py-4">Premet de controler ces depenses facilement</p>
          <div className="w-full flex flex-col">
            <input
              type="text"
              value={budgetName}
              placeholder="Nom du budget"
              onChange={(e) => setBudgetName(e.target.value)}
              className="input input-bordered mb-3"
              required
            />

            <input
              type="number"
              value={budgetAmount}
              placeholder="Montant du budget"
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="input input-bordered mb-3"
              required
            />

            <button
              className="btn mb-4"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {selectedEmoji || "sélectionnez un emoji"}
            </button>

            {showEmojiPicker && (
              <div className="flex justify-center items-center my-4">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}

            <button className="btn" onClick={handleAddBudget}>
              Ajouter Budget
            </button>
          </div>
        </div>
      </dialog>

    <ul className="grid md:grid-cols-3 gap-4">
        {budgets.map((budget)=>(
            <Link href={`/manage/${budget.id}`} key={budget.id}>
              <Budgetitem budget={budget} enableHover={1}></Budgetitem>
            </Link>
        ))}


    </ul>


    </Wrapper>
  );
};

export default Page;
