import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  X,
  Trash2,
  LayoutGrid,
  ListChecks,
  Repeat,
  Shield,
  Target,
  Landmark,
  History,
  Pencil,
  Link2,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ---------- tokens ----------
const INK = "#0B2126";
const PAPER = "#F1F3EE";
const PAPER_RAISED = "#FFFFFF";
const LINE = "#D8DCD3";
const MUTED = "#65706A";
const SIDEBAR_W = 232;
const ACCENT_FROM = "#22D9A8";
const ACCENT_TO = "#8FFBB0";
const ACCENT_GRADIENT = `linear-gradient(90deg, ${ACCENT_FROM}, ${ACCENT_TO})`;
const CIFRA_LOGO = "data:image/png;base64,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";

const TYPE_CONFIG = {
  entrada: { label: "Entrada", plural: "Entradas", color: "#2F7A4D", soft: "#E4F1E9", Icon: TrendingUp },
  saida: { label: "Saída", plural: "Saídas", color: "#B23A2E", soft: "#F8E8E5", Icon: TrendingDown },
  investimento: { label: "Investimento", plural: "Investimentos", color: "#A9821F", soft: "#F5EEDA", Icon: PiggyBank },
};

const CATEGORIES = {
  entrada: ["Salário", "Freelance", "Reembolso", "Outros"],
  saida: ["Moradia", "Contas", "Alimentação", "Transporte", "Lazer", "Saúde", "Outros"],
  investimento: ["Renda fixa", "Ações", "Fundos", "Reserva de emergência"],
};

const NAV_ITEMS = [
  { key: "geral", label: "Visão geral", icon: LayoutGrid },
  { key: "obrigacoes", label: "Obrigações", icon: ListChecks },
  { key: "reserva", label: "Reserva de emergência", icon: Shield },
  { key: "metas", label: "Metas", icon: Target },
  { key: "investimento", label: "Investimentos", icon: TrendingUp },
  { key: "patrimonio", label: "Patrimônio", icon: Landmark },
  { key: "historico", label: "Histórico", icon: History },
];

const NAV_DESCRIPTIONS = {
  historico: "Resumos mensais e filtros",
  obrigacoes: "Entradas e despesas fixas e variáveis",
  reserva: "Progresso da sua reserva",
  metas: "Acompanhe seus objetivos",
  investimento: "Carteira e aportes",
  patrimonio: "Ativos, passivos e patrimônio líquido",
};

const MONTH_KEY = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const USER_NAME = "Lorenzo";

