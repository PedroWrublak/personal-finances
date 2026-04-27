"use client";

import { useFinanceStore } from "@/store/finance";
import { useState } from "react";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const emptyForm = { name: "", limit: "" };

export default function BudgetPage() {
  const budgets = useFinanceStore((s) => s.budgets);
  const addBudget = useFinanceStore((s) => s.addBudget);
  const updateBudget = useFinanceStore((s) => s.updateBudget);
  const deleteBudget = useFinanceStore((s) => s.deleteBudget);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(id: string, name: string, limit: number) {
    setEditingId(id);
    setForm({ name, limit: String(limit) });
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
      isNaN(Number(form.limit)) ||
      form.limit === "" ||
      Number(form.limit) <= 0
    )
      return "Limite deve ser maior que zero.";
    return "";
  }

  function handleSave() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    const payload = { name: form.name.trim(), limit: Number(form.limit) };
    if (editingId) {
      updateBudget(editingId, payload);
    } else {
      addBudget(payload);
    }
    closeForm();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6  mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Orçamentos</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Defina os limites por categoria
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
        >
          <span className="text-base leading-none">+</span> Nova categoria
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
          <p className="text-sm font-medium text-gray-700 mb-4">
            {editingId ? "Editar categoria" : "Nova categoria"}
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nome</label>
              <input
                type="text"
                placeholder="Ex: Alimentação"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Limite mensal (R$)
              </label>
              <input
                type="number"
                placeholder="0"
                min="1"
                value={form.limit}
                onChange={(e) =>
                  setForm((f) => ({ ...f, limit: e.target.value }))
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

      <div className="flex flex-col gap-3">
        {budgets.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            Nenhuma categoria ainda. Crie uma acima.
          </div>
        )}
        {budgets.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-2xl px-5 py-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">
                {item.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {fmt(item.limit)}
                  <span className="text-xs text-gray-400">/mês</span>
                </span>
                <button
                  onClick={() => openEdit(item.id, item.name, item.limit)}
                  className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteBudget(item.id)}
                  className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
