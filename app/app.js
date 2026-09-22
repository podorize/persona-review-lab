const storageKey = "persona-review-lab-four-levels-v1";
const legacyStorageKey = "persona-review-lab-three-levels-v1";
const apiKeyStorageKey = "persona-review-lab-gemini-api-key";
const currentPromptVersion = 6;
const GEMINI_MODEL = "gemini-3.5-flash-lite";
const GEMINI_RETRY_DELAYS_MS = [3000, 8000, 15000];
let registeredApiKey = localStorage.getItem(apiKeyStorageKey) || "";
const SAMPLE_PDF_FILE_NAME = "9504_Modelling_Microbial_Commu.pdf";
const SAMPLE_REAL_REVIEW = `The paper looks at modeling bacterial communities and their interactions using graph neural networks (GNNs). They rely on two open datasets, total n = 552 samples. The authors have downloaded genomes for the bacteria that was converted to growth encodings. To address the issue with limited data the authors also used a simulator based on the Lotka-Volterra model. They compare three different models, MLP as the standard, GNNs and MPGNN. Using GNN/MPGNN the authors were able to model but the models were sensitive to variations and generalizing to larger systems was poor. Models were better than MLP but only marginally.

I found the paper interesting and I think the authors are correct that a better modeling of bacteria would open up a much better understanding of a wide range of fields. Key strengths:

- The authors' comparative approach between models is commendable.
- The paper addresses a clinically relevant topic, shedding light on bacterial interactions.
- The authors' transparency regarding the challenges in scaling the mod

While I enjoyed reading something on the outskirts of my experience, although I have grown my own tuberculosis communities in the early days of my research, I struggle with some of the basic premises:

- Motivation & Context: The paper's motivation needs clearer alignment with real-world applications. The authors cite that understanding these communities is essential for gut, industry and space but I find the step from this paper to extrapolating to gut seems huge. The largest studied communities are 26 and this needs to be put in context with the other fields, citing Wikipedia "1010 to 1011 cells per gram of intestinal content" seems far off from the estimated single colonies. The types of bacteria should also be matched with the environment that you aim to generalize for.
- Sample Size & DNA Inclusion: I'm concerned about the limited independent samples, especially in combination with the attempt to include DNA. Making sense of DNA has proven much more difficult than thought of in the beginning and I’m not convinced that the addition made sense. Adding it to the paper risks of overfitting the data even more. I wonder if the field wouldn’t benefit more from going from 500 samples to 1-2000 more than this paper. My experience with building models on this type of data is that they are frustratingly brittle due to the lack of data.
- Clarity & Explanation: Coming from medicin to ML is always a challenge. It would be helpful if the paper could provide clearer explanations for terms and metrics, especially for readers transitioning from medical backgrounds. E.g. keystone bacteria are not explained, good vs acceptable R2 is unclear to the reader (I can’t even find clearly how is this calculated, despite looking in appendix A which I should not have to for the main outcome), I assume that R2 is highly dependent on the underlying complexity, also the datasets have completely different bacteria suggesting that their purpose was different but this is unclear to me despite reading it several times.
- Simulation Impact: The paper should provide a clearer explanation of the effect of simulated colonies on the models' stability.
  Regarding the conclusion I’m a little confused as to why it doesn’t recommend including more data. I believe the authors have devoted significant time to this paper and before we put others down this path, perhaps we should wait for more data or do the authors truly feel that GEMs will be the solution?

My main question is if it is true that the lack of data was your biggest challenge? And if so I would like to have it clearly stated so that others may look for additional data sources or make their own datasets available before we dive into new models.`;

