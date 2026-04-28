"use client";

import { useState } from "react";
import { useFinanceStore } from "@/store/finance";
import { useMemo } from "react";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const emptyForm = { name: "", target: "" };

export default function SavingsPage() {
  const savingsGoals = useFinanceStore((s) => s.savingsGoals);
  const transactions = useFinanceStore((s) => s.transactions);
  const addSavingsGoal = useFinanceStore((s) => s.addSavingsGoal);
  const updateSavingsGoal = useFinanceStore((s) => s.updateSavingsGoal);
  const deleteSavingsGoal = useFinanceStore((s) => s.deleteSavingsGoal);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const savedByGoal = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "savings")
      .forEach((t) => {
        map[t.categoryId] = (map[t.categoryId] ?? 0) + t.amount;
      });
    return map;
  }, [transactions]);

  const totalSaved = Object.values(savedByGoal).reduce((a, v) => a + v, 0);
  const totalTarget = savingsGoals.reduce((a, g) => a + g.target, 0);

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(id: string, name: string, target: number) {
    setEditingId(id);
    setForm({ name, target: String(target) });
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function validate() {
    if (!form.name.trim()) return "Nome é obrigatório.";
    if (
      isNaN(Number(form.target)) ||
      form.target === "" ||
      Number(form.target) <= 0
    )
      return "Meta deve ser maior que zero.";
    return "";
  }

  function handleSave() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    const payload = { name: form.name.trim(), target: Number(form.target) };
    if (editingId) {
      updateSavingsGoal(editingId, payload);
    } else {
      addSavingsGoal(payload);
    }
    closeForm();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Poupança</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Gerencie suas metas de poupança
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
        >
          <span className="text-base leading-none">+</span> Nova meta
        </button>
      </div>

      {/* Summary */}
      {savingsGoals.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-blue-50 rounded-xl px-4 py-4">
            <p className="text-xs text-blue-400 mb-1.5">Total poupado</p>
            <p className="text-xl font-medium text-blue-700">
              {fmt(totalSaved)}
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl px-4 py-4">
            <p className="text-xs text-gray-500 mb-1.5">Meta total</p>
            <p className="text-xl font-medium text-gray-900">
              {fmt(totalTarget)}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
          <p className="text-sm font-medium text-gray-700 mb-4">
            {editingId ? "Editar meta" : "Nova meta"}
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nome</label>
              <input
                type="text"
                placeholder="Ex: Viagem, Carro, Reserva de emergência"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Meta (R$)
              </label>
              <input
                type="number"
                placeholder="0"
                min="1"
                value={form.target}
                onChange={(e) =>
                  setForm((f) => ({ ...f, target: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-400"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                className="flex-1 bg-gray-900 text-white text-sm py-2 rounded-xl hover:bg-gray-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={closeForm}
                className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals list */}
      <div className="flex flex-col gap-3">
        {savingsGoals.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            Nenhuma meta ainda. Crie uma acima.
          </div>
        )}
        {savingsGoals.map((goal) => {
          const saved = savedByGoal[goal.id] ?? 0;
          const pct = Math.min((saved / goal.target) * 100, 100);
          const done = saved >= goal.target;

          return (
            <div
              key={goal.id}
              className="bg-white border border-gray-200 rounded-2xl px-5 py-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    {goal.name}
                  </span>
                  {done && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                      concluída ✓
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(goal.id, goal.name, goal.target)}
                    className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteSavingsGoal(goal.id)}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>

              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${done ? "bg-emerald-500" : "bg-blue-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-400">
                <span>
                  Poupado:{" "}
                  <span className="text-blue-600 font-medium">
                    {fmt(saved)}
                  </span>
                </span>
                <span>
                  {pct.toFixed(0)}% de {fmt(goal.target)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
