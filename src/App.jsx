import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  X,
  Wallet,
  Trash2,
  LayoutGrid,
  ListChecks,
  Repeat,
  Shield,
  Target,
  Landmark,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ---------- tokens ----------
const INK = "#16211C";
const PAPER = "#F1F3EE";
const PAPER_RAISED = "#FFFFFF";
const LINE = "#D8DCD3";
const MUTED = "#65706A";
const SIDEBAR_W = 232;

const TYPE_CONFIG = {
  entrada: { label: "Entrada", plural: "Entradas", color: "#2F7A4D", soft: "#E4F1E9", Icon: TrendingUp },
  saida: { label: "Saída", plural: "Saídas", color: "#B23A2E", soft: "#F8E8E5", Icon: TrendingDown },
  investimento: { label: "Investimento", plural: "Investimentos", color: "#A9821F", soft: "#F5EEDA", Icon: PiggyBank },
};

const CATEGORIES = {
  entrada: ["Salário", "Freelance", "Reembolso", "Outros"],
  saida: ["Moradia", "Alimentação", "Transporte", "Lazer", "Saúde", "Outros"],
  investimento: ["Renda fixa", "Ações", "Fundos", "Reserva de emergência"],
};

const NAV_ITEMS = [
  { key: "geral", label: "Visão geral", icon: LayoutGrid },
  { key: "obrigacoes", label: "Obrigações", icon: ListChecks },
  { key: "reserva", label: "Reserva de emergência", icon: Shield },
  { key: "metas", label: "Metas", icon: Target },
  { key: "investimento", label: "Investimentos", icon: TrendingUp },
  { key: "patrimonio", label: "Patrimônio", icon: Landmark },
];

const MONTH_KEY = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

function formatBRL(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// ---------- persistência local (localStorage do navegador) ----------
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
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
    mk(1, 8, "entrada", "Freelance", "Projeto extra", 900, "variavel"),
    mk(1, 10, "saida", "Moradia", "Aluguel", 1800, "fixa", "tpl-aluguel"),
    mk(1, 15, "saida", "Transporte", "Combustível", 320, "variavel"),
    mk(1, 18, "saida", "Lazer", "Cinema e jantar", 210, "variavel"),
    mk(1, 22, "investimento", "Ações", "Aporte carteira", 700),
    mk(0, 5, "entrada", "Salário", "Salário", 6200, "fixa", "tpl-salario"),
    mk(0, 9, "saida", "Moradia", "Aluguel", 1800, "fixa", "tpl-aluguel"),
    mk(0, 12, "saida", "Alimentação", "Supermercado", 580, "variavel"),
    mk(0, 16, "saida", "Saúde", "Farmácia", 145, "variavel"),
    mk(0, 21, "investimento", "Reserva de emergência", "Aporte reserva", 600),
  ];
}
function seedTemplates() {
  return [
    { id: "tpl-salario", type: "entrada", category: "Salário", description: "Salário", amount: 6200, day: 5 },
    { id: "tpl-aluguel", type: "saida", category: "Moradia", description: "Aluguel", amount: 1800, day: 10 },
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

export default function FinanceDashboard() {
  const [section, setSection] = useState("geral");
  const [transactions, setTransactions] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [goals, setGoals] = useState([]);
  const [assets, setAssets] = useState([]);
  const [emergencyTarget, setEmergencyTarget] = useState(15000);
  const [loaded, setLoaded] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [modalConfig, setModalConfig] = useState(null); // { type, nature, category }
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [assetModalOpen, setAssetModalOpen] = useState(null); // 'ativo' | 'passivo' | null

  useEffect(() => {
    setTransactions(loadJSON("cifra_transactions", null) || seedData());
    setTemplates(loadJSON("cifra_templates", null) || seedTemplates());
    setGoals(loadJSON("cifra_goals", null) || seedGoals());
    setAssets(loadJSON("cifra_assets", null) || seedAssets());
    setEmergencyTarget(loadJSON("cifra_emergency_target", null) ?? 15000);
    setLoaded(true);
  }, []);

  useEffect(() => { if (loaded) saveJSON("cifra_transactions", transactions); }, [transactions, loaded]);
  useEffect(() => { if (loaded) saveJSON("cifra_templates", templates); }, [templates, loaded]);
  useEffect(() => { if (loaded) saveJSON("cifra_goals", goals); }, [goals, loaded]);
  useEffect(() => { if (loaded) saveJSON("cifra_assets", assets); }, [assets, loaded]);
  useEffect(() => { if (loaded) saveJSON("cifra_emergency_target", emergencyTarget); }, [emergencyTarget, loaded]);

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

  const saldo = totals.entrada - totals.saida - totals.investimento;

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

  const despesasFixasMensal = useMemo(() => templates.filter((t) => t.type === "saida").reduce((s, t) => s + t.amount, 0), [templates]);
  const mesesCobertos = despesasFixasMensal > 0 ? reservaSaved / despesasFixasMensal : 0;

  const totalAtivosManual = assets.filter((a) => a.kind === "ativo").reduce((s, a) => s + a.value, 0);
  const totalPassivos = assets.filter((a) => a.kind === "passivo").reduce((s, a) => s + a.value, 0);
  const patrimonioLiquido = totalInvestedAllTime + totalAtivosManual - totalPassivos;

  function goMonth(delta) { setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1)); }
  function removeTx(id) { setTransactions((prev) => prev.filter((t) => t.id !== id)); }
  function removeTemplate(id) { setTemplates((prev) => prev.filter((t) => t.id !== id)); }

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

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: PAPER, minHeight: "100vh", color: INK, display: "flex" }}>
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
            <VisaoGeralSection saldo={saldo} totals={totals} monthTx={monthTx} chartData={chartData} onRemove={removeTx}
              onAdd={() => setModalConfig({ type: "entrada", nature: "variavel" })} />
          )}

          {section === "obrigacoes" && (
            <ObrigacoesSection templates={templates} monthTx={monthTx} onRemoveTemplate={removeTemplate} onRemoveTx={removeTx}
              onAddFixa={(type) => setModalConfig({ type, nature: "fixa" })}
              onAddVariavel={(type) => setModalConfig({ type, nature: "variavel" })} />
          )}

          {section === "reserva" && (
            <ReservaSection saved={reservaSaved} target={emergencyTarget} setTarget={setEmergencyTarget}
              mesesCobertos={mesesCobertos} despesasFixasMensal={despesasFixasMensal}
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
    </div>
  );
}