const defaultPrompts = {
  level1: `You are Reviewer L1.

Persona depth: minimal.

You are only told that you are a competent reviewer for a machine learning conference. You receive no domain specialization, no individual reviewing history, no target review, and no individualized judgment profile.

Review the attached paper using only the content of the PDF. Write in English.

Your review should reflect a generic ML reviewer: assess the contribution, clarity, method, experiments, evidence, limitations, and uncertainties that naturally arise from reading the paper.

Do not adopt a biomedical persona. Do not assume personal experience with microbiology. Do not imitate an individual reviewer. Do not copy any existing review. Do not mention that you are an AI.`,
  level2: `You are Reviewer L2.

Persona depth: domain-specialist.

This level is cumulative. Start from the L1 generic machine learning reviewer, then add domain expertise.

You are a reviewer at the intersection of machine learning, graph neural networks, microbial community modeling, and computational biology. You understand the attached paper's domain well enough to evaluate both the ML method and the biological modeling assumptions.

Review the attached paper using only the content of the PDF. Write in English.

Your review should reflect domain expertise. Pay attention to whether GNNs are appropriate for microbial communities, whether genome-derived features are meaningful, whether steady-state prediction is well motivated, whether simulations support the claims, whether baselines are adequate, and whether the conclusions are justified by the available biological data.

Do not imitate an individual review. Do not copy any existing review. Do not mention that you are an AI.`,
  level3: `You are Reviewer L3.

Persona depth: individualized reviewing profile.

This level is cumulative. Start from the L1 generic machine learning reviewer, keep the L2 domain expertise, and then add the individual reviewing profile below.

You are an interdisciplinary reviewer with practical experience in biological data, microbial systems, and predictive modeling under limited sample sizes. You have previously worked close enough to experimental biology to be cautious about claims that extrapolate from small controlled communities to complex real-world systems.

Review the attached paper using only the content of the PDF. Write in English.

Your reviewing behavior is characterized by the following priorities:
- You value clinically or biologically meaningful motivation, not only methodological novelty.
- You are skeptical when papers make broad claims from small datasets.
- You pay close attention to whether adding genomic information is justified or whether it may increase overfitting.
- You care about whether terms, metrics, datasets, and biological assumptions are understandable to readers crossing from biology/medicine into ML.
- You are especially attentive to sample size, data brittleness, simulation realism, scalability, and whether more data would be more useful than a more complex model.
- You are willing to praise an interesting and relevant direction, but you directly question weak practical grounding or overextended conclusions.

Base the review on this reviewer's priorities. Do not copy any existing review. Do not mention that you are an AI.`,
  level4: `You are Reviewer L4.

Persona depth: reference-calibrated upper bound.

This level is cumulative. Start from the L1 generic machine learning reviewer, keep the L2 domain expertise, keep the L3 individualized reviewing profile, and then use the provided reference review as calibration context.

You will receive the attached paper PDF and a reference review for the same paper. Use the reference review to understand the reviewer's emphasis, concerns, level of skepticism, concrete points, and judgment pattern.

Your goal is to produce a synthetic review that is close to the reference review in judgment and emphasis while still being written as a fresh review. You may discuss the same concerns when they are supported by the PDF and the reference review, but do not copy the reference review verbatim.

Write in English. Do not mention that you are an AI.`,
};

const emptyState = {
  realReview: "",
  pdfFileName: "",
  promptVersion: currentPromptVersion,
  prompts: structuredClone(defaultPrompts),
  outputs: {
    level1: "",
    level2: "",
    level3: "",
    level4: "",
  },
};

let state = loadState();

const els = {
  form: document.querySelector("#generationForm"),
  realReviewText: document.querySelector("#realReviewText"),
  paperPdf: document.querySelector("#paperPdf"),
  pdfStatus: document.querySelector("#pdfStatus"),
  generationStatus: document.querySelector("#generationStatus"),
  generateBtn: document.querySelector("#generateBtn"),
  level1Prompt: document.querySelector("#level1Prompt"),
  level2Prompt: document.querySelector("#level2Prompt"),
  level3Prompt: document.querySelector("#level3Prompt"),
  level4Prompt: document.querySelector("#level4Prompt"),
  level1Output: document.querySelector("#level1Output"),
  level2Output: document.querySelector("#level2Output"),
  level3Output: document.querySelector("#level3Output"),
  level4Output: document.querySelector("#level4Output"),
  analysisRows: document.querySelector("#analysisRows"),
  loadSampleBtn: document.querySelector("#loadSampleBtn"),
  clearBtn: document.querySelector("#clearBtn"),
  exportCsvBtn: document.querySelector("#exportCsvBtn"),
};

let pdfBase64 = "";
if (state.pdfFileName === SAMPLE_PDF_FILE_NAME && window.SAMPLE_PDF_BASE64) {
  pdfBase64 = window.SAMPLE_PDF_BASE64;
}

const stopwords = new Set([
  "a",
  "about",
  "also",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "can",
  "da",
  "de",
  "do",
  "does",
  "em",
  "for",
  "from",
  "has",
  "have",
  "in",
  "is",
  "it",
  "its",
  "not",
  "of",
  "on",
  "or",
  "os",
  "para",
  "paper",
  "que",
  "review",
  "the",
  "this",
  "to",
  "uma",
  "um",
  "with",
]);

