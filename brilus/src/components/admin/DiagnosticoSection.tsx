import { useEffect, useMemo, useState } from "react";
import { Eye, Download, FileSpreadsheet, AlertTriangle, GitMerge } from "lucide-react";
import ExcelJS from "exceljs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { mchatConfig } from "@/screener/configs/mchatConfig";
import { castConfig } from "@/screener/configs/castConfig";
import type { ScreenerConfig, ScreenerQuestion } from "@/screener/screenerTypes";

interface ScreenerLead {
  id: string;
  screener_id: string;
  caregiver_name: string | null;
  caregiver_lastname: string | null;
  email: string | null;
  whatsapp: string | null;
  child_name: string | null;
  child_birthdate: string | null;
  postal_code: string | null;
  status: string;
  answers: any;
  score: number | null;
  risk_level: string | null;
  started_at: string | null;
  completed_at: string | null;
  parent_lead_id: string | null;
}

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) : "—";

const formatDateOnly = (iso: string | null) => {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;

  return `${day}/${month}/${year}`;
};

const statusBadge = (status: string) => {
  if (status === "completado")
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Completado</Badge>;
  return <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 border-amber-200">Iniciado</Badge>;
};

const riskBadge = (status: string, risk: string | null) => {
  if (status !== "completado" || !risk) return <span className="text-muted-foreground">—</span>;
  const r = risk.toLowerCase();
  if (r.includes("alto"))
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">{risk}</Badge>;
  if (r.includes("medio"))
    return <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 border-amber-200">{risk}</Badge>;
  return <Badge className="bg-muted text-foreground hover:bg-muted border-border">{risk}</Badge>;
};

const normalizePhone = (phone: string | null) => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (!digits || /^0+$/.test(digits)) return "";
  return phone;
};

const isQuestionScored = (config: ScreenerConfig, qId: number, answer: "yes" | "no" | null) => {
  if (!answer) return false;
  const rules = config.scoringRules;
  if (rules.nonScoredIds.includes(qId)) return false;
  if (rules.yesRiskIds.includes(qId) && answer === "yes") return true;
  if (rules.noRiskIds.includes(qId) && answer === "no") return true;
  return false;
};