// ---------------- Sidebar ----------------
function Sidebar({ section, setSection }) {
  return (
    <div style={{ width: SIDEBAR_W, flexShrink: 0, background: INK, color: PAPER, minHeight: "100vh", padding: "22px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 26 }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Wallet size={16} color={INK} />
        </div>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600 }}>Cifra</span>
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
                background: active ? "rgba(241,243,238,0.12)" : "transparent",
                color: active ? PAPER : "#AEB8AF",
                borderLeft: active ? "2px solid #F1F3EE" : "2px solid transparent",
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
function VisaoGeralSection({ saldo, totals, monthTx, chartData, onRemove, onAdd }) {
  return (
    <>
      <div style={{ background: INK, color: PAPER, borderRadius: 6, padding: "26px 28px", marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: "#AEB8AF", marginBottom: 6 }}>Saldo do mês</div>
        <div className="amount-mono" style={{ fontFamily: "'Fraunces', serif", fontSize: 40, lineHeight: 1.1 }}>{formatBRL(saldo)}</div>
        <div style={{ display: "flex", gap: 22, marginTop: 18, flexWrap: "wrap" }}>
          <LegendPoint color={TYPE_CONFIG.entrada.color} label="Entradas" value={formatBRL(totals.entrada)} />
          <LegendPoint color={TYPE_CONFIG.saida.color} label="Saídas" value={formatBRL(totals.saida)} />
          <LegendPoint color={TYPE_CONFIG.investimento.color} label="Investido" value={formatBRL(totals.investimento)} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 22 }}>
        <StatCard type="entrada" value={totals.entrada} count={monthTx.filter((t) => t.type === "entrada").length} />
        <StatCard type="saida" value={totals.saida} count={monthTx.filter((t) => t.type === "saida").length} />
        <StatCard type="investimento" value={totals.investimento} count={monthTx.filter((t) => t.type === "investimento").length} />
      </div>

      <div style={{ background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, padding: "18px 18px 6px", marginBottom: 22 }}>
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

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: MUTED }}>Lançamentos do mês</span>
        <button onClick={onAdd} style={addBtnStyle}><Plus size={15} /> Novo lançamento</button>
      </div>

      <TxList items={monthTx} onRemove={onRemove} emptyText='Nenhum lançamento neste mês. Use "Novo lançamento" para registrar uma entrada, saída ou investimento.' />
    </>
  );
}