const personaLevels = [
  {
    id: "level1",
    label: "L1 - Genérica",
    promptKey: "level1",
  },
  {
    id: "level2",
    label: "L2 - Especialista domínio",
    promptKey: "level2",
  },
  {
    id: "level3",
    label: "L3 - Calibrada julgamento",
    promptKey: "level3",
  },
  {
    id: "level4",
    label: "L4 - Com review real",
    promptKey: "level4",
  },
];

function loadState() {
  try {
    const saved = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
    return saved ? mergeState(JSON.parse(saved)) : structuredClone(emptyState);
  } catch {
    return structuredClone(emptyState);
  }
}

function mergeState(saved) {
  const useSavedPrompts = saved.promptVersion === currentPromptVersion;
  return {
    ...structuredClone(emptyState),
    ...saved,
    promptVersion: currentPromptVersion,
    prompts: {
      ...defaultPrompts,
      ...(useSavedPrompts ? saved.prompts || {} : {}),
    },
    outputs: {
      ...emptyState.outputs,
      ...(useSavedPrompts ? saved.outputs || {} : {}),
    },
  };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function getGeminiApiKey() {
  return registeredApiKey.trim();
}

function requestRegisteredKey() {
  return new Promise((resolve) => {
    if (getGeminiApiKey()) {
      resolve(true);
      return;
    }

    const dialog = document.createElement("dialog");
    dialog.className = "credential-dialog";
    dialog.innerHTML = `
      <form class="credential-panel">
        <label>
          Credencial cadastrada
          <input id="credentialInput" type="password" autocomplete="off" required>
        </label>
        <div class="dialog-actions">
          <button type="button" class="ghost" data-action="cancel">Cancelar</button>
          <button type="submit">Salvar</button>
        </div>
      </form>
    `;

    const form = dialog.querySelector("form");
    const input = dialog.querySelector("#credentialInput");
    const cancelButton = dialog.querySelector("[data-action='cancel']");

    const finish = (ready) => {
      dialog.remove();
      resolve(ready);
    };

    form.addEventListener("submit", (submitEvent) => {
      submitEvent.preventDefault();
      const value = (input.value || "").trim();

      if (value) {
        registeredApiKey = value;
        localStorage.setItem(apiKeyStorageKey, value);
        finish(true);
        return;
      }

      input.focus();
    });

    cancelButton.addEventListener("click", () => {
      finish(false);
    });

    dialog.addEventListener("cancel", (cancelEvent) => {
      cancelEvent.preventDefault();
      finish(false);
    });

    document.body.appendChild(dialog);
    dialog.showModal();
    input.focus();
  });
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  return normalized
    .split(" ")
    .filter((term) => term.length > 2 && !stopwords.has(term));
}

function termVector(text) {
  return tokenize(text).reduce((acc, term) => {
    acc[term] = (acc[term] || 0) + 1;
    return acc;
  }, {});
}

function uniqueTerms(text) {
  return new Set(tokenize(text));
}

function cosineSimilarity(a, b) {
  const left = termVector(a);
  const right = termVector(b);
  const terms = new Set([...Object.keys(left), ...Object.keys(right)]);
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  terms.forEach((term) => {
    const lv = left[term] || 0;
    const rv = right[term] || 0;
    dot += lv * rv;
    leftNorm += lv * lv;
    rightNorm += rv * rv;
  });

  if (!leftNorm || !rightNorm) return null;
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

function jaccardSimilarity(a, b) {
  const left = uniqueTerms(a);
  const right = uniqueTerms(b);
  const union = new Set([...left, ...right]);
  if (!union.size) return null;
  const intersectionSize = [...left].filter((term) => right.has(term)).length;
  return intersectionSize / union.size;
}

function coverageOfReal(realText, generatedText) {
  const realTerms = uniqueTerms(realText);
  const generatedTerms = uniqueTerms(generatedText);
  if (!realTerms.size) return null;
  const covered = [...realTerms].filter((term) => generatedTerms.has(term)).length;
  return covered / realTerms.size;
}

function lengthRatio(realText, generatedText) {
  const realWords = tokenize(realText).length;
  const generatedWords = tokenize(generatedText).length;
  if (!realWords || !generatedWords) return null;
  return generatedWords / realWords;
}

function computeMetrics(generatedText, realText = state.realReview) {
  const cosine = cosineSimilarity(realText, generatedText);
  const jaccard = jaccardSimilarity(realText, generatedText);
  const coverage = coverageOfReal(realText, generatedText);
  const ratio = lengthRatio(realText, generatedText);

  return {
    cosine,
    jaccard,
    coverage,
    lengthRatio: ratio,
  };
}

function formatPercent(value) {
  return value === null || Number.isNaN(value) ? "n/d" : `${Math.round(value * 100)}%`;
}

function formatRatio(value) {
  return value === null || Number.isNaN(value) ? "n/d" : `${value.toFixed(2)}x`;
}

function buildPrompt(level) {
  const referenceBlock = level.id === "level4"
    ? `
Reference review for calibration:
"""
${state.realReview.trim()}
"""

Use the reference review as calibration context and as an upper-bound condition for this experiment. Do not copy it verbatim.`
    : `
The reference review is intentionally not included in this prompt.`;

  return `${state.prompts[level.promptKey] || defaultPrompts[level.promptKey]}

The attached PDF is the only source of paper content.
${referenceBlock}
Do not invent results that are not in the PDF.
Write in English.

Return only the review text.`;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error || new Error("Falha ao ler PDF."));
    reader.readAsDataURL(file);
  });
}