function formatBRL(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// ---------- seeds ----------
function seedData() {
  const now = new Date();
  const mk = (monthsAgo, day, type, category, description, amount, nature, sourceTemplateId) => {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
    return {
      id: `${monthsAgo}-${day}-${description}`.replace(/\s+/g, ""),
      date: d.toISOString(), type, category, description, amount,
      nature: nature || null, sourceTemplateId: sourceTemplateId || null,
    };
  };
  return [
    mk(2, 5, "entrada", "Salário", "Salário", 6200, "fixa", "tpl-salario"),
    mk(2, 10, "saida", "Moradia", "Aluguel", 1800, "fixa", "tpl-aluguel"),
    mk(2, 14, "saida", "Alimentação", "Supermercado", 640, "variavel"),
    mk(2, 20, "investimento", "Reserva de emergência", "Aporte reserva", 500),
    mk(1, 5, "entrada", "Salário", "Salário", 6200, "fixa", "tpl-salario"),
    mk(1, 10, "saida", "Moradia", "Aluguel", 1800, "fixa", "tpl-aluguel"),
    mk(1, 15, "saida", "Transporte", "Combustível", 320, "variavel"),
    mk(1, 22, "investimento", "Ações", "Aporte carteira", 700),
    mk(0, 5, "entrada", "Salário", "Salário", 6200, "fixa", "tpl-salario"),
    mk(0, 9, "saida", "Moradia", "Aluguel", 1800, "fixa", "tpl-aluguel"),
    mk(0, 19, "saida", "Lazer", "Janta no shopping", 250, "variavel"),
    mk(0, 21, "investimento", "Reserva de emergência", "Aporte reserva", 600),
  ];
}
function seedTemplates() {
  return [
    { id: "tpl-salario", type: "entrada", category: "Salário", description: "Salário", amount: 6200, day: 5 },
    { id: "tpl-aluguel", type: "saida", category: "Moradia", description: "Aluguel", amount: 1800, day: 10 },
    { id: "tpl-luz", type: "saida", category: "Contas", description: "Luz", amount: 300, day: 12 },
    { id: "tpl-internet", type: "saida", category: "Contas", description: "Internet", amount: 120, day: 15 },
    { id: "tpl-academia", type: "saida", category: "Saúde", description: "Academia", amount: 150, day: 8 },
  ];
}
function seedGoals() {
  return [
    { id: "g1", name: "Viagem de férias", target: 8000, saved: 2200 },
    { id: "g2", name: "Troca de carro", target: 35000, saved: 9000 },
  ];
}
function seedAssets() {
  return [
    { id: "a1", name: "Conta corrente", value: 4200, kind: "ativo" },
    { id: "a2", name: "Financiamento do imóvel", value: 180000, kind: "passivo" },
  ];
}

const MOCK_BANKS = [
  { name: "Nubank", color: "#8A05BE" },
  { name: "Itaú", color: "#EC7000" },
  { name: "Bradesco", color: "#CC092F" },
  { name: "Banco do Brasil", color: "#F7DC05" },
  { name: "Caixa", color: "#0033A0" },
  { name: "Inter", color: "#FF7A00" },
];

function seedConnectedAccounts() {
  return [
    { id: "acc-nubank", bank: "Nubank", color: "#8A05BE", type: "Conta corrente", last4: "2481", balance: 3240.55, lastSync: new Date().toISOString() },
  ];
}

export default function FinanceDashboard() {
  const [section, setSection] = useState("geral");
  const [transactions, setTransactions] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [goals, setGoals] = useState([]);
  const [assets, setAssets] = useState([]);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [modalConfig, setModalConfig] = useState(null); // { type, nature, category }
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [assetModalOpen, setAssetModalOpen] = useState(null); // 'ativo' | 'passivo' | null
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editingTx, setEditingTx] = useState(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  useEffect(() => {
    const load = (key, seedFn) => {
      try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : null;
        return parsed && (Array.isArray(parsed) ? parsed.length : true) ? parsed : seedFn();
      } catch (e) {
        return seedFn();
      }
    };
    setTransactions(load("cifra_transactions", seedData));
    setTemplates(load("cifra_templates", seedTemplates));
    setGoals(load("cifra_goals", seedGoals));
    setAssets(load("cifra_assets", seedAssets));
    setConnectedAccounts(load("cifra_connected_accounts", seedConnectedAccounts));
    setLoaded(true);
  }, []);

  useEffect(() => { if (loaded) { try { localStorage.setItem("cifra_transactions", JSON.stringify(transactions)); } catch (e) {} } }, [transactions, loaded]);
  useEffect(() => { if (loaded) { try { localStorage.setItem("cifra_templates", JSON.stringify(templates)); } catch (e) {} } }, [templates, loaded]);
  useEffect(() => { if (loaded) { try { localStorage.setItem("cifra_goals", JSON.stringify(goals)); } catch (e) {} } }, [goals, loaded]);
  useEffect(() => { if (loaded) { try { localStorage.setItem("cifra_assets", JSON.stringify(assets)); } catch (e) {} } }, [assets, loaded]);
  useEffect(() => { if (loaded) { try { localStorage.setItem("cifra_connected_accounts", JSON.stringify(connectedAccounts)); } catch (e) {} } }, [connectedAccounts, loaded]);

  // gera automaticamente o lançamento do mês para cada modelo fixo, se ainda não existir
  useEffect(() => {
    if (!loaded) return;
    const key = MONTH_KEY(cursor);
    const missing = templates.filter(
      (tpl) => !transactions.some((t) => t.sourceTemplateId === tpl.id && MONTH_KEY(new Date(t.date)) === key)
    );
    if (missing.length === 0) return;
    const additions = missing.map((tpl) => {
      const day = Math.min(tpl.day, daysInMonth(cursor.getFullYear(), cursor.getMonth()));
      const d = new Date(cursor.getFullYear(), cursor.getMonth(), day, 12);
      return {
        id: `${tpl.id}-${key}`, date: d.toISOString(), type: tpl.type, category: tpl.category,
        description: tpl.description, amount: tpl.amount, nature: "fixa", sourceTemplateId: tpl.id,
      };
    });
    setTransactions((prev) => [...prev, ...additions]);
  }, [templates, cursor, loaded]);

  const monthLabel = cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const monthTx = useMemo(() => {
    const key = MONTH_KEY(cursor);
    return transactions.filter((t) => MONTH_KEY(new Date(t.date)) === key).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, cursor]);

  const totals = useMemo(() => {
    const t = { entrada: 0, saida: 0, investimento: 0 };
    monthTx.forEach((tx) => { t[tx.type] += tx.amount; });
    return t;
  }, [monthTx]);

  const saldo = totals.entrada - totals.saida;

  const chartData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) months.push(new Date(cursor.getFullYear(), cursor.getMonth() - i, 1));
    return months.map((d) => {
      const key = MONTH_KEY(d);
      const sums = { entrada: 0, saida: 0 };
      transactions.forEach((t) => { if (MONTH_KEY(new Date(t.date)) === key) sums[t.type] = (sums[t.type] || 0) + t.amount; });
      return { mes: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""), Entradas: sums.entrada || 0, Saídas: sums.saida || 0 };
    });
  }, [transactions, cursor]);

  const investmentTx = useMemo(
    () => transactions.filter((t) => t.type === "investimento").sort((a, b) => new Date(b.date) - new Date(a.date)),
    [transactions]
  );
  const investedByCategory = useMemo(() => {
    const map = {};
    investmentTx.forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return map;
  }, [investmentTx]);
  const totalInvestedAllTime = useMemo(() => investmentTx.reduce((s, t) => s + t.amount, 0), [investmentTx]);
  const reservaSaved = investedByCategory["Reserva de emergência"] || 0;

  const rendaFixaMensal = useMemo(() => templates.filter((t) => t.type === "entrada").reduce((s, t) => s + t.amount, 0), [templates]);
  const despesasFixasMensal = useMemo(() => templates.filter((t) => t.type === "saida").reduce((s, t) => s + t.amount, 0), [templates]);
  const reservaIdeal = rendaFixaMensal * 6;
  const reservaFalta = Math.max(0, reservaIdeal - reservaSaved);
  const mesesCobertos = despesasFixasMensal > 0 ? reservaSaved / despesasFixasMensal : 0;
  const reservaTx = useMemo(
    () => investmentTx.filter((t) => t.category === "Reserva de emergência"),
    [investmentTx]
  );

  const totalAtivosManual = assets.filter((a) => a.kind === "ativo").reduce((s, a) => s + a.value, 0);
  const totalPassivos = assets.filter((a) => a.kind === "passivo").reduce((s, a) => s + a.value, 0);
  const patrimonioLiquido = totalInvestedAllTime + totalAtivosManual - totalPassivos;

  function goMonth(delta) { setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1)); }
  function removeTx(id) { setTransactions((prev) => prev.filter((t) => t.id !== id)); }
  function removeTemplate(id) { setTemplates((prev) => prev.filter((t) => t.id !== id)); }

  function saveTemplateEdit(updated) {
    setTemplates((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
    setTransactions((prev) =>
      prev.map((t) =>
        t.sourceTemplateId === updated.id
          ? { ...t, description: updated.description, category: updated.category, amount: updated.amount }
          : t
      )
    );
    setEditingTemplate(null);
  }

  function saveTxEdit(updated) {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === updated.id
          ? { ...t, description: updated.description, category: updated.category, amount: updated.amount, date: new Date(updated.date + "T12:00:00").toISOString() }
          : t
      )
    );
    setEditingTx(null);
  }

  function handleModalSubmit({ nature, ...payload }) {
    if (nature === "fixa" && (payload.type === "entrada" || payload.type === "saida")) {
      const tplId = `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setTemplates((prev) => [...prev, { id: tplId, type: payload.type, category: payload.category, description: payload.description, amount: payload.amount, day: payload.day }]);
      const key = MONTH_KEY(cursor);
      const day = Math.min(payload.day, daysInMonth(cursor.getFullYear(), cursor.getMonth()));
      const d = new Date(cursor.getFullYear(), cursor.getMonth(), day, 12);
      setTransactions((prev) => [...prev, { id: `${tplId}-${key}`, date: d.toISOString(), type: payload.type, category: payload.category, description: payload.description, amount: payload.amount, nature: "fixa", sourceTemplateId: tplId }]);
    } else {
      setTransactions((prev) => [...prev, {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        date: new Date(payload.date + "T12:00:00").toISOString(),
        type: payload.type, category: payload.category, description: payload.description, amount: payload.amount,
        nature: payload.type === "investimento" ? null : "variavel", sourceTemplateId: null,
      }]);
    }
    setModalConfig(null);
  }

  function addGoal(goal) { setGoals((prev) => [...prev, goal]); setGoalModalOpen(false); }
  function removeGoal(id) { setGoals((prev) => prev.filter((g) => g.id !== id)); }
  function contributeGoal(id, amount) {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, saved: g.saved + amount } : g)));
  }
  function addAsset(asset) { setAssets((prev) => [...prev, asset]); setAssetModalOpen(null); }
  function removeAsset(id) { setAssets((prev) => prev.filter((a) => a.id !== id)); }

  function connectBank(bank) {
    setConnectedAccounts((prev) => [...prev, {
      id: `acc-${Date.now()}`, bank: bank.name, color: bank.color, type: "Conta corrente",
      last4: String(Math.floor(1000 + Math.random() * 9000)),
      balance: Math.round((500 + Math.random() * 6000) * 100) / 100,
      lastSync: new Date().toISOString(),
    }]);
    setConnectModalOpen(false);
  }

  function disconnectAccount(id) {
    setConnectedAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  function syncAccount(account) {
    const mockDescriptions = ["Compra no débito", "Pix recebido", "Assinatura de streaming", "Transferência"];
    const desc = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
    const isEntrada = desc === "Pix recebido";
    const amount = Math.round((15 + Math.random() * 220) * 100) / 100;
    const newTx = {
      id: `of-${Date.now()}`,
      date: new Date().toISOString(),
      type: isEntrada ? "entrada" : "saida",
      category: isEntrada ? "Reembolso" : "Outros",
      description: `${desc} · ${account.bank}`,
      amount,
      nature: "variavel",
      sourceTemplateId: null,
      source: "open_finance",
    };
    setTransactions((prev) => [...prev, newTx]);
    setConnectedAccounts((prev) => prev.map((a) => (a.id === account.id ? { ...a, lastSync: new Date().toISOString() } : a)));
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: PAPER, minHeight: "100vh", color: INK, display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .amount-mono { font-family: 'IBM Plex Mono', monospace; }
        .tx-row:hover .tx-delete { opacity: 1; }
        input, select { font-family: 'Inter', sans-serif; }
      `}</style>

      <Sidebar section={section} setSection={setSection} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "26px 24px 60px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600 }}>
              {NAV_ITEMS.find((n) => n.key === section)?.label}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => goMonth(-1)} aria-label="Mês anterior" style={navBtnStyle}><ChevronLeft size={18} /></button>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 16, minWidth: 140, textAlign: "center", textTransform: "capitalize" }}>{monthLabel}</span>
              <button onClick={() => goMonth(1)} aria-label="Próximo mês" style={navBtnStyle}><ChevronRight size={18} /></button>
            </div>
          </div>

          {section === "geral" && (
            <VisaoGeralSection saldo={saldo} totals={totals} monthTx={monthTx} onNavigate={setSection}
              connectedAccounts={connectedAccounts} onConnect={() => setConnectModalOpen(true)}
              onSync={syncAccount} onDisconnect={disconnectAccount} />
          )}

          {section === "historico" && (
            <HistoricoSection monthTx={monthTx} chartData={chartData} />
          )}

          {section === "obrigacoes" && (
            <ObrigacoesSection templates={templates} monthTx={monthTx} onRemoveTemplate={removeTemplate} onRemoveTx={removeTx}
              onEditTemplate={setEditingTemplate} onEditTx={setEditingTx}
              onAddFixa={(type) => setModalConfig({ type, nature: "fixa" })}
              onAddVariavel={(type) => setModalConfig({ type, nature: "variavel" })} />
          )}

          {section === "reserva" && (
            <ReservaSection saved={reservaSaved} idealReserve={reservaIdeal} falta={reservaFalta}
              rendaFixaMensal={rendaFixaMensal} mesesCobertos={mesesCobertos} despesasFixasMensal={despesasFixasMensal}
              aportes={reservaTx} onRemoveAporte={removeTx}
              onAporte={() => setModalConfig({ type: "investimento", nature: null, category: "Reserva de emergência" })} />
          )}

          {section === "metas" && (
            <MetasSection goals={goals} onAdd={() => setGoalModalOpen(true)} onRemove={removeGoal} onContribute={contributeGoal} />
          )}

          {section === "investimento" && (
            <InvestimentoSection total={totalInvestedAllTime} byCategory={investedByCategory} items={investmentTx.slice(0, 12)}
              onAdd={() => setModalConfig({ type: "investimento", nature: null })} />
          )}

          {section === "patrimonio" && (
            <PatrimonioSection assets={assets} totalInvestido={totalInvestedAllTime} totalAtivos={totalAtivosManual}
              totalPassivos={totalPassivos} patrimonioLiquido={patrimonioLiquido}
              onAddAtivo={() => setAssetModalOpen("ativo")} onAddPassivo={() => setAssetModalOpen("passivo")}
              onRemove={removeAsset} />
          )}
        </div>
      </div>

      {modalConfig && (
        <TxModal initialType={modalConfig.type} initialNature={modalConfig.nature} initialCategory={modalConfig.category}
          cursor={cursor} onClose={() => setModalConfig(null)} onSubmit={handleModalSubmit} />
      )}
      {goalModalOpen && <GoalModal onClose={() => setGoalModalOpen(false)} onSubmit={addGoal} />}
      {assetModalOpen && <AssetModal kind={assetModalOpen} onClose={() => setAssetModalOpen(null)} onSubmit={addAsset} />}
      {editingTemplate && <EditTemplateModal template={editingTemplate} onClose={() => setEditingTemplate(null)} onSubmit={saveTemplateEdit} />}
      {editingTx && <EditTxModal tx={editingTx} onClose={() => setEditingTx(null)} onSubmit={saveTxEdit} />}
      {connectModalOpen && <ConnectBankModal onClose={() => setConnectModalOpen(false)} onConnect={connectBank} />}
    </div>
  );
}