const renderAnswers = (config: ScreenerConfig, answers: any) => {
  if (!Array.isArray(answers) || answers.length === 0)
    return <p className="text-base text-muted-foreground">Sin respuestas registradas.</p>;

  const byId = new Map<number, ScreenerQuestion>();
  config.questions.forEach((q) => byId.set(q.id, q));

  return (
    <div className="space-y-3">
      <div className="rounded-[10px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm tracking-[-0.05em] text-amber-900 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
        <span>Los ítems marcados con <strong>⚠</strong> y borde rojo son los que suman al puntaje de riesgo.</span>
      </div>
      {answers.map((a: any, i: number) => {
        const q = byId.get(a.questionId);
        const ans = a.answer === "yes" ? "SÍ" : a.answer === "no" ? "NO" : "—";
        const scored = isQuestionScored(config, a.questionId, a.answer);
        return (
          <div
            key={i}
            className={`rounded-[10px] border-l-4 px-3 py-3 ${
              scored
                ? "border-l-[#C02C00] border border-[#C02C00]/40 bg-[#C02C00]/10"
                : "border-l-transparent border border-border bg-muted/30"
            }`}
          >
            <div className="flex justify-between gap-3 items-start">
              <div className="flex gap-2 min-w-0 flex-1">
                {scored ? (
                  <AlertTriangle className="h-4 w-4 mt-1 shrink-0 text-[#C02C00]" aria-hidden />
                ) : (
                  <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full border border-border" aria-hidden />
                )}
                <p className="text-base font-medium leading-snug break-words min-w-0">
                  <span className="font-semibold">{a.questionId}.</span> {q?.text ?? "(pregunta no encontrada)"}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`shrink-0 ${scored ? "border-[#C02C00] bg-white text-[#C02C00] font-semibold" : ""}`}
              >
                {ans}
              </Badge>
            </div>
            {a.conditionalText && (
              <p className="text-sm text-muted-foreground mt-2 pl-6">
                <span className="font-semibold">{q?.conditionalTextLabel ?? "Detalle"}:</span> {a.conditionalText}
              </p>
            )}
            {a.subitemAnswers && Object.keys(a.subitemAnswers).length > 0 && (
              <ul className="mt-2 space-y-1 pl-6">
                {Object.entries(a.subitemAnswers).map(([sid, sv]) => {
                  const sub = q?.subitems?.find((s) => s.id === sid);
                  const cond = a.subitemConditionalTexts?.[sid];
                  return (
                    <li key={sid} className="text-xs text-muted-foreground">
                      • {sub?.label ?? sid}: <span className="font-medium text-foreground">{sv === "yes" ? "SÍ" : "NO"}</span>
                      {cond && <span className="block ml-3 italic">↳ {cond}</span>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

const LeadsTable = ({
  config,
  leads,
  loading,
  onSelect,
  resolveContact,
  onDownloadPdf,
  selectable,
  selectedIds,
  onToggleSelect,
}: {
  config: ScreenerConfig;
  leads: ScreenerLead[];
  loading: boolean;
  onSelect: (l: ScreenerLead) => void;
  resolveContact: (l: ScreenerLead) => { name: string; email: string; phone: string };
  onDownloadPdf: (l: ScreenerLead) => void;
  selectable: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}) => {
  if (loading)
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    );
  if (leads.length === 0)
    return <div className="p-8 text-center text-muted-foreground">No hay registros para mostrar.</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {selectable && <TableHead className="w-10"></TableHead>}
          <TableHead>Familiar</TableHead>
          <TableHead>Niño/a</TableHead>
          <TableHead>Nacimiento</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Riesgo</TableHead>
          <TableHead>Inicio</TableHead>
          <TableHead>Cierre</TableHead>
          <TableHead className="text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((l) => {
          const contact = resolveContact(l);
          const displayName =
            [l.caregiver_name, l.caregiver_lastname].filter(Boolean).join(" ") || contact.name || "—";
          const checked = selectedIds.has(l.id);
          const disableSelect = selectable && !checked && selectedIds.size >= 2;
          return (
            <TableRow key={l.id} className={checked ? "bg-brand-blue/5" : ""}>
              {selectable && (
                <TableCell>
                  <Checkbox
                    checked={checked}
                    disabled={disableSelect}
                    onCheckedChange={() => onToggleSelect(l.id)}
                    aria-label="Seleccionar registro"
                  />
                </TableCell>
              )}
              <TableCell className="font-medium">{displayName}</TableCell>
              <TableCell>{l.child_name || "—"}</TableCell>
              <TableCell>{formatDateOnly(l.child_birthdate)}</TableCell>
              <TableCell>
                <div className="text-xs">
                  {contact.phone && <div>{contact.phone}</div>}
                  {contact.email && <div className="text-muted-foreground">{contact.email}</div>}
                  {!contact.phone && !contact.email && "—"}
                </div>
              </TableCell>
              <TableCell>{statusBadge(l.status)}</TableCell>
              <TableCell>{riskBadge(l.status, l.risk_level)}</TableCell>
              <TableCell className="text-xs">{formatDate(l.started_at)}</TableCell>
              <TableCell className="text-xs">{formatDate(l.completed_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onSelect(l)} title="Ver detalle">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {l.status === "completado" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownloadPdf(l)}
                      title="Descargar Excel"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const csvEscape = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const downloadLeadsCsv = (leads: ScreenerLead[], screenerId: string) => {
  const headers = [
    "Nombre del padre/cuidador",
    "Nombre del niño/a",
    "Fecha de nacimiento",
    "Email",
    "Teléfono",
    "Tipo de screening",
    "Puntaje total",
    "Nivel de riesgo",
    "Fecha de envío",
    "Estado",
  ];
  const rows = leads.map((l) => [
    [l.caregiver_name, l.caregiver_lastname].filter(Boolean).join(" "),
    l.child_name ?? "",
    l.child_birthdate ?? "",
    l.email ?? "",
    normalizePhone(l.whatsapp),
    l.screener_id,
    l.score ?? "",
    l.status === "completado" ? l.risk_level ?? "" : "",
    l.completed_at ?? l.started_at ?? "",
    l.status,
  ]);
  const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `screener-${screenerId}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const downloadLeadXlsx = async (
  l: ScreenerLead,
  config: ScreenerConfig,
  contact: { name: string; email: string; phone: string },
) => {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Brilus";
  wb.created = new Date();
  const ws = wb.addWorksheet("Resultado", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  const childDob = (() => {
    if (!l.child_birthdate) return "";
    const [yr, mo, da] = l.child_birthdate.split("-");
    return yr && mo && da ? `${da}/${mo}/${yr}` : l.child_birthdate;
  })();
  const submission = l.completed_at
    ? new Date(l.completed_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })
    : "";

  // Header block
  const titleRow = ws.addRow([config.title]);
  titleRow.font = { name: "Arial", bold: true, size: 14 };
  ws.mergeCells(titleRow.number, 1, titleRow.number, 5);
  const subRow = ws.addRow(["Resultado del cuestionario · Uso interno Brilus"]);
  subRow.font = { name: "Arial", italic: true, size: 10, color: { argb: "FF6B6B6B" } };
  ws.mergeCells(subRow.number, 1, subRow.number, 5);
  ws.addRow([]);

  const meta: [string, string][] = [
    ["Nombre del padre/cuidador", contact.name],
    ["Nombre del niño/a", l.child_name ?? ""],
    ["Fecha de nacimiento", childDob],
    ["Email", contact.email],
    ["Teléfono", contact.phone],
    ["Fecha de envío", submission],
    ["Puntaje total", l.score != null ? String(l.score) : ""],
    ["Nivel de riesgo (interno)", l.risk_level ?? ""],
  ];
  meta.forEach(([k, v]) => {
    const r = ws.addRow([k, v]);
    r.getCell(1).font = { name: "Arial", bold: true, size: 11 };
    r.getCell(2).font = { name: "Arial", size: 11 };
  });
  ws.addRow([]);

  // Legend
  const legend = ws.addRow([
    "Indicador: las filas marcadas con ⚠ (relleno rojo claro) suman al puntaje de riesgo.",
  ]);
  legend.font = { name: "Arial", italic: true, size: 10, color: { argb: "FF8A4B00" } };
  ws.mergeCells(legend.number, 1, legend.number, 5);
  ws.addRow([]);

  // Table header
  const headerRow = ws.addRow(["N°", "Pregunta", "Respuesta", "Puntaje", "Indicador"]);
  headerRow.font = { name: "Arial", bold: true, size: 11, color: { argb: "FFFFFFFF" } };
  headerRow.eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F1F1F" } };
    c.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    c.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    };
  });

  const answers = Array.isArray(l.answers) ? l.answers : [];
  const ansById = new Map<number, any>();
  answers.forEach((a) => ansById.set(a.questionId, a));

  let totalScore = 0;

  const writeQuestionRow = (q: ScreenerQuestion) => {
    const a = ansById.get(q.id);
    const ans = a?.answer === "yes" ? "SÍ" : a?.answer === "no" ? "NO" : "—";
    const isNonScored = config.scoringRules.nonScoredIds.includes(q.id);
    const scored = !isNonScored && isQuestionScored(config, q.id, a?.answer ?? null);
    const puntaje: string | number = isNonScored ? "N/A" : scored ? 1 : 0;
    if (typeof puntaje === "number") totalScore += puntaje;

    let fullText = q.text;
    // Append conditional text / subitems for info questions
    if (a?.conditionalText) {
      fullText += `\n${q.conditionalTextLabel ?? "Detalle"}: ${a.conditionalText}`;
    }
    if (a?.subitemAnswers && Object.keys(a.subitemAnswers).length > 0) {
      const subs = Object.entries(a.subitemAnswers).map(([sid, sv]) => {
        const sub = q.subitems?.find((s) => s.id === sid);
        const cond = a.subitemConditionalTexts?.[sid];
        return `• ${sub?.label ?? sid}: ${sv === "yes" ? "SÍ" : "NO"}${cond ? ` (${cond})` : ""}`;
      });
      fullText += `\n${subs.join("\n")}`;
    }

    const row = ws.addRow([q.id, fullText, ans, puntaje, scored ? "⚠ RIESGO" : ""]);
    row.font = { name: "Arial", size: 10 };
    row.alignment = { vertical: "top", wrapText: true };
    row.getCell(1).alignment = { vertical: "top", horizontal: "center" };
    row.getCell(3).alignment = { vertical: "top", horizontal: "center" };
    row.getCell(4).alignment = { vertical: "top", horizontal: "center" };
    row.getCell(5).alignment = { vertical: "top", horizontal: "center" };

    if (scored) {
      ["A", "B", "C", "D", "E"].forEach((col) => {
        const cell = row.getCell(col);
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFCE4DC" } };
        cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFC02C00" } };
      });
    } else if (isNonScored) {
      ["A", "B", "C", "D", "E"].forEach((col) => {
        row.getCell(col).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF4F4F4" },
        };
      });
    }
    row.eachCell((c) => {
      c.border = {
        top: { style: "hair", color: { argb: "FFD2D2D2" } },
        bottom: { style: "hair", color: { argb: "FFD2D2D2" } },
        left: { style: "hair", color: { argb: "FFD2D2D2" } },
        right: { style: "hair", color: { argb: "FFD2D2D2" } },
      };
    });
  };

  // Main scorable, then info questions (already at end in config order)
  const sorted = [...config.questions].sort((a, b) => a.id - b.id);
  sorted.forEach(writeQuestionRow);

  ws.addRow([]);
  const totalRow = ws.addRow(["", "PUNTAJE TOTAL", "", totalScore, ""]);
  totalRow.font = { name: "Arial", bold: true, size: 12 };
  totalRow.eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF4D6" } };
    c.alignment = { vertical: "middle", horizontal: "center" };
  });
  totalRow.getCell(2).alignment = { vertical: "middle", horizontal: "right" };

  const riskRow = ws.addRow(["", "NIVEL DE RIESGO (interno)", "", l.risk_level ?? "", ""]);
  riskRow.font = { name: "Arial", bold: true, size: 12 };
  riskRow.eachCell((c) => {
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF4D6" } };
    c.alignment = { vertical: "middle", horizontal: "center" };
  });
  riskRow.getCell(2).alignment = { vertical: "middle", horizontal: "right" };

  ws.getColumn(1).width = 6;
  ws.getColumn(2).width = 80;
  ws.getColumn(3).width = 12;
  ws.getColumn(4).width = 10;
  ws.getColumn(5).width = 14;

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${config.id}-${(l.child_name || "resultado").replace(/\s+/g, "-").toLowerCase()}-${l.id.slice(0, 8)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};






const MERGEABLE_FIELDS: { key: keyof ScreenerLead; label: string }[] = [
  { key: "caregiver_name", label: "Nombre del cuidador" },
  { key: "caregiver_lastname", label: "Apellido del cuidador" },
  { key: "email", label: "Email" },
  { key: "whatsapp", label: "Teléfono / WhatsApp" },
  { key: "child_name", label: "Nombre del niño/a" },
  { key: "child_birthdate", label: "Fecha de nacimiento" },
  { key: "postal_code", label: "Código postal" },
];

const cleanValue = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  const s = String(v).trim();
  if (!s) return "";
  if (s === "acceso-privado@brilus.mx") return "";
  if (s === "No especificado") return "";
  if (/^0+$/.test(s.replace(/\D/g, "")) && s.replace(/\D/g, "").length > 0) return "";
  return s;
};

export const DiagnosticoSection = () => {
  const { toast } = useToast();
  const { userRoles } = useAuth();
  const isAdmin = userRoles.roles.includes("admin");

  const [leads, setLeads] = useState<ScreenerLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"mchat-r" | "cast">("mchat-r");
  const [selected, setSelected] = useState<ScreenerLead | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mergeOpen, setMergeOpen] = useState(false);
  const [mergeChoices, setMergeChoices] = useState<Record<string, "a" | "b">>({});
  const [keepRow, setKeepRow] = useState<"a" | "b">("a");
  const [merging, setMerging] = useState(false);

  const loadLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("screener_leads")
      .select("*")
      .order("started_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: "No se pudieron cargar los registros", variant: "destructive" });
    } else {
      setLeads((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mchatLeads = useMemo(() => leads.filter((l) => l.screener_id === "mchat-r"), [leads]);
  const castLeads = useMemo(() => leads.filter((l) => l.screener_id === "cast"), [leads]);

  const leadsById = useMemo(() => {
    const m = new Map<string, ScreenerLead>();
    leads.forEach((l) => m.set(l.id, l));
    return m;
  }, [leads]);

  const resolveContact = (l: ScreenerLead) => {
    const parent = l.parent_lead_id ? leadsById.get(l.parent_lead_id) : null;
    const phone = normalizePhone(l.whatsapp) || (parent ? normalizePhone(parent.whatsapp) : "");
    const email =
      (l.email && l.email !== "acceso-privado@brilus.mx" ? l.email : "") ||
      (parent?.email && parent.email !== "acceso-privado@brilus.mx" ? parent.email : "");
    const name =
      [l.caregiver_name, l.caregiver_lastname].filter(Boolean).join(" ") ||
      [parent?.caregiver_name, parent?.caregiver_lastname].filter(Boolean).join(" ");
    return { name, email, phone };
  };

  const selectedConfig: ScreenerConfig = selected?.screener_id === "cast" ? castConfig : mchatConfig;
  const selectedContact = selected ? resolveContact(selected) : { name: "", email: "", phone: "" };

  const handleDownloadPdf = (l: ScreenerLead) => {
    const cfg = l.screener_id === "cast" ? castConfig : mchatConfig;
    downloadLeadXlsx(l, cfg, resolveContact(l));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 2) next.add(id);
      return next;
    });
  };

  const currentLeads = tab === "cast" ? castLeads : mchatLeads;
  const selectedLeadsArr = Array.from(selectedIds)
    .map((id) => leadsById.get(id))
    .filter((l): l is ScreenerLead => !!l);
  const canOpenMerge = isAdmin && selectedLeadsArr.length === 2;

  const openMergeDialog = () => {
    if (!canOpenMerge) return;
    // Pre-fill: prefer the row that has more non-empty cleaned values for each field
    const [a, b] = selectedLeadsArr;
    const choices: Record<string, "a" | "b"> = {};
    MERGEABLE_FIELDS.forEach((f) => {
      const va = cleanValue(a[f.key]);
      const vb = cleanValue(b[f.key]);
      if (va && !vb) choices[f.key] = "a";
      else if (vb && !va) choices[f.key] = "b";
      else choices[f.key] = "a";
    });
    setMergeChoices(choices);
    // Default keep: the most "complete" one (more answers / completed status)
    const score = (l: ScreenerLead) =>
      (l.status === "completado" ? 100 : 0) +
      (Array.isArray(l.answers) ? l.answers.length : 0) +
      MERGEABLE_FIELDS.reduce((acc, f) => acc + (cleanValue(l[f.key]) ? 1 : 0), 0);
    setKeepRow(score(a) >= score(b) ? "a" : "b");
    setMergeOpen(true);
  };

  const performMerge = async () => {
    if (!canOpenMerge) return;
    setMerging(true);
    try {
      const [a, b] = selectedLeadsArr;
      const primary = keepRow === "a" ? a : b;
      const secondary = keepRow === "a" ? b : a;

      const updates: Record<string, any> = {};
      MERGEABLE_FIELDS.forEach((f) => {
        const chosen = mergeChoices[f.key] === "a" ? a : b;
        updates[f.key as string] = chosen[f.key] ?? null;
      });

      // Consolidate non-conflictable fields: prefer the most complete
      const useFromCompleted =
        primary.status === "completado"
          ? primary
          : secondary.status === "completado"
            ? secondary
            : primary;
      updates.answers = useFromCompleted.answers ?? primary.answers ?? secondary.answers ?? null;
      updates.score = useFromCompleted.score ?? primary.score ?? secondary.score ?? null;
      updates.risk_level = useFromCompleted.risk_level ?? primary.risk_level ?? secondary.risk_level ?? null;
      updates.status =
        primary.status === "completado" || secondary.status === "completado" ? "completado" : primary.status;

      // Keep earliest started_at and latest completed_at
      const startedCandidates = [primary.started_at, secondary.started_at].filter(Boolean) as string[];
      if (startedCandidates.length)
        updates.started_at = startedCandidates.sort()[0];
      const completedCandidates = [primary.completed_at, secondary.completed_at].filter(Boolean) as string[];
      if (completedCandidates.length)
        updates.completed_at = completedCandidates.sort().reverse()[0];

      // Re-point any children that referenced the secondary
      const { error: repointErr } = await (supabase as any)
        .from("screener_leads")
        .update({ parent_lead_id: primary.id })
        .eq("parent_lead_id", secondary.id);
      if (repointErr) throw repointErr;

      const { error: updErr } = await (supabase as any)
        .from("screener_leads")
        .update(updates)
        .eq("id", primary.id);
      if (updErr) throw updErr;

      const { error: delErr } = await supabase
        .from("screener_leads")
        .delete()
        .eq("id", secondary.id);
      if (delErr) throw delErr;

      toast({ title: "Registros unidos", description: "Se consolidaron en un solo registro." });
      setMergeOpen(false);
      setSelectedIds(new Set());
      await loadLeads();
    } catch (e: any) {
      toast({
        title: "No se pudo unir",
        description: e?.message ?? "Error inesperado al unir registros.",
        variant: "destructive",
      });
    } finally {
      setMerging(false);
    }
  };

  const mergeA = selectedLeadsArr[0];
  const mergeB = selectedLeadsArr[1];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[20px] font-bold tracking-tight">Diagnóstico</h2>
        <p className="text-base text-muted-foreground mt-1">
          Registros de screenings M-CHAT-R y CAST. El nivel de riesgo es información interna.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as any);
          setSelectedIds(new Set());
        }}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabsList>
            <TabsTrigger value="mchat-r">M-CHAT-R ({mchatLeads.length})</TabsTrigger>
            <TabsTrigger value="cast">CAST ({castLeads.length})</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {isAdmin && selectedIds.size > 0 && (
              <Button
                variant="blue"
                size="sm"
                disabled={selectedLeadsArr.length !== 2}
                onClick={openMergeDialog}
              >
                <GitMerge className="mr-1 h-4 w-4" />
                Unir registros ({selectedIds.size}/2)
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadLeadsCsv(currentLeads, tab)}
              disabled={currentLeads.length === 0}
            >
              <Download className="mr-1 h-4 w-4" /> Descargar resultados
            </Button>
          </div>
        </div>

        <TabsContent value="mchat-r">
          <Card>
            <LeadsTable
              config={mchatConfig}
              leads={mchatLeads}
              loading={loading}
              resolveContact={resolveContact}
              onDownloadPdf={handleDownloadPdf}
              selectable={isAdmin}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onSelect={(l) => {
                setSelected(l);
                setDialogOpen(true);
              }}
            />
          </Card>
        </TabsContent>

        <TabsContent value="cast">
          <Card>
            <LeadsTable
              config={castConfig}
              leads={castLeads}
              loading={loading}
              resolveContact={resolveContact}
              onDownloadPdf={handleDownloadPdf}
              selectable={isAdmin}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onSelect={(l) => {
                setSelected(l);
                setDialogOpen(true);
              }}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Merge dialog */}
      <Dialog open={mergeOpen} onOpenChange={setMergeOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Unir registros duplicados</DialogTitle>
            <DialogDescription>
              Para cada campo, elige qué valor conservar. Las respuestas, puntaje y nivel de riesgo se
              conservan del registro completado (si existe).
            </DialogDescription>
          </DialogHeader>

          {mergeA && mergeB && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold mb-2">¿Qué registro conservar como base?</p>
                <RadioGroup value={keepRow} onValueChange={(v) => setKeepRow(v as "a" | "b")}>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      ["a", mergeA],
                      ["b", mergeB],
                    ] as const).map(([key, l]) => (
                      <label
                        key={key}
                        className={`flex items-start gap-2 rounded-[10px] border p-3 cursor-pointer ${
                          keepRow === key ? "border-brand-blue bg-brand-blue/5" : "border-border"
                        }`}
                      >
                        <RadioGroupItem value={key} id={`keep-${key}`} className="mt-1" />
                        <div className="text-xs">
                          <div className="font-semibold text-foreground">
                            Registro {key.toUpperCase()}
                          </div>
                          <div className="text-muted-foreground">
                            ID: {l.id.slice(0, 8)} · {l.status} ·{" "}
                            {Array.isArray(l.answers) ? l.answers.length : 0} respuestas
                          </div>
                          <div className="text-muted-foreground">{formatDate(l.started_at)}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="rounded-[10px] border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Campo</th>
                      <th className="text-left p-2">Registro A</th>
                      <th className="text-left p-2">Registro B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MERGEABLE_FIELDS.map((f) => {
                      const va = mergeA[f.key] ?? "";
                      const vb = mergeB[f.key] ?? "";
                      const conflict = String(va) !== String(vb);
                      return (
                        <tr key={f.key as string} className="border-t border-border align-top">
                          <td className="p-2 font-medium">
                            {f.label}
                            {conflict && (
                              <Badge className="ml-2 bg-amber-100 text-amber-900 border-amber-200">
                                Conflicto
                              </Badge>
                            )}
                          </td>
                          {(["a", "b"] as const).map((side) => {
                            const val = side === "a" ? va : vb;
                            return (
                              <td key={side} className="p-2">
                                <label className="flex items-start gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    className="mt-1"
                                    checked={mergeChoices[f.key as string] === side}
                                    onChange={() =>
                                      setMergeChoices((p) => ({ ...p, [f.key as string]: side }))
                                    }
                                  />
                                  <span
                                    className={`break-words ${
                                      mergeChoices[f.key as string] === side ? "font-semibold" : "text-muted-foreground"
                                    }`}
                                  >
                                    {String(val) || <span className="italic">— vacío —</span>}
                                  </span>
                                </label>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="rounded-[10px] bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
                Al confirmar: se actualizará el Registro {keepRow.toUpperCase()} con los valores elegidos y se
                eliminará el otro registro. Esta acción no se puede deshacer.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeOpen(false)} disabled={merging}>
              Cancelar
            </Button>
            <Button variant="blue" onClick={performMerge} disabled={merging}>
              {merging ? "Uniendo..." : "Confirmar unión"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Screening</DialogTitle>
            <DialogDescription>
              {selected && `${selectedConfig.title} · Iniciado ${formatDate(selected.started_at)}`}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <p className="text-base font-semibold text-muted-foreground uppercase">Familiar</p>
                  <p className="text-base">
                    {[selected.caregiver_name, selected.caregiver_lastname].filter(Boolean).join(" ") ||
                      selectedContact.name ||
                      "—"}
                  </p>
                </div>
                <div>
                  <p className="text-base font-semibold text-muted-foreground uppercase">Niño/a</p>
                  <p className="text-base">{selected.child_name || "—"}</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-muted-foreground uppercase">Email</p>
                  <p className="text-base">{selectedContact.email || "—"}</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-muted-foreground uppercase">WhatsApp</p>
                  <p className="text-base">{selectedContact.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-muted-foreground uppercase">Nacimiento</p>
                  <p className="text-base">{formatDateOnly(selected.child_birthdate)}</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-muted-foreground uppercase">Código Postal</p>
                  <p className="text-base">{selected.postal_code || "—"}</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-muted-foreground uppercase">Estado</p>
                  <div className="mt-1">{statusBadge(selected.status)}</div>
                </div>
                <div>
                  <p className="text-base font-semibold text-muted-foreground uppercase">Riesgo (interno)</p>
                  <div className="mt-1">{riskBadge(selected.status, selected.risk_level)}</div>
                </div>
                <div>
                  <p className="text-base font-semibold text-muted-foreground uppercase">Score</p>
                  <p className="text-base">{selected.score ?? "—"}</p>
                </div>
                <div>
                  <p className="text-base font-semibold text-muted-foreground uppercase">Cierre</p>
                  <p className="text-base">{formatDate(selected.completed_at)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Respuestas</h3>
                {renderAnswers(selectedConfig, selected.answers)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiagnosticoSection;
