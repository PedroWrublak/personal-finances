"use client";

import { useState } from "react";
import { useFinanceStore } from "@/store/finance";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type TxType = "income" | "expense" | "savings";

const emptyForm = {
  type: "expense" as TxType,
  categoryId: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
};

const typeConfig: Record<TxType, { label: string; active: string; sign: string; badge: string }> = {
  income:  { label: "Receita",   active: "bg-emerald-50 border-emerald-200 text-emerald-700", sign: "+", badge: "bg-emerald-50 text-emerald-700" },
  expense: { label: "Despesa",   active: "bg-red-50 border-red-200 text-red-700",             sign: "−", badge: "bg-red-50 text-red-600"        },
  savings: { label: "Poupança",  active: "bg-blue-50 border-blue-200 text-blue-700",          sign: "↗", badge: "bg-blue-50 text-blue-600"      },
};

export default function TransactionsPage() {
  const budgets           = useFinanceStore((s) => s.budgets);
  const savingsGoals      = useFinanceStore((s) => s.savingsGoals);
  const transactions      = useFinanceStore((s) => s.transactions);
  const addTransaction    = useFinanceStore((s) => s.addTransaction);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [error, setError]       = useState("");

  const budgetMap  = Object.fromEntries(budgets.map((b) => [b.id, b.name]));
  const savingsMap = Object.fromEntries(savingsGoals.map((g) => [g.id, g.name]));

  function validate() {
    if (form.type === "expense" && !form.categoryId) return "Selecione uma categoria.";
    if (form.type === "savings" && !form.categoryId) return "Selecione uma meta de poupança.";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      return "Valor deve ser maior que zero.";
    if (!form.date) return "Data é obrigatória.";
    return "";
  }

  function handleSave() {
    const err = validate();
    if (err) { setError(err); return; }

    addTransaction({
      type:       form.type,
      categoryId: form.type === "income" ? "income" : form.categoryId,
      amount:     Number(form.amount),
      date:       new Date(form.date + "T12:00:00").toISOString(),
      note:       form.note.trim() || undefined,
    });
    setShowForm(false);
    setForm(emptyForm);
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setForm(emptyForm);
    setError("");
  }

  function getCategoryLabel(t: { type: TxType; categoryId: string }) {
    if (t.type === "income")  return "Receita";
    if (t.type === "savings") return savingsMap[t.categoryId] ?? "Poupança";
    return budgetMap[t.categoryId] ?? "—";
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Transações</h1>
          <p className="text-sm text-gray-400 mt-0.5">Registre receitas, despesas e poupança</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(""); }}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
        >
          <span className="text-base leading-none">+</span> Nova transação
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
          <p className="text-sm font-medium text-gray-700 mb-4">Nova transação</p>
          <div className="flex flex-col gap-3">

            {/* Type selector */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tipo</label>
              <div className="flex gap-2">
                {(["expense", "income", "savings"] as TxType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, type: t, categoryId: "" }))}
                    className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${
                      form.type === t
                        ? typeConfig[t].active
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {typeConfig[t].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category selector for expenses */}
            {form.type === "expense" && (
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Categoria</label>
                {budgets.length === 0 ? (
                  <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">
                    Nenhuma categoria cadastrada. Crie uma em Orçamentos primeiro.
                  </p>
                ) : (
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white"
                  >
                    <option value="">Selecione...</option>
                    {budgets.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Goal selector for savings */}
            {form.type === "savings" && (
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Meta de poupança</label>
                {savingsGoals.length === 0 ? (
                  <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">
                    Nenhuma meta cadastrada. Crie uma em Poupança primeiro.
                  </p>
                ) : (
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-400 bg-white"
                  >
                    <option value="">Selecione...</option>
                    {savingsGoals.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Valor (R$)</label>
                <input
                  type="number"
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Data</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Observação (opcional)</label>
              <input
                type="text"
                placeholder="Ex: Mercado semanal"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
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
        {transactions.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            Nenhuma transação ainda. Registre uma acima.
          </div>
        )}
        {transactions.map((t) => {
          const cfg      = typeConfig[t.type];
          const date     = new Date(t.date).toLocaleDateString("pt-BR");
          const category = getCategoryLabel(t);

          return (
            <div key={t.id} className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.badge}`}>
                      {category}
                    </span>
                    {t.note && <span className="text-xs text-gray-400">{t.note}</span>}
                  </div>
                  <span className="text-xs text-gray-400">{date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${
                    t.type === "income"  ? "text-emerald-700" :
                    t.type === "savings" ? "text-blue-600"    : "text-red-600"
                  }`}>
                    {cfg.sign} {fmt(t.amount)}
                  </span>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}