// ---------------- Sidebar ----------------
function Sidebar({ section, setSection }) {
  return (
    <div style={{ width: SIDEBAR_W, flexShrink: 0, background: INK, color: PAPER, minHeight: "100vh", padding: "22px 14px" }}>
      <div style={{ padding: "0 4px", marginBottom: 28 }}>
        <img src={CIFRA_LOGO} alt="Cifra — Seu dinheiro, mais claro." style={{ width: "100%", maxWidth: 176, display: "block" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const active = section === item.key;
          const ItemIcon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              style={{
                display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                padding: "10px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                background: active ? "rgba(143,251,176,0.1)" : "transparent",
                color: active ? ACCENT_TO : "#AEB8AF",
                borderLeft: active ? `2px solid ${ACCENT_FROM}` : "2px solid transparent",
                fontSize: 13.5, fontWeight: active ? 600 : 500,
              }}
            >
              <ItemIcon size={16} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Visão geral ----------------
function VisaoGeralSection({ saldo, totals, monthTx, onNavigate, connectedAccounts, onConnect, onSync, onDisconnect }) {
  return (
    <>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 16 }}>
        Olá, {USER_NAME}
      </div>

      <div style={{ background: INK, color: PAPER, borderRadius: 6, padding: "26px 28px", marginBottom: 18, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 13, color: "#AEB8AF", marginBottom: 6 }}>Saldo do mês</div>
          <div className="amount-mono" style={{ fontFamily: "'Fraunces', serif", fontSize: 40, lineHeight: 1.1 }}>{formatBRL(saldo)}</div>
        </div>
        <SaldoPieChart totals={totals} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 22 }}>
        <StatCard type="entrada" value={totals.entrada} count={monthTx.filter((t) => t.type === "entrada").length} />
        <StatCard type="saida" value={totals.saida} count={monthTx.filter((t) => t.type === "saida").length} />
        <StatCard type="investimento" value={totals.investimento} count={monthTx.filter((t) => t.type === "investimento").length} />
      </div>

      <OpenFinancePanel accounts={connectedAccounts} onConnect={onConnect} onSync={onSync} onDisconnect={onDisconnect} />

      <div style={{ fontSize: 13, color: MUTED, marginBottom: 10 }}>Acesso rápido</div>
      <QuickAccessGrid onNavigate={onNavigate} />
    </>
  );
}