// ---------------- Obrigações ----------------
function ObrigacoesSection({ templates, monthTx, onRemoveTemplate, onRemoveTx, onAddFixa, onAddVariavel }) {
  const entradasFixas = templates.filter((t) => t.type === "entrada");
  const despesasFixas = templates.filter((t) => t.type === "saida");
  const variaveis = monthTx.filter((t) => t.nature === "variavel");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      <div>
        <SectionHeader icon={Repeat} title="Entradas fixas" subtitle="Salários e recebimentos que se repetem todo mês" onAdd={() => onAddFixa("entrada")} addLabel="Nova entrada fixa" />
        <TemplateList items={entradasFixas} type="entrada" onRemove={onRemoveTemplate} />
      </div>
      <div>
        <SectionHeader icon={Repeat} title="Despesas fixas" subtitle="Contas recorrentes, como aluguel e assinaturas" onAdd={() => onAddFixa("saida")} addLabel="Nova despesa fixa" />
        <TemplateList items={despesasFixas} type="saida" onRemove={onRemoveTemplate} />
      </div>
      <div>
        <SectionHeader title="Entradas e despesas variáveis do mês" subtitle="Extras, freelas e gastos pontuais deste mês" onAdd={() => onAddVariavel("entrada")} addLabel="Novo lançamento variável" />
        <TxList items={variaveis} onRemove={onRemoveTx} emptyText="Nenhum lançamento variável neste mês ainda." showNatureBadge />
      </div>
    </div>
  );
}

// ---------------- Reserva de emergência ----------------
function ReservaSection({ saved, target, setTarget, mesesCobertos, despesasFixasMensal, onAporte }) {
  const [editingTarget, setEditingTarget] = useState(String(target));
  useEffect(() => setEditingTarget(String(target)), [target]);
  const pct = target > 0 ? Math.min(100, (saved / target) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: INK, color: PAPER, borderRadius: 6, padding: "26px 28px" }}>
        <div style={{ fontSize: 13, color: "#AEB8AF", marginBottom: 6 }}>Reserva acumulada</div>
        <div className="amount-mono" style={{ fontFamily: "'Fraunces', serif", fontSize: 36, lineHeight: 1.1 }}>{formatBRL(saved)}</div>
        <div style={{ marginTop: 14, height: 8, borderRadius: 4, background: "rgba(241,243,238,0.18)", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#A9821F" }} />
        </div>
        <div style={{ fontSize: 12, color: "#C7CFC8", marginTop: 8 }}>
          {pct.toFixed(0)}% da meta de {formatBRL(target)} · cobre ~{mesesCobertos.toFixed(1)} meses de despesas fixas
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220, background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, padding: "14px 16px" }}>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>Meta da reserva (R$)</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={editingTarget} onChange={(e) => setEditingTarget(e.target.value)}
              onBlur={() => { const v = parseFloat(editingTarget.replace(",", ".")); if (v > 0) setTarget(v); else setEditingTarget(String(target)); }}
              style={inputStyle} inputMode="decimal" />
          </div>
          <div style={{ fontSize: 11.5, color: MUTED, marginTop: 8 }}>Sugestão: 6x suas despesas fixas mensais ({formatBRL(despesasFixasMensal * 6)}).</div>
        </div>
        <div style={{ flex: 1, minWidth: 220, background: PAPER_RAISED, border: `1px solid ${LINE}`, borderRadius: 6, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Despesas fixas mensais</div>
            <div className="amount-mono" style={{ fontSize: 18, fontWeight: 500 }}>{formatBRL(despesasFixasMensal)}</div>
          </div>
          <button onClick={onAporte} style={{ ...addBtnStyle, marginTop: 12, justifyContent: "center" }}><Plus size={15} /> Registrar aporte</button>
        </div>
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

function TemplateList({ items, type, onRemove }) {
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
          <button className="tx-delete" onClick={() => onRemove(t.id)} aria-label="Remover recorrência" style={deleteBtnStyle}><Trash2 size={15} /></button>
        </div>
      ))}
    </div>
  );
}

function TxList({ items, onRemove, emptyText, showNatureBadge, hideDelete }) {
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
              <div style={{ fontSize: 14, fontWeight: 500 }}>{t.description}</div>
              <div style={{ fontSize: 12, color: MUTED }}>
                {t.category} · {new Date(t.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                {showNatureBadge && t.nature ? ` · ${t.nature === "fixa" ? "Fixa" : "Variável"}` : ""}
              </div>
            </div>
            <div className="amount-mono" style={{ fontSize: 14, color: cfg.color, fontWeight: 500, whiteSpace: "nowrap" }}>{sign} {formatBRL(t.amount)}</div>
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