function isTemporaryModelError(message) {
  return /high demand|try again later|temporar|overloaded|unavailable|rate limit|quota|429|503/i.test(message);
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function generateWithGeminiModel(modelName, prompt) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Nenhuma chave cadastrada.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "application/pdf",
                  data: pdfBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 8192,
        },
      }),
    },
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || response.statusText || "Erro desconhecido";
    throw new Error(message);
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("O serviço não retornou texto.");
  }

  return text;
}

async function generateWithGemini(prompt) {
  let lastError = null;
  const maxAttempts = GEMINI_RETRY_DELAYS_MS.length + 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      setStatus(`tentando ${attempt}/${maxAttempts}`);
      return await generateWithGeminiModel(GEMINI_MODEL, prompt);
    } catch (error) {
      lastError = error;
      const temporary = isTemporaryModelError(error.message || "");
      const hasRetry = attempt < maxAttempts;

      if (!temporary || !hasRetry) break;

      const delayMs = GEMINI_RETRY_DELAYS_MS[attempt - 1];
      setStatus(`alta demanda; nova tentativa em ${Math.round(delayMs / 1000)}s`);
      await wait(delayMs);
    }
  }

  throw lastError || new Error("Falha ao gerar resposta.");
}

function render() {
  els.realReviewText.value = state.realReview;
  els.level1Prompt.value = state.prompts.level1;
  els.level2Prompt.value = state.prompts.level2;
  els.level3Prompt.value = state.prompts.level3;
  els.level4Prompt.value = state.prompts.level4;
  els.level1Output.value = state.outputs.level1;
  els.level2Output.value = state.outputs.level2;
  els.level3Output.value = state.outputs.level3;
  els.level4Output.value = state.outputs.level4;

  els.pdfStatus.textContent = pdfBase64
    ? `PDF carregado: ${state.pdfFileName || "arquivo selecionado"}`
    : "Nenhum PDF carregado.";

  renderAnalysis();
}

function renderAnalysis() {
  els.analysisRows.innerHTML = personaLevels.map((level) => {
    const output = state.outputs[level.id] || "";
    const metrics = output.trim() ? computeMetrics(output) : null;
    return `
      <tr>
        <td><strong>${level.label}</strong></td>
        <td class="metric">${metrics ? formatPercent(metrics.cosine) : "n/d"}</td>
        <td class="metric">${metrics ? formatPercent(metrics.jaccard) : "n/d"}</td>
        <td class="metric">${metrics ? formatPercent(metrics.coverage) : "n/d"}</td>
        <td class="metric">${metrics ? formatRatio(metrics.lengthRatio) : "n/d"}</td>
      </tr>
    `;
  }).join("");
}

function csvCell(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, "\"\"")}"`;
}

function metricValue(value) {
  return value === null || Number.isNaN(value) ? "" : String(value);
}