function OpenFinancePanel({ accounts, onConnect, onSync, onDisconnect }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 600 }}>
            <Link2 size={14} color={MUTED} /> Contas conectadas
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
            Simulação de Open Finance — nenhuma conexão real é feita
          </div>
        </div>
        <button onClick={onConnect} style={addBtnStyle}><Plus size={15} /> Conectar conta</button>
      </div>

      {accounts.length === 0 ? (
        <div style={{ background: PAPER_RAISED, border: `1px dashed ${LINE}`, borderRadius: 6, padding: "22px 16px", textAlign: "center", color: MUTED, fontSize: 13 }}>
          Nenhuma conta conectada. Conecte um banco para trazer lançamentos automaticamente.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {accounts.map((acc) => (
            <div key={acc.id} className="tx-row" style={{ background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, padding: "14px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: acc.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff", fontSize: 13, fontWeight: 600 }}>
                  {acc.bank.charAt(0)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{acc.bank}</div>
                  <div style={{ fontSize: 11.5, color: MUTED }}>{acc.type} · final {acc.last4}</div>
                </div>
              </div>
              <div className="amount-mono" style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>{formatBRL(acc.balance)}</div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 10 }}>
                Sincronizado {new Date(acc.lastSync).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => onSync(acc)} style={{ ...addBtnStyle, flex: 1, justifyContent: "center", padding: "6px 8px" }}>
                  <RefreshCw size={13} /> Sincronizar
                </button>
                <button className="tx-delete" onClick={() => onDisconnect(acc.id)} aria-label="Desconectar conta" style={{ ...deleteBtnStyle, opacity: 1, border: `1px solid ${LINE}`, borderRadius: 6 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const PIE_COLORS = {
  entrada: ACCENT_FROM,
  saida: "#F2735F",
  investimento: "#E8C468",
};

function SaldoPieChart({ totals }) {
  const data = [
    { key: "entrada", name: "Entradas", value: totals.entrada },
    { key: "saida", name: "Saídas", value: totals.saida },
    { key: "investimento", name: "Investido", value: totals.investimento },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return <div style={{ fontSize: 12, color: "#AEB8AF", maxWidth: 160 }}>Sem lançamentos neste mês ainda.</div>;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 96, height: 96, flexShrink: 0 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={26} outerRadius={44} paddingAngle={2} stroke="none">
              {data.map((d) => <Cell key={d.key} fill={PIE_COLORS[d.key]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {data.map((d) => (
          <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[d.key], display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#C7CFC8" }}>{d.name}</span>
            <span className="amount-mono" style={{ fontSize: 12, fontWeight: 500 }}>{formatBRL(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickAccessGrid({ onNavigate }) {
  const items = NAV_ITEMS.filter((i) => i.key !== "geral");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
      {items.map((item) => {
        const ItemIcon = item.icon;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            style={{
              display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6,
              padding: "14px 16px", cursor: "pointer",
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 7, background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ItemIcon size={16} color={INK} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{item.label}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{NAV_DESCRIPTIONS[item.key]}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ---------------- Histórico ----------------
function HistoricoSection({ monthTx, chartData }) {
  const [filterType, setFilterType] = useState("todos");
  const [filterCategory, setFilterCategory] = useState("todas");

  const categoryOptions = filterType === "todos" ? [] : CATEGORIES[filterType];

  function changeType(v) {
    setFilterType(v);
    setFilterCategory("todas");
  }

  const filtered = monthTx.filter(
    (t) => (filterType === "todos" || t.type === filterType) && (filterCategory === "todas" || t.category === filterCategory)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, padding: "18px 18px 6px" }}>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>Entradas x saídas — últimos 6 meses</div>
        <div style={{ width: "100%", height: 180 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={LINE} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} width={54} />
              <Tooltip formatter={(v) => formatBRL(v)} contentStyle={{ borderRadius: 6, border: `1px solid ${LINE}`, fontSize: 12 }} />
              <Bar dataKey="Entradas" fill={TYPE_CONFIG.entrada.color} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Saídas" fill={TYPE_CONFIG.saida.color} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 13, color: MUTED }}>Lançamentos do mês selecionado</span>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={filterType} onChange={(e) => changeType(e.target.value)} style={inputStyle}>
            <option value="todos">Todos os tipos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
            <option value="investimento">Investimentos</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} disabled={filterType === "todos"} style={{ ...inputStyle, opacity: filterType === "todos" ? 0.5 : 1 }}>
            <option value="todas">Todas as categorias</option>
            {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <TxList items={filtered} onRemove={() => {}} emptyText="Nenhum lançamento encontrado com esses filtros." showNatureBadge hideDelete />
    </div>
  );
}

// ---------------- Obrigações ----------------
function ObrigacoesSection({ templates, monthTx, onRemoveTemplate, onRemoveTx, onEditTemplate, onEditTx, onAddFixa, onAddVariavel }) {
  const entradasFixas = templates.filter((t) => t.type === "entrada");
  const despesasFixas = templates.filter((t) => t.type === "saida");
  const entradasVariaveis = monthTx.filter((t) => t.type === "entrada" && t.nature === "variavel");
  const despesasVariaveis = monthTx.filter((t) => t.type === "saida" && t.nature === "variavel");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      <div>
        <SectionHeader icon={Repeat} title="Entradas fixas" subtitle="Salários e recebimentos que se repetem todo mês" onAdd={() => onAddFixa("entrada")} addLabel="Nova entrada fixa" />
        <TemplateList items={entradasFixas} type="entrada" onRemove={onRemoveTemplate} onEdit={onEditTemplate} />
      </div>
      <div>
        <SectionHeader title="Entradas variáveis" subtitle="Extras e freelas recebidos neste mês" onAdd={() => onAddVariavel("entrada")} addLabel="Nova entrada variável" />
        <TxList items={entradasVariaveis} onRemove={onRemoveTx} onEdit={onEditTx} emptyText="Nenhuma entrada variável neste mês ainda." />
      </div>
      <div>
        <SectionHeader icon={Repeat} title="Despesas fixas" subtitle="Contas recorrentes, como aluguel e assinaturas" onAdd={() => onAddFixa("saida")} addLabel="Nova despesa fixa" />
        <TemplateList items={despesasFixas} type="saida" onRemove={onRemoveTemplate} onEdit={onEditTemplate} />
      </div>
      <div>
        <SectionHeader title="Despesas variáveis" subtitle="Gastos pontuais deste mês" onAdd={() => onAddVariavel("saida")} addLabel="Nova despesa variável" />
        <TxList items={despesasVariaveis} onRemove={onRemoveTx} onEdit={onEditTx} emptyText="Nenhuma despesa variável neste mês ainda." />
      </div>
    </div>
  );
}

// ---------------- Reserva de emergência ----------------
function ReservaSection({ saved, idealReserve, falta, rendaFixaMensal, mesesCobertos, despesasFixasMensal, aportes, onRemoveAporte, onAporte }) {
  const pct = idealReserve > 0 ? Math.min(100, (saved / idealReserve) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: INK, color: PAPER, borderRadius: 6, padding: "26px 28px" }}>
        <div style={{ fontSize: 13, color: "#AEB8AF", marginBottom: 6 }}>Reserva acumulada</div>
        <div className="amount-mono" style={{ fontFamily: "'Fraunces', serif", fontSize: 36, lineHeight: 1.1 }}>{formatBRL(saved)}</div>
        <div style={{ marginTop: 14, height: 8, borderRadius: 4, background: "rgba(241,243,238,0.18)", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#A9821F" }} />
        </div>
        <div style={{ fontSize: 12, color: "#C7CFC8", marginTop: 8 }}>
          {pct.toFixed(0)}% da reserva ideal · faltam {formatBRL(falta)} para chegar em {formatBRL(idealReserve)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220, background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, padding: "14px 16px" }}>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Reserva ideal (calculada automaticamente)</div>
          <div className="amount-mono" style={{ fontSize: 20, fontWeight: 500 }}>{formatBRL(idealReserve)}</div>
          <div style={{ fontSize: 11.5, color: MUTED, marginTop: 8 }}>
            6x sua renda fixa mensal ({formatBRL(rendaFixaMensal)}). Cadastre suas entradas fixas em Obrigações para ajustar esse valor.
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220, background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Despesas fixas mensais</div>
            <div className="amount-mono" style={{ fontSize: 18, fontWeight: 500 }}>{formatBRL(despesasFixasMensal)}</div>
            <div style={{ fontSize: 11.5, color: MUTED, marginTop: 4 }}>Cobre ~{mesesCobertos.toFixed(1)} meses de despesas fixas</div>
          </div>
          <button onClick={onAporte} style={{ ...addBtnStyle, marginTop: 12, justifyContent: "center" }}><Plus size={15} /> Registrar aporte</button>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 10 }}>Histórico de aportes</div>
        <TxList items={aportes} onRemove={onRemoveAporte} emptyText="Nenhum aporte registrado ainda." />
      </div>
    </div>
  );
}

// ---------------- Metas ----------------
function MetasSection({ goals, onAdd, onRemove, onContribute }) {
  return (
    <div>
      <SectionHeader title="Suas metas financeiras" subtitle="Defina um objetivo, acompanhe o progresso e registre aportes" onAdd={onAdd} addLabel="Nova meta" />
      {goals.length === 0 && (
        <div style={{ padding: "22px 16px", textAlign: "center", color: MUTED, fontSize: 13, background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6 }}>
          Nenhuma meta cadastrada ainda.
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {goals.map((g) => <GoalCard key={g.id} goal={g} onRemove={() => onRemove(g.id)} onContribute={(v) => onContribute(g.id, v)} />)}
      </div>
    </div>
  );
}

function GoalCard({ goal, onRemove, onContribute }) {
  const [amount, setAmount] = useState("");
  const pct = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
  return (
    <div style={{ background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{goal.name}</div>
          <div className="amount-mono" style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{formatBRL(goal.saved)} de {formatBRL(goal.target)}</div>
        </div>
        <button onClick={onRemove} aria-label="Remover meta" style={{ border: "none", background: "transparent", cursor: "pointer", color: MUTED }}><Trash2 size={15} /></button>
      </div>
      <div style={{ marginTop: 12, height: 7, borderRadius: 4, background: LINE, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#2F7A4D" }} />
      </div>
      <div style={{ fontSize: 12, color: MUTED, marginTop: 6, marginBottom: 12 }}>{pct.toFixed(0)}% concluído</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor do aporte" inputMode="decimal" style={{ ...inputStyle, flex: 1 }} />
        <button
          onClick={() => { const v = parseFloat(amount.replace(",", ".")); if (v > 0) { onContribute(v); setAmount(""); } }}
          style={addBtnStyle}
        >Adicionar aporte</button>
      </div>
    </div>
  );
}

// ---------------- Investimentos ----------------
function InvestimentoSection({ total, byCategory, items, onAdd }) {
  const maxCat = Math.max(1, ...Object.values(byCategory));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: INK, color: PAPER, borderRadius: 6, padding: "26px 28px" }}>
        <div style={{ fontSize: 13, color: "#AEB8AF", marginBottom: 6 }}>Total investido (todo o período)</div>
        <div className="amount-mono" style={{ fontFamily: "'Fraunces', serif", fontSize: 36, lineHeight: 1.1 }}>{formatBRL(total)}</div>
      </div>

      <div style={{ background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, padding: "16px 18px" }}>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>Distribuição por categoria</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.keys(byCategory).length === 0 && <div style={{ fontSize: 13, color: MUTED }}>Nenhum investimento registrado ainda.</div>}
          {Object.entries(byCategory).map(([cat, val]) => (
            <div key={cat}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                <span>{cat}</span>
                <span className="amount-mono" style={{ color: MUTED }}>{formatBRL(val)}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: LINE, overflow: "hidden" }}>
                <div style={{ width: `${(val / maxCat) * 100}%`, height: "100%", background: TYPE_CONFIG.investimento.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: MUTED }}>Últimos aportes</span>
        <button onClick={onAdd} style={addBtnStyle}><Plus size={15} /> Novo investimento</button>
      </div>
      <TxList items={items} onRemove={() => {}} emptyText="Nenhum investimento registrado ainda." hideDelete />
    </div>
  );
}

// ---------------- Patrimônio ----------------
function PatrimonioSection({ assets, totalInvestido, totalAtivos, totalPassivos, patrimonioLiquido, onAddAtivo, onAddPassivo, onRemove }) {
  const ativos = assets.filter((a) => a.kind === "ativo");
  const passivos = assets.filter((a) => a.kind === "passivo");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: INK, color: PAPER, borderRadius: 6, padding: "26px 28px" }}>
        <div style={{ fontSize: 13, color: "#AEB8AF", marginBottom: 6 }}>Patrimônio líquido</div>
        <div className="amount-mono" style={{ fontFamily: "'Fraunces', serif", fontSize: 36, lineHeight: 1.1 }}>{formatBRL(patrimonioLiquido)}</div>
        <div style={{ display: "flex", gap: 22, marginTop: 16, flexWrap: "wrap" }}>
          <LegendPoint color="#2F7A4D" label="Ativos" value={formatBRL(totalAtivos + totalInvestido)} />
          <LegendPoint color="#B23A2E" label="Passivos" value={formatBRL(totalPassivos)} />
        </div>
      </div>

      <div>
        <SectionHeader title="Ativos" subtitle="Bens e valores que você possui" onAdd={onAddAtivo} addLabel="Novo ativo" />
        <div style={{ background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, overflow: "hidden" }}>
          <AssetRow name="Carteira de investimentos" value={totalInvestido} readOnly note="calculado a partir dos seus investimentos" first />
          {ativos.length === 0 && totalInvestido === 0 && <div style={{ padding: "16px", textAlign: "center", color: MUTED, fontSize: 13 }}>Nenhum outro ativo cadastrado.</div>}
          {ativos.map((a) => <AssetRow key={a.id} name={a.name} value={a.value} onRemove={() => onRemove(a.id)} />)}
        </div>
      </div>

      <div>
        <SectionHeader title="Passivos" subtitle="Dívidas e financiamentos em aberto" onAdd={onAddPassivo} addLabel="Novo passivo" />
        <div style={{ background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, overflow: "hidden" }}>
          {passivos.length === 0 && <div style={{ padding: "16px", textAlign: "center", color: MUTED, fontSize: 13 }}>Nenhum passivo cadastrado.</div>}
          {passivos.map((a, i) => <AssetRow key={a.id} name={a.name} value={a.value} onRemove={() => onRemove(a.id)} negative first={i === 0} />)}
        </div>
      </div>
    </div>
  );
}

function AssetRow({ name, value, onRemove, readOnly, note, negative, first }) {
  return (
    <div className="tx-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderTop: first ? "none" : `1px solid ${LINE}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{name}</div>
        {note && <div style={{ fontSize: 12, color: MUTED }}>{note}</div>}
      </div>
      <div className="amount-mono" style={{ fontSize: 14, color: negative ? "#B23A2E" : "#2F7A4D", fontWeight: 500 }}>{formatBRL(value)}</div>
      {!readOnly && (
        <button className="tx-delete" onClick={onRemove} aria-label="Remover" style={deleteBtnStyle}><Trash2 size={15} /></button>
      )}
    </div>
  );
}

// ---------------- componentes compartilhados ----------------
function SectionHeader({ icon: IconComp, title, subtitle, onAdd, addLabel }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 12, flexWrap: "wrap" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, fontWeight: 600 }}>
          {IconComp && <IconComp size={14} color={MUTED} />} {title}
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{subtitle}</div>
      </div>
      <button onClick={onAdd} style={addBtnStyle}><Plus size={15} /> {addLabel}</button>
    </div>
  );
}

function TemplateList({ items, type, onRemove, onEdit }) {
  const cfg = TYPE_CONFIG[type];
  const IconComp = cfg.Icon;
  return (
    <div style={{ background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, overflow: "hidden" }}>
      {items.length === 0 && <div style={{ padding: "22px 16px", textAlign: "center", color: MUTED, fontSize: 13 }}>Nenhum {type === "entrada" ? "recebimento fixo" : "gasto fixo"} cadastrado ainda.</div>}
      {items.map((t, i) => (
        <div key={t.id} className="tx-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderTop: i === 0 ? "none" : `1px solid ${LINE}` }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: cfg.soft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconComp size={15} color={cfg.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{t.description}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{t.category} · todo dia {t.day}</div>
          </div>
          <div className="amount-mono" style={{ fontSize: 14, color: cfg.color, fontWeight: 500, whiteSpace: "nowrap" }}>{formatBRL(t.amount)}</div>
          {onEdit && <button className="tx-delete" onClick={() => onEdit(t)} aria-label="Editar recorrência" style={deleteBtnStyle}><Pencil size={15} /></button>}
          <button className="tx-delete" onClick={() => onRemove(t.id)} aria-label="Remover recorrência" style={deleteBtnStyle}><Trash2 size={15} /></button>
        </div>
      ))}
    </div>
  );
}

function TxList({ items, onRemove, onEdit, emptyText, showNatureBadge, hideDelete }) {
  return (
    <div style={{ background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, overflow: "hidden" }}>
      {items.length === 0 && <div style={{ padding: "22px 16px", textAlign: "center", color: MUTED, fontSize: 13 }}>{emptyText}</div>}
      {items.map((t, i) => {
        const cfg = TYPE_CONFIG[t.type];
        const IconComp = cfg.Icon;
        const sign = t.type === "entrada" ? "+" : "-";
        return (
          <div key={t.id} className="tx-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderTop: i === 0 ? "none" : `1px solid ${LINE}` }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: cfg.soft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <IconComp size={15} color={cfg.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{t.description}</span>
                {t.source === "open_finance" && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, color: "#3D6FB4", background: "#E8EEF7", borderRadius: 4, padding: "1px 6px" }}>
                    <Link2 size={9} /> Open Finance
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>
                {t.category} · {new Date(t.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                {showNatureBadge && t.nature ? ` · ${t.nature === "fixa" ? "Fixa" : "Variável"}` : ""}
              </div>
            </div>
            <div className="amount-mono" style={{ fontSize: 14, color: cfg.color, fontWeight: 500, whiteSpace: "nowrap" }}>{sign} {formatBRL(t.amount)}</div>
            {onEdit && <button className="tx-delete" onClick={() => onEdit(t)} aria-label="Editar lançamento" style={deleteBtnStyle}><Pencil size={15} /></button>}
            {!hideDelete && <button className="tx-delete" onClick={() => onRemove(t.id)} aria-label="Remover lançamento" style={deleteBtnStyle}><Trash2 size={15} /></button>}
          </div>
        );
      })}
    </div>
  );
}

function LegendPoint({ color, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
      <span style={{ fontSize: 13, color: "#C7CFC8" }}>{label}</span>
      <span className="amount-mono" style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function StatCard({ type, value, count }) {
  const cfg = TYPE_CONFIG[type];
  const IconComp = cfg.Icon;
  return (
    <div style={{ background: PAPER_RAISED, border: `1px solid ${LINE}`, borderTopWidth: 3, borderTopColor: cfg.color, borderRadius: 6, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <IconComp size={15} color={cfg.color} />
        <span style={{ fontSize: 13, color: MUTED }}>{cfg.plural}</span>
      </div>
      <div className="amount-mono" style={{ fontSize: 20, fontWeight: 500, color: INK }}>{formatBRL(value)}</div>
      <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{count} lançamento{count === 1 ? "" : "s"}</div>
    </div>
  );
}

// ---------------- modais ----------------
function TxModal({ initialType, initialNature, initialCategory, cursor, onClose, onSubmit }) {
  const today = new Date();
  const defaultDate = today.getFullYear() === cursor.getFullYear() && today.getMonth() === cursor.getMonth()
    ? today : new Date(cursor.getFullYear(), cursor.getMonth(), 1);

  const [type, setType] = useState(initialType);
  const [nature, setNature] = useState(initialNature || "variavel");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(initialCategory || CATEGORIES[initialType][0]);
  const [date, setDate] = useState(defaultDate.toISOString().slice(0, 10));
  const [day, setDay] = useState(String(defaultDate.getDate()));

  useEffect(() => {
    setCategory((prev) => (CATEGORIES[type].includes(prev) ? prev : CATEGORIES[type][0]));
    if (type === "investimento") setNature(null);
    else if (!nature) setNature("variavel");
  }, [type]);

  function handleSubmit(e) {
    e.preventDefault();
    const parsedAmount = parseFloat(String(amount).replace(",", "."));
    if (!description.trim() || !parsedAmount || parsedAmount <= 0) return;
    if (nature === "fixa") {
      const parsedDay = Math.min(31, Math.max(1, parseInt(day, 10) || 1));
      onSubmit({ type, nature, category, description: description.trim(), amount: parsedAmount, day: parsedDay });
    } else {
      onSubmit({ type, nature, category, description: description.trim(), amount: parsedAmount, date });
    }
  }

  const showNatureToggle = type === "entrada" || type === "saida";

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <div style={modalHeaderStyle}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18 }}>Novo lançamento</span>
          <button onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <button key={key} type="button" onClick={() => setType(key)} style={{
              flex: 1, padding: "8px 6px", borderRadius: 6,
              border: `1px solid ${type === key ? cfg.color : LINE}`,
              background: type === key ? cfg.soft : "transparent",
              color: type === key ? cfg.color : MUTED, fontSize: 12, fontWeight: 500, cursor: "pointer",
            }}>{cfg.label}</button>
          ))}
        </div>

        {showNatureToggle && (
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {[{ key: "fixa", label: "Fixa · repete todo mês" }, { key: "variavel", label: "Variável · só este mês" }].map((opt) => (
              <button key={opt.key} type="button" onClick={() => setNature(opt.key)} style={{
                flex: 1, padding: "8px 8px", borderRadius: 6,
                border: `1px solid ${nature === opt.key ? INK : LINE}`,
                background: nature === opt.key ? PAPER : "transparent",
                color: nature === opt.key ? INK : MUTED, fontSize: 12, fontWeight: 500, cursor: "pointer",
              }}>{opt.label}</button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Descrição">
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: Supermercado" style={inputStyle} autoFocus />
          </Field>
          <div style={{ display: "flex", gap: 10 }}>
            <Field label="Valor (R$)" style={{ flex: 1 }}>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" inputMode="decimal" style={inputStyle} />
            </Field>
            {nature === "fixa" ? (
              <Field label="Dia do mês" style={{ flex: 1 }}>
                <input value={day} onChange={(e) => setDay(e.target.value)} placeholder="5" inputMode="numeric" style={inputStyle} />
              </Field>
            ) : (
              <Field label="Data" style={{ flex: 1 }}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
              </Field>
            )}
          </div>
          <Field label="Categoria">
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES[type].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          {nature === "fixa" && (
            <div style={{ fontSize: 12, color: MUTED, background: PAPER, borderRadius: 6, padding: "8px 10px" }}>
              Isso cria um lançamento recorrente: ele aparecerá automaticamente todo mês no dia informado.
            </div>
          )}

          <button type="submit" style={submitBtnStyle}>Salvar lançamento</button>
        </form>
      </div>
    </div>
  );
}

function GoalModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const t = parseFloat(target.replace(",", "."));
    const s = parseFloat((saved || "0").replace(",", ".")) || 0;
    if (!name.trim() || !t || t <= 0) return;
    onSubmit({ id: `g-${Date.now()}`, name: name.trim(), target: t, saved: s });
  }

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <div style={modalHeaderStyle}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18 }}>Nova meta</span>
          <button onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Nome da meta">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Viagem de férias" style={inputStyle} autoFocus />
          </Field>
          <div style={{ display: "flex", gap: 10 }}>
            <Field label="Valor alvo (R$)" style={{ flex: 1 }}>
              <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="0,00" inputMode="decimal" style={inputStyle} />
            </Field>
            <Field label="Já guardado (R$)" style={{ flex: 1 }}>
              <input value={saved} onChange={(e) => setSaved(e.target.value)} placeholder="0,00" inputMode="decimal" style={inputStyle} />
            </Field>
          </div>
          <button type="submit" style={submitBtnStyle}>Criar meta</button>
        </form>
      </div>
    </div>
  );
}

function AssetModal({ kind, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const v = parseFloat(value.replace(",", "."));
    if (!name.trim() || !v || v <= 0) return;
    onSubmit({ id: `${kind}-${Date.now()}`, name: name.trim(), value: v, kind });
  }

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <div style={modalHeaderStyle}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18 }}>{kind === "ativo" ? "Novo ativo" : "Novo passivo"}</span>
          <button onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Descrição">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={kind === "ativo" ? "Ex.: Imóvel, veículo" : "Ex.: Financiamento, cartão"} style={inputStyle} autoFocus />
          </Field>
          <Field label="Valor (R$)">
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="0,00" inputMode="decimal" style={inputStyle} />
          </Field>
          <button type="submit" style={submitBtnStyle}>Salvar</button>
        </form>
      </div>
    </div>
  );
}

function EditTemplateModal({ template, onClose, onSubmit }) {
  const [description, setDescription] = useState(template.description);
  const [amount, setAmount] = useState(String(template.amount));
  const [category, setCategory] = useState(template.category);
  const [day, setDay] = useState(String(template.day));

  function handleSubmit(e) {
    e.preventDefault();
    const parsedAmount = parseFloat(String(amount).replace(",", "."));
    const parsedDay = Math.min(31, Math.max(1, parseInt(day, 10) || 1));
    if (!description.trim() || !parsedAmount || parsedAmount <= 0) return;
    onSubmit({ id: template.id, description: description.trim(), amount: parsedAmount, category, day: parsedDay });
  }

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <div style={modalHeaderStyle}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18 }}>Editar lançamento fixo</span>
          <button onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Descrição">
            <input value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} autoFocus />
          </Field>
          <div style={{ display: "flex", gap: 10 }}>
            <Field label="Valor (R$)" style={{ flex: 1 }}>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" style={inputStyle} />
            </Field>
            <Field label="Dia do mês" style={{ flex: 1 }}>
              <input value={day} onChange={(e) => setDay(e.target.value)} inputMode="numeric" style={inputStyle} />
            </Field>
          </div>
          <Field label="Categoria">
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES[template.type].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <div style={{ fontSize: 12, color: MUTED, background: PAPER, borderRadius: 6, padding: "8px 10px" }}>
            A correção vale para os lançamentos já gerados por essa recorrência e para os próximos meses.
          </div>
          <button type="submit" style={submitBtnStyle}>Salvar alterações</button>
        </form>
      </div>
    </div>
  );
}

function EditTxModal({ tx, onClose, onSubmit }) {
  const [description, setDescription] = useState(tx.description);
  const [amount, setAmount] = useState(String(tx.amount));
  const [category, setCategory] = useState(tx.category);
  const [date, setDate] = useState(new Date(tx.date).toISOString().slice(0, 10));

  function handleSubmit(e) {
    e.preventDefault();
    const parsedAmount = parseFloat(String(amount).replace(",", "."));
    if (!description.trim() || !parsedAmount || parsedAmount <= 0) return;
    onSubmit({ id: tx.id, description: description.trim(), amount: parsedAmount, category, date });
  }

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <div style={modalHeaderStyle}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18 }}>Editar lançamento</span>
          <button onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Descrição">
            <input value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} autoFocus />
          </Field>
          <div style={{ display: "flex", gap: 10 }}>
            <Field label="Valor (R$)" style={{ flex: 1 }}>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" style={inputStyle} />
            </Field>
            <Field label="Data" style={{ flex: 1 }}>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
            </Field>
          </div>
          <Field label="Categoria">
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              {CATEGORIES[tx.type].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <button type="submit" style={submitBtnStyle}>Salvar alterações</button>
        </form>
      </div>
    </div>
  );
}

function ConnectBankModal({ onClose, onConnect }) {
  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <div style={modalHeaderStyle}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18 }}>Conectar conta</span>
          <button onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>
          Simulação de Open Finance — escolha um banco fictício para ver como a conexão apareceria no app.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MOCK_BANKS.map((bank) => (
            <button
              key={bank.name}
              onClick={() => onConnect(bank)}
              style={{
                display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                border: `1px solid ${LINE}`, borderRadius: 6, padding: "10px 12px",
                background: PAPER, cursor: "pointer",
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 7, background: bank.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                {bank.name.charAt(0)}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{bank.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, style }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, color: MUTED, ...style }}>{label}{children}</label>;
}

// ---------------- estilos ----------------
const navBtnStyle = { width: 30, height: 30, borderRadius: 6, border: `1px solid ${LINE}`, background: PAPER_RAISED, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: INK };
const addBtnStyle = { display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: INK, background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, padding: "7px 12px", cursor: "pointer", whiteSpace: "nowrap" };
const deleteBtnStyle = { opacity: 0, transition: "opacity .15s", border: "none", background: "transparent", cursor: "pointer", color: MUTED, padding: 4 };
const inputStyle = { border: `1px solid ${LINE}`, borderRadius: 6, padding: "9px 10px", fontSize: 14, color: INK, background: PAPER, outline: "none" };
const overlayStyle = { position: "fixed", inset: 0, background: "rgba(22,33,28,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 };
const modalStyle = { background: PAPER_RAISED, borderRadius: 8, width: "100%", maxWidth: 400, padding: 22, maxHeight: "90vh", overflowY: "auto" };
const modalHeaderStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 };
const closeBtnStyle = { border: "none", background: "transparent", cursor: "pointer", color: MUTED };
const submitBtnStyle = { marginTop: 6, background: INK, color: PAPER, border: "none", borderRadius: 6, padding: "11px 0", fontSize: 14, fontWeight: 500, cursor: "pointer" };