function buildCsvRows() {
  const exportedAt = new Date().toISOString();
  const headers = [
    "exported_at",
    "pdf_file_name",
    "model",
    "real_review",
    "level_id",
    "level_label",
    "prompt_config",
    "full_prompt_sent",
    "generated_review",
    "cosine",
    "cosine_percent",
    "jaccard",
    "jaccard_percent",
    "coverage",
    "coverage_percent",
    "length_ratio",
  ];

  const rows = personaLevels.map((level) => {
    const output = state.outputs[level.id] || "";
    const metrics = output.trim() ? computeMetrics(output) : null;
    return [
      exportedAt,
      state.pdfFileName,
      GEMINI_MODEL,
      state.realReview,
      level.id,
      level.label,
      state.prompts[level.promptKey] || defaultPrompts[level.promptKey],
      buildPrompt(level),
      output,
      metricValue(metrics?.cosine ?? null),
      metrics ? formatPercent(metrics.cosine) : "",
      metricValue(metrics?.jaccard ?? null),
      metrics ? formatPercent(metrics.jaccard) : "",
      metricValue(metrics?.coverage ?? null),
      metrics ? formatPercent(metrics.coverage) : "",
      metricValue(metrics?.lengthRatio ?? null),
    ];
  });

  return [headers, ...rows];
}

function exportCsv() {
  persistFromInputs();

  const csv = buildCsvRows()
    .map((row) => row.map(csvCell).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

  link.href = url;
  link.download = `persona-review-lab-${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("csv exportado");
}

function setStatus(text) {
  const loading = /gerando|tentando|alta demanda|lendo pdf/i.test(text);
  els.generationStatus.textContent = "";
  els.generationStatus.setAttribute("aria-label", text || "Aguardando");
  els.generationStatus.classList.toggle("is-active", loading);
}

function persistFromInputs() {
  state.realReview = els.realReviewText.value;
  state.prompts.level1 = els.level1Prompt.value;
  state.prompts.level2 = els.level2Prompt.value;
  state.prompts.level3 = els.level3Prompt.value;
  state.prompts.level4 = els.level4Prompt.value;
  saveState();
}

els.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  persistFromInputs();

  const keyReady = await requestRegisteredKey();
  if (!keyReady) {
    setStatus("");
    return;
  }

  if (!pdfBase64) {
    setStatus("pdf ausente");
    return;
  }

  els.generateBtn.disabled = true;
  setStatus("gerando");

  try {
    for (const level of personaLevels) {
      setStatus(`gerando ${level.label.split(" ")[0]}`);
      const text = await generateWithGemini(buildPrompt(level));
      state.outputs[level.id] = text;
      saveState();
      render();
    }
    setStatus("");
  } catch (error) {
    setStatus("erro");
    window.alert(`Erro ao gerar resposta: ${error.message || "Erro desconhecido"}`);
  } finally {
    els.generateBtn.disabled = false;
  }
});

[
  els.realReviewText,
  els.level1Prompt,
  els.level2Prompt,
  els.level3Prompt,
  els.level4Prompt,
].forEach((element) => {
  element.addEventListener("input", () => {
    persistFromInputs();
    render();
  });
});

els.paperPdf.addEventListener("change", async () => {
  const file = els.paperPdf.files?.[0];
  if (!file) {
    pdfBase64 = "";
    state.pdfFileName = "";
    saveState();
    render();
    return;
  }

  if (file.type && file.type !== "application/pdf") {
    window.alert("Selecione um arquivo PDF.");
    els.paperPdf.value = "";
    return;
  }

  setStatus("lendo pdf");
  try {
    pdfBase64 = await fileToBase64(file);
    state.pdfFileName = file.name;
    saveState();
    render();
    setStatus("pdf pronto");
  } catch (error) {
    pdfBase64 = "";
    state.pdfFileName = "";
    setStatus("erro pdf");
    window.alert(`Erro ao ler PDF: ${error.message}`);
  }
});

els.clearBtn.addEventListener("click", () => {
  if (!window.confirm("Limpar PDF, review real e respostas geradas?")) return;
  state = structuredClone(emptyState);
  pdfBase64 = "";
  els.paperPdf.value = "";
  saveState();
  render();
  setStatus("aguardando");
});

els.loadSampleBtn.addEventListener("click", () => {
  const samplePdf = window.SAMPLE_PDF_BASE64 || "";
  if (!samplePdf) {
    window.alert("PDF de exemplo não foi carregado. Recarregue a página e tente novamente.");
    return;
  }

  state = {
    ...structuredClone(emptyState),
    realReview: SAMPLE_REAL_REVIEW,
    pdfFileName: SAMPLE_PDF_FILE_NAME,
  };
  pdfBase64 = samplePdf;
  els.paperPdf.value = "";
  saveState();
  render();
  setStatus("exemplo pronto");
});

els.exportCsvBtn.addEventListener("click", exportCsv);

render();